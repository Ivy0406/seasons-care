import {
  DIARY_EXTRACTION_PROMPT,
  DIARY_EXTRACTION_SCHEMA,
  HEALTH_EXTRACTION_PROMPT,
  HEALTH_EXTRACTION_SCHEMA,
  MONEY_EXTRACTION_PROMPT,
  MONEY_EXTRACTION_SCHEMA,
  isDiaryExtractionResult,
  isHealthExtractionResult,
  isMoneyExtractionResult,
} from '../../src/types/ai';

type AIProvider = 'gemini' | 'openai';
type ParseKind = 'health' | 'diary' | 'money';

type AIParseRequestBody = {
  kind?: ParseKind;
  transcript?: string;
};

type GeminiResponseBody = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

type OpenAIResponsesOutput = {
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

type VercelLikeRequest = {
  method?: string;
  body?: unknown;
};

type VercelLikeResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => VercelLikeResponse;
  json: (body: unknown) => void;
  end: (body?: string) => void;
};

function parseRequestBody(body: unknown): AIParseRequestBody | null {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as AIParseRequestBody;
    } catch {
      return null;
    }
  }

  if (typeof body === 'object' && body !== null) {
    return body as AIParseRequestBody;
  }

  return null;
}

function getAIProvider(): AIProvider {
  return process.env.AI_PROVIDER === 'openai' ? 'openai' : 'gemini';
}

function getGeminiModel() {
  return process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
}

function getOpenAIModel() {
  return process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
}

async function parseGeminiResponse(response: Response) {
  const responseBody = (await response.json()) as GeminiResponseBody;
  const responseText = responseBody.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof responseText !== 'string') {
    throw new Error('gemini-parser-empty-response');
  }

  return JSON.parse(responseText) as unknown;
}

async function parseOpenAIResponse(response: Response) {
  const responseBody = (await response.json()) as OpenAIResponsesOutput;
  const outputText = responseBody.output
    ?.flatMap((item) => item.content ?? [])
    .find((item) => item.type === 'output_text')?.text;

  if (typeof outputText !== 'string') {
    throw new Error('openai-parser-empty-response');
  }

  return JSON.parse(outputText) as unknown;
}

async function requestGeminiStructuredOutput(
  transcript: string,
  prompt: string,
  schema: object,
) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('gemini-parser-missing-key');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${getGeminiModel()}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${prompt}\n\n使用者語音轉文字：\n${transcript}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseJsonSchema: schema,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error('gemini-parser-request-failed');
  }

  return parseGeminiResponse(response);
}

async function requestOpenAIStructuredOutput(
  transcript: string,
  prompt: string,
  schema: object,
  schemaName: string,
) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('openai-parser-missing-key');
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: getOpenAIModel(),
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: prompt,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: transcript,
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: schemaName,
          strict: true,
          schema,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error('openai-parser-request-failed');
  }

  return parseOpenAIResponse(response);
}

async function parseHealthTranscript(transcript: string) {
  const parsedResponse =
    getAIProvider() === 'openai'
      ? await requestOpenAIStructuredOutput(
          transcript,
          HEALTH_EXTRACTION_PROMPT,
          HEALTH_EXTRACTION_SCHEMA,
          'health_extraction',
        )
      : await requestGeminiStructuredOutput(
          transcript,
          HEALTH_EXTRACTION_PROMPT,
          HEALTH_EXTRACTION_SCHEMA,
        );

  if (!isHealthExtractionResult(parsedResponse)) {
    throw new Error('health-parser-invalid-response');
  }

  return parsedResponse;
}

async function parseDiaryTranscript(transcript: string) {
  const parsedResponse =
    getAIProvider() === 'openai'
      ? await requestOpenAIStructuredOutput(
          transcript,
          DIARY_EXTRACTION_PROMPT,
          DIARY_EXTRACTION_SCHEMA,
          'diary_extraction',
        )
      : await requestGeminiStructuredOutput(
          transcript,
          DIARY_EXTRACTION_PROMPT,
          DIARY_EXTRACTION_SCHEMA,
        );

  if (!isDiaryExtractionResult(parsedResponse)) {
    throw new Error('diary-parser-invalid-response');
  }

  return parsedResponse;
}

async function parseMoneyTranscript(transcript: string) {
  const parsedResponse =
    getAIProvider() === 'openai'
      ? await requestOpenAIStructuredOutput(
          transcript,
          MONEY_EXTRACTION_PROMPT,
          MONEY_EXTRACTION_SCHEMA,
          'money_extraction',
        )
      : await requestGeminiStructuredOutput(
          transcript,
          MONEY_EXTRACTION_PROMPT,
          MONEY_EXTRACTION_SCHEMA,
        );

  if (!isMoneyExtractionResult(parsedResponse)) {
    throw new Error('money-parser-invalid-response');
  }

  return parsedResponse;
}

export default async function handler(
  req: VercelLikeRequest,
  res: VercelLikeResponse,
) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const body = parseRequestBody(req.body);
  const transcript = body?.transcript?.trim() ?? '';
  const kind = body?.kind;

  if (kind !== 'health' && kind !== 'diary' && kind !== 'money') {
    res.status(400).json({ error: 'invalid-kind' });
    return;
  }

  if (transcript === '' || transcript.length > 10000) {
    res.status(400).json({ error: 'invalid-transcript' });
    return;
  }

  try {
    if (kind === 'health') {
      res.status(200).json(await parseHealthTranscript(transcript));
      return;
    }

    if (kind === 'diary') {
      res.status(200).json(await parseDiaryTranscript(transcript));
      return;
    }

    res.status(200).json(await parseMoneyTranscript(transcript));
  } catch {
    res.status(500).json({ error: 'ai-parse-failed' });
  }
}
