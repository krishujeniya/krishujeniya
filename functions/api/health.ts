interface PagesContext {
  request: Request;
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url);
  return new Response(
    JSON.stringify({
      status: "ready",
      runtime: "cloudflare-pages-edge",
      timestamp: new Date().toISOString(),
      host: url.hostname,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
