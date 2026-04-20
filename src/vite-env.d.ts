/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_VOICE_PARSER_MODE?: 'rule' | 'client' | 'server';
  readonly VITE_HEALTH_PARSER_MODE?: 'rule' | 'client' | 'server';
  readonly VITE_AI_PROVIDER?: 'gemini' | 'openai';
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_GEMINI_MODEL?: string;
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_OPENAI_MODEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'swiper/css';
declare module 'swiper/css/*';
