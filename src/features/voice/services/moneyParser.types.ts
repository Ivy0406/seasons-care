/* eslint-disable import/prefer-default-export */

import type { MoneyDraft } from '@/features/money/types';

type ParseMoneyTranscript = (transcript: string) => Promise<MoneyDraft[]>;

export type { ParseMoneyTranscript };
