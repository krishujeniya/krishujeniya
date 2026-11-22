export interface Env {
  DB?: {
    prepare: (query: string) => {
      bind: (...args: unknown[]) => {
        run: () => Promise<unknown>;
      };
      run: () => Promise<unknown>;
    };
  };
  SHARED_CONFIG_KV?: {
    put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
    get: (key: string) => Promise<string | null>;
  };
  AI?: {
    run: (model: string, input: unknown) => Promise<unknown>;
  };
  UPSTREAM_API_URL?: string;
  ENVIRONMENT?: string;
}

const ALLOWED_ORIGINS = new Set([
  "https://krishujeniya.pages.dev",
  "https://krishujeniya.github.io",
]);

const IP_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}$/;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function sanitizeString(val: unknown, maxLen: number, fallback = ""): string {
  if (typeof val !== "string") return fallback;
  const cleaned = val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  return cleaned.slice(0, maxLen);
}

function getCorsHeaders(origin: string | null): Headers {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  if (origin && (ALLOWED_ORIGINS.has(origin) || origin.endsWith(".krishujeniya.pages.dev"))) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
  }
  return headers;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (rateLimitStore.size > 1000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (now >= value.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }
  const existing = rateLimitStore.get(ip);
  if (existing && now < existing.resetAt) {
    if (existing.count >= 10) return false;
    existing.count += 1;
    return true;
  }
  rateLimitStore.set(ip, { count: 1, resetAt: now + 600000 });
  return true;
}

const workerHandler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("origin");

    if (request.method === "OPTIONS") {
      const headers = getCorsHeaders(origin);
      headers.set("Access-Control-Max-Age", "86400");
      return new Response(null, { status: 204, headers });
    }

    if (url.pathname === "/health" || url.pathname === "/healthz" || url.pathname === "/api/health") {
      const headers = getCorsHeaders(origin);
      return new Response(
        JSON.stringify({
          status: "ready",
          service: "api-worker",
          edge: "cloudflare-workers",
          bindings: {
            d1: Boolean(env.DB),
            kv: Boolean(env.SHARED_CONFIG_KV),
            ai: Boolean(env.AI),
          },
          timestamp: new Date().toISOString(),
        }),
        { status: 200, headers }
      );
    }

    if (url.pathname === "/api/ai" && request.method === "POST") {
      const headers = getCorsHeaders(origin);
      try {
        const body = (await request.json()) as { prompt?: string };
        const prompt = typeof body?.prompt === "string" ? body.prompt.slice(0, 500) : "";
        if (!prompt) {
          return new Response(JSON.stringify({ error: "Missing prompt parameter" }), { status: 400, headers });
        }
        if (env.AI) {
          const result = await env.AI.run("@cf/meta/llama-3-8b-instruct", { prompt });
          return new Response(JSON.stringify({ ok: true, result }), { status: 200, headers });
        }
        return new Response(JSON.stringify({ ok: true, message: "AI binding initialized" }), { status: 200, headers });
      } catch {
        return new Response(JSON.stringify({ error: "AI execution error" }), { status: 500, headers });
      }
    }

    if ((url.pathname === "/api/webDATA" || url.pathname === "/webDATA") && request.method === "POST") {
      const headers = getCorsHeaders(origin);

      const contentLength = request.headers.get("content-length");
      if (contentLength && parseInt(contentLength, 10) > 64 * 1024) {
        return new Response(JSON.stringify({ detail: "Payload exceeds 64KB size limit." }), { status: 413, headers });
      }

      let clientIp = "127.0.0.1";
      const cfIp = request.headers.get("cf-connecting-ip");
      if (cfIp && IP_REGEX.test(cfIp.trim())) {
        clientIp = cfIp.trim();
      }

      if (!checkRateLimit(clientIp)) {
        headers.set("Retry-After", "60");
        return new Response(JSON.stringify({ detail: "Too many requests. Please wait a minute." }), { status: 429, headers });
      }

      let payload: Record<string, unknown>;
      try {
        payload = (await request.json()) as Record<string, unknown>;
      } catch {
        return new Response(JSON.stringify({ detail: "Malformed JSON payload." }), { status: 400, headers });
      }

      const honeypot = sanitizeString(payload["honeypot"], 100);
      const submissionId = sanitizeString(payload["submissionId"], 100, "accepted");
      if (honeypot.length > 0) {
        return new Response(JSON.stringify({ ok: true, submissionId }), { status: 200, headers });
      }

      const name = sanitizeString(payload["name"], 100);
      const email = sanitizeString(payload["email"], 120);
      const message = sanitizeString(payload["message"], 3000);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !emailRegex.test(email) || !message) {
        return new Response(JSON.stringify({ detail: "Validation error on server. Please check your inputs." }), { status: 422, headers });
      }

      const sanitizedPayload: Record<string, unknown> = {
        name,
        email,
        message,
        company: sanitizeString(payload["company"], 150, "Not provided"),
        role: sanitizeString(payload["role"], 100, "Not provided"),
        submissionId,
      };

      if (env.DB) {
        try {
          await env.DB.prepare(
            `CREATE TABLE IF NOT EXISTS contact_inquiries (
              id TEXT PRIMARY KEY,
              name TEXT,
              email TEXT,
              company TEXT,
              role TEXT,
              message TEXT,
              created_at TEXT
            )`
          ).run().catch(() => {});

          await env.DB.prepare(
            `INSERT INTO contact_inquiries (id, name, email, company, role, message, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            submissionId,
            name,
            email,
            (sanitizedPayload["company"] as string) || "Not provided",
            (sanitizedPayload["role"] as string) || "Not provided",
            message,
            new Date().toISOString()
          ).run().catch(() => {});
        } catch {
          // Non-blocking resilience
        }
      }

      if (env.SHARED_CONFIG_KV) {
        try {
          await env.SHARED_CONFIG_KV.put(
            `inquiry:${submissionId}`,
            JSON.stringify({ ...sanitizedPayload, clientIp, timestamp: new Date().toISOString() }),
            { expirationTtl: 2592000 }
          ).catch(() => {});
        } catch {
          // Non-blocking resilience
        }
      }

      if (env.UPSTREAM_API_URL) {
        try {
          await fetch(env.UPSTREAM_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sanitizedPayload),
          });
        } catch {
          // Non-blocking upstream notification
        }
      }

      return new Response(JSON.stringify({ ok: true, submissionId }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: getCorsHeaders(origin),
    });
  },
};

export default workerHandler;
