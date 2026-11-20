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

const MAX_PAYLOAD_BYTES = 64 * 1024; // 64 KB threshold
const IP_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}$/;

const rateLimitStore = new Map<string, RateLimitRecord>();

function sanitizeString(val: unknown, maxLen: number, fallback = ""): string {
  if (typeof val !== "string") return fallback;
  // Strip null bytes and control characters (preserves standard newlines/tabs)
  const cleaned = val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  return cleaned.slice(0, maxLen);
}

function isOriginAllowed(originHeader: string | null, refererHeader: string | null): boolean {
  if (originHeader) {
    if (ALLOWED_ORIGINS.has(originHeader)) return true;
    try {
      const parsed = new URL(originHeader);
      if (parsed.protocol === "https:" && (parsed.hostname === "krishujeniya.pages.dev" || parsed.hostname.endsWith(".krishujeniya.pages.dev"))) {
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }
  if (refererHeader) {
    try {
      const parsed = new URL(refererHeader);
      if (parsed.protocol === "https:" && (ALLOWED_HOSTS.has(parsed.hostname) || parsed.hostname.endsWith(".krishujeniya.pages.dev"))) {
        return true;
      }
    } catch {
      return false;
    }
  }
  return false;
}

function getClientIp(request: Request): string {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp && IP_REGEX.test(cfIp.trim())) {
    return cfIp.trim();
  }
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp && IP_REGEX.test(firstIp)) {
      return firstIp;
    }
  }
  return "127.0.0.1";
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

  if (origin && (ALLOWED_ORIGINS.has(origin) || origin.endsWith(".krishujeniya.pages.dev"))) {
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

  // 2. Request Size Validation (Payload Bomb / Memory Exhaustion Defense)
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return new Response(JSON.stringify({ detail: "Payload exceeds 64KB size limit." }), {
      status: 413,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 3. Edge-Level IP Rate Limiting
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

  // 4. Payload Extraction and Parsing
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ detail: "Malformed JSON payload." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 5. Honeypot Bot Filtering (Silent Discard)
  const honeypot = sanitizeString(payload["honeypot"], 100);
  const submissionId = sanitizeString(payload["submissionId"], 100, "accepted");

  if (honeypot.length > 0) {
    const headers = new Headers({ "Content-Type": "application/json" });
    if (origin && (ALLOWED_ORIGINS.has(origin) || origin.endsWith(".krishujeniya.pages.dev"))) {
      headers.set("Access-Control-Allow-Origin", origin);
    }
    return new Response(JSON.stringify({ ok: true, submissionId }), {
      status: 200,
      headers,
    });
  }

  // 6. Strict Input Validation & Schema Sanitation
  const name = sanitizeString(payload["name"], 100);
  const email = sanitizeString(payload["email"], 120);
  const message = sanitizeString(payload["message"], 3000);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || name.length > 100 || !email || email.length > 120 || !emailRegex.test(email) || !message || message.length > 3000) {
    return new Response(JSON.stringify({ detail: "Validation error on server. Please check your inputs." }), {
      status: 422,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 7. Schema Whitelisting (Defends against Object Injection / Mass Assignment)
  const sanitizedPayload: Record<string, unknown> = {
    name,
    email,
    message,
    company: sanitizeString(payload["company"], 150, "Not provided"),
    role: sanitizeString(payload["role"], 100, "Not provided"),
    services: Array.isArray(payload["services"])
      ? payload["services"].filter((s) => typeof s === "string").map((s) => sanitizeString(s, 100)).slice(0, 5)
      : [],
    stage: Array.isArray(payload["stage"])
      ? payload["stage"].filter((s) => typeof s === "string").map((s) => sanitizeString(s, 100)).slice(0, 5)
      : [],
    techStack: sanitizeString(payload["techStack"], 200, "Not provided"),
    budget: sanitizeString(payload["budget"], 50, "Not selected"),
    timeline: sanitizeString(payload["timeline"], 50, "Not selected"),
    discoverySource: sanitizeString(payload["discoverySource"], 100, "Not provided"),
    preferredContactMethod: sanitizeString(payload["preferredContactMethod"], 50, "Email"),
    submissionId,
    honeypot: "",
  };

  if (typeof payload["whatsappNumber"] === "string" && payload["whatsappNumber"].trim().length > 0) {
    sanitizedPayload["whatsappNumber"] = sanitizeString(payload["whatsappNumber"], 25);
  }

  // 8. Upstream Forwarding to Persistence Engine
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
      body: JSON.stringify(sanitizedPayload),
    });

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "application/json");
    responseHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    if (origin && (ALLOWED_ORIGINS.has(origin) || origin.endsWith(".krishujeniya.pages.dev"))) {
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
