interface AIContext {
  request: Request;
  env?: {
    AI?: {
      run: (model: string, input: unknown) => Promise<unknown>;
    };
  };
}

export async function onRequestPost(context: AIContext): Promise<Response> {
  const origin = context.request.headers.get("origin");
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  if (origin && (origin === "https://krishujeniya.pages.dev" || origin.endsWith(".krishujeniya.pages.dev"))) {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  try {
    const body = (await context.request.json()) as { prompt?: string };
    const prompt = typeof body?.prompt === "string" ? body.prompt.slice(0, 500) : "";

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt parameter" }), {
        status: 400,
        headers,
      });
    }

    if (context.env?.AI) {
      const response = await context.env.AI.run("@cf/meta/llama-3-8b-instruct", {
        prompt,
      });
      return new Response(JSON.stringify({ ok: true, result: response }), {
        status: 200,
        headers,
      });
    }

    return new Response(JSON.stringify({ ok: true, message: "AI edge binding initialized" }), {
      status: 200,
      headers,
    });
  } catch {
    return new Response(JSON.stringify({ error: "AI execution error" }), {
      status: 500,
      headers,
    });
  }
}

export async function onRequestOptions(context: AIContext): Promise<Response> {
  const origin = context.request.headers.get("origin");
  const headers = new Headers();
  headers.set("Allow", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Access-Control-Max-Age", "86400");
  if (origin && (origin === "https://krishujeniya.pages.dev" || origin.endsWith(".krishujeniya.pages.dev"))) {
    headers.set("Access-Control-Allow-Origin", origin);
  }
  return new Response(null, { status: 204, headers });
}
