import {
  HEALTH_EXTRACTION_PROMPT,
  HEALTH_EXTRACTION_SCHEMA,
  isHealthExtractionResult,
} from '@/types/ai';
import type { HealthExtractionResult } from '@/types/ai';

function getGeminiModel() {
  return import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-2.5-flash';
}

async function parseGeminiResponse(response: Response) {
  const responseBody = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };

  const responseText = responseBody.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof responseText !== 'string') {
    throw new Error('gemini-health-parser-empty-response');
  }

  return JSON.parse(responseText) as unknown;
}

async function fetchHealthExtractionWithGemini(
  transcript: string,
): Promise<HealthExtractionResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('gemini-health-parser-missing-key');
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
                text: `${HEALTH_EXTRACTION_PROMPT}\n\n使用者語音轉文字：\n${transcript}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseJsonSchema: HEALTH_EXTRACTION_SCHEMA,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error('gemini-health-parser-request-failed');
  }

  const parsedResponse = await parseGeminiResponse(response);

  if (!isHealthExtractionResult(parsedResponse)) {
    throw new Error('gemini-health-parser-invalid-response');
  }

  return parsedResponse;
}

export default fetchHealthExtractionWithGemini;
