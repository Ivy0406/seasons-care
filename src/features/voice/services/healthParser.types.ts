import type { HealthDraft } from '@/features/health/types';

type HealthParserMode = 'rule' | 'client' | 'server';

type ParseHealthTranscript = (transcript: string) => Promise<HealthDraft>;

export type { HealthParserMode, ParseHealthTranscript };
