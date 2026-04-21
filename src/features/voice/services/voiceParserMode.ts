type VoiceParserMode = 'rule' | 'client' | 'server';

function getVoiceParserMode(): VoiceParserMode {
  const parserMode =
    import.meta.env.VITE_VOICE_PARSER_MODE ??
    import.meta.env.VITE_HEALTH_PARSER_MODE;

  if (
    parserMode === 'client' ||
    parserMode === 'server' ||
    parserMode === 'rule'
  ) {
    return parserMode;
  }

  return 'rule';
}

export { getVoiceParserMode };
export type { VoiceParserMode };
