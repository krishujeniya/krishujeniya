interface PagesContext {
  request: Request;
  env?: Record<string, string>;
}

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ALLOWED_ORIGINS = new Set([
  "https://krishujeniya.pages.dev",
  "https://krishujeniya.github.io",
]);

const ALLOWED_HOSTS = new Set([
  "krishujeniya.pages.dev",
  "krishujeniya.github.io",
]);

const rateLimitStore = new Map<string, RateLimitRecord>();

function isOriginAllowed(originHeader: string | null, refererHeader: string | null): boolean {
  if (originHeader) {
    return ALLOWED_ORIGINS.has(originHeader);
  }
  if (refererHeader) {
    try {
      const parsed = new URL(refererHeader);
      return parsed.protocol === "https:" && ALLOWED_HOSTS.has(parsed.hostname);
    } catch {
      return false;
    }
  }
  // Requests without origin/referer (e.g. direct curl or internal edge proxy)
  return false;
}

function getClientIp(request: Request): string {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp && cfIp.trim().length > 0) {
    return cfIp.trim();
  }
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor && forwardedFor.trim().length > 0) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return "unknown";
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
    if (existing.count >= 10) {
      return false;
    }
    existing.count += 1;
    return true;
  }
  rateLimitStore.set(ip, { count: 1, resetAt: now + 600000 });
  return true;
}

export async function onRequestOptions(context: PagesContext): Promise<Response> {
  const origin = context.request.headers.get("origin");
  const headers = new Headers();

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Access-Control-Max-Age", "86400");
    return new Response(null, { status: 204, headers });
  }

  return new Response(JSON.stringify({ detail: "Disallowed CORS origin" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const { request } = context;
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // 1. Strict Origin / Source Validation
  if (!isOriginAllowed(origin, referer)) {
    return new Response(JSON.stringify({ detail: "Unauthorized request source." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Edge-Level IP Rate Limiting
  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({ detail: "Too many requests. Please wait a few minutes before trying again." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      }
    );
  }

  // 3. Payload Extraction and Parsing
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ detail: "Malformed JSON payload." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 4. Honeypot Bot Filtering (Silent Discard)
  const honeypot = typeof payload["honeypot"] === "string" ? payload["honeypot"].trim() : "";
  const submissionId = typeof payload["submissionId"] === "string" ? payload["submissionId"] : "accepted";

  if (honeypot.length > 0) {
    const headers = new Headers({ "Content-Type": "application/json" });
    if (origin && ALLOWED_ORIGINS.has(origin)) {
      headers.set("Access-Control-Allow-Origin", origin);
    }
    return new Response(JSON.stringify({ ok: true, submissionId }), {
      status: 200,
      headers,
    });
  }

  // 5. Input Validation
  const name = typeof payload["name"] === "string" ? payload["name"].trim() : "";
  const email = typeof payload["email"] === "string" ? payload["email"].trim() : "";
  const message = typeof payload["message"] === "string" ? payload["message"].trim() : "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || name.length > 100 || !email || email.length > 120 || !emailRegex.test(email) || !message || message.length > 3000) {
    return new Response(JSON.stringify({ detail: "Validation error on server. Please check your inputs." }), {
      status: 422,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 6. Upstream Forwarding to Persistence Engine
  try {
    const upstreamUrl = context.env?.UPSTREAM_API_URL || "https://krishujeniya-backend.vercel.app/api/webDATA";
    const upstreamHeaders = new Headers();
    upstreamHeaders.set("Content-Type", "application/json");
    upstreamHeaders.set("Origin", "https://krishujeniya.pages.dev");
    upstreamHeaders.set("CF-Connecting-IP", clientIp);
    upstreamHeaders.set("X-Forwarded-For", clientIp);

    const upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      headers: upstreamHeaders,
      body: JSON.stringify(payload),
    });

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "application/json");
    responseHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    if (origin && ALLOWED_ORIGINS.has(origin)) {
      responseHeaders.set("Access-Control-Allow-Origin", origin);
    }

    if (upstreamResponse.ok) {
      let finalSubmissionId = submissionId;
      try {
        const data = (await upstreamResponse.json()) as Record<string, unknown>;
        if (typeof data["submissionId"] === "string") {
          finalSubmissionId = data["submissionId"];
        }
      } catch {
        // Fallback to initial submissionId
      }
      return new Response(JSON.stringify({ ok: true, submissionId: finalSubmissionId }), {
        status: 200,
        headers: responseHeaders,
      });
    }

    return new Response(
      JSON.stringify({ detail: "Unable to process request. Please try again later." }),
      {
        status: 400,
        headers: responseHeaders,
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ detail: "Service temporarily unavailable. Please try again later." }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function onRequestGet(): Promise<Response> {
  return new Response(JSON.stringify({ detail: "Method not allowed. Use POST." }), {
    status: 405,
    headers: {
      "Content-Type": "application/json",
      "Allow": "POST, OPTIONS",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}

export async function onRequestHead(): Promise<Response> {
  return new Response(null, {
    status: 405,
    headers: {
      "Allow": "POST, OPTIONS",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}
