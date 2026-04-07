import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      ok: false,
      error: 'method-not-allowed',
    });
  }

  const { kind, transcript } = (req.body ?? {}) as {
    kind?: 'health' | 'diary' | 'money';
    transcript?: string;
  };

  return res.status(200).json({
    ok: true,
    step: 'handler-entered',
    receivedKind: kind ?? null,
    transcriptLength: typeof transcript === 'string' ? transcript.length : 0,
    env: {
      aiProvider: process.env.AI_PROVIDER ?? null,
      openAIModel: process.env.OPENAI_MODEL ?? null,
      geminiModel: process.env.GEMINI_MODEL ?? null,
      hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    },
  });
}
