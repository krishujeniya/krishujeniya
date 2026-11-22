interface HealthContext {
  request: Request;
  env?: {
    DB?: unknown;
    SHARED_CONFIG_KV?: unknown;
    AI?: unknown;
  };
}

export async function onRequestGet(context: HealthContext): Promise<Response> {
  return new Response(
    JSON.stringify({
      status: "ready",
      edge: "cloudflare-pages",
      runtime: "edge-worker",
      bindings: {
        d1: Boolean(context.env?.DB),
        kv: Boolean(context.env?.SHARED_CONFIG_KV),
        ai: Boolean(context.env?.AI),
      },
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    }
  );
}

export async function onRequestHead(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}
