async function requestAIProxyParse(
  kind: 'health' | 'diary' | 'money',
  transcript: string,
) {
  const response = await fetch('/api/ai/parse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      kind,
      transcript,
    }),
  });

  if (!response.ok) {
    throw new Error('ai-proxy-request-failed');
  }

  return response.json() as Promise<unknown>;
}

export default requestAIProxyParse;
