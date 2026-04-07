export const runtime = 'nodejs';

function json(body: object, init?: ResponseInit) {
  return Response.json(body, {
    headers: {
      'Cache-Control': 'no-store',
    },
    ...init,
  });
}

type AIParseRequestBody = {
  kind?: 'health' | 'diary' | 'money';
  transcript?: string;
};

async function parseRequestBody(request: Request): Promise<AIParseRequestBody | null> {
  try {
    return (await request.json()) as AIParseRequestBody;
  } catch {
    return null;
  }
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return json(
      { ok: false, error: 'method-not-allowed' },
      {
        status: 405,
        headers: {
          Allow: 'POST',
        },
      },
    );
  }

  const body = await parseRequestBody(request);

  return json(
    {
      ok: true,
      step: 'handler-entered',
      receivedKind: body?.kind ?? null,
      transcriptLength: body?.transcript?.length ?? 0,
      env: {
        aiProvider: process.env.AI_PROVIDER ?? null,
        openAIModel: process.env.OPENAI_MODEL ?? null,
        geminiModel: process.env.GEMINI_MODEL ?? null,
        hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
        hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      },
    },
    { status: 200 },
  );
}
