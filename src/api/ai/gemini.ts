import {
  DIARY_EXTRACTION_PROMPT,
  DIARY_EXTRACTION_SCHEMA,
  HEALTH_EXTRACTION_PROMPT,
  HEALTH_EXTRACTION_SCHEMA,
  isDiaryExtractionResult,
  isHealthExtractionResult,
} from '@/types/ai';
import type { DiaryExtractionResult, HealthExtractionResult } from '@/types/ai';

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

async function requestGeminiStructuredOutput(
  transcript: string,
  prompt: string,
  schema: object,
) {
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
    throw new Error('gemini-health-parser-request-failed');
  }

  const parsedResponse = await parseGeminiResponse(response);

  return parsedResponse;
}

async function fetchHealthExtractionWithGemini(
  transcript: string,
): Promise<HealthExtractionResult> {
  const parsedResponse = await requestGeminiStructuredOutput(
    transcript,
    HEALTH_EXTRACTION_PROMPT,
    HEALTH_EXTRACTION_SCHEMA,
  );

  if (!isHealthExtractionResult(parsedResponse)) {
    throw new Error('gemini-health-parser-invalid-response');
  }

  return parsedResponse;
}

async function fetchDiaryExtractionWithGemini(
  transcript: string,
): Promise<DiaryExtractionResult> {
  const parsedResponse = await requestGeminiStructuredOutput(
    transcript,
    DIARY_EXTRACTION_PROMPT,
    DIARY_EXTRACTION_SCHEMA,
  );

  if (!isDiaryExtractionResult(parsedResponse)) {
    throw new Error('gemini-diary-parser-invalid-response');
  }

  return parsedResponse;
}

export { fetchDiaryExtractionWithGemini, fetchHealthExtractionWithGemini };
export default fetchHealthExtractionWithGemini;
