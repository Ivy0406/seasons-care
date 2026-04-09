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
} from '@/types/ai';
import type {
  DiaryExtractionResult,
  HealthExtractionResult,
  MoneyExtractionResult,
} from '@/types/ai';

import requestAIProxyParse from './proxy';

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

function getProxyKind(schemaName: string) {
  if (schemaName === 'health_extraction') {
    return 'health';
  }

  if (schemaName === 'diary_extraction') {
    return 'diary';
  }

  return 'money';
}

async function requestOpenAIStructuredOutput(
  transcript: string,
  prompt: string,
  schema: object,
  schemaName: string,
) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    return requestAIProxyParse(getProxyKind(schemaName), transcript);
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
    throw new Error('openai-health-parser-request-failed');
  }

  const parsedResponse = await parseOpenAIResponse(response);

  return parsedResponse;
}

async function fetchHealthExtractionWithOpenAI(
  transcript: string,
): Promise<HealthExtractionResult> {
  const parsedResponse = await requestOpenAIStructuredOutput(
    transcript,
    HEALTH_EXTRACTION_PROMPT,
    HEALTH_EXTRACTION_SCHEMA,
    'health_extraction',
  );

  if (!isHealthExtractionResult(parsedResponse)) {
    throw new Error('openai-health-parser-invalid-response');
  }

  return parsedResponse;
}

async function fetchDiaryExtractionWithOpenAI(
  transcript: string,
): Promise<DiaryExtractionResult> {
  const parsedResponse = await requestOpenAIStructuredOutput(
    transcript,
    DIARY_EXTRACTION_PROMPT,
    DIARY_EXTRACTION_SCHEMA,
    'diary_extraction',
  );

  if (!isDiaryExtractionResult(parsedResponse)) {
    throw new Error('openai-diary-parser-invalid-response');
  }

  return parsedResponse;
}

async function fetchMoneyExtractionWithOpenAI(
  transcript: string,
): Promise<MoneyExtractionResult> {
  const parsedResponse = await requestOpenAIStructuredOutput(
    transcript,
    MONEY_EXTRACTION_PROMPT,
    MONEY_EXTRACTION_SCHEMA,
    'money_extraction',
  );

  if (!isMoneyExtractionResult(parsedResponse)) {
    throw new Error('openai-money-parser-invalid-response');
  }

  return parsedResponse;
}

export {
  fetchDiaryExtractionWithOpenAI,
  fetchHealthExtractionWithOpenAI,
  fetchMoneyExtractionWithOpenAI,
};
export default fetchHealthExtractionWithOpenAI;
