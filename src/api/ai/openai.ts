import {
  HEALTH_EXTRACTION_PROMPT,
  HEALTH_EXTRACTION_SCHEMA,
  isHealthExtractionResult,
} from '@/types/ai';
import type { HealthExtractionResult } from '@/types/ai';

type OpenAIResponsesOutput = {
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

function getOpenAIModel() {
  return import.meta.env.VITE_OPENAI_MODEL ?? 'gpt-4o-mini';
}

async function parseOpenAIResponse(response: Response) {
  const responseBody = (await response.json()) as OpenAIResponsesOutput;
  const outputText = responseBody.output
    ?.flatMap((item) => item.content ?? [])
    .find((item) => item.type === 'output_text')?.text;

  if (typeof outputText !== 'string') {
    throw new Error('openai-health-parser-empty-response');
  }

  return JSON.parse(outputText) as unknown;
}

async function fetchHealthExtractionWithOpenAI(
  transcript: string,
): Promise<HealthExtractionResult> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('openai-health-parser-missing-key');
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
              text: HEALTH_EXTRACTION_PROMPT,
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
          name: 'health_extraction',
          strict: true,
          schema: HEALTH_EXTRACTION_SCHEMA,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error('openai-health-parser-request-failed');
  }

  const parsedResponse = await parseOpenAIResponse(response);

  if (!isHealthExtractionResult(parsedResponse)) {
    throw new Error('openai-health-parser-invalid-response');
  }

  return parsedResponse;
}

export default fetchHealthExtractionWithOpenAI;
