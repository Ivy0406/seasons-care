import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { HealthDraft } from '@/features/health/types';
import type { MoneyDraft } from '@/features/money/types';
import {
  createEmptyDiaryDraft,
  mergeDiaryDraft,
  parseDiaryTranscript,
} from '@/features/voice/services/diaryParser';
import {
  createEmptyHealthDraft,
  mergeHealthDraft,
  parseHealthTranscript,
} from '@/features/voice/services/healthParser';
import {
  createEmptyMoneyDraft,
  mergeMoneyDraft,
  parseMoneyTranscript,
} from '@/features/voice/services/moneyParser';
import type { DiaryDraft } from '@/pages/CareLog/types';

type VoiceInputContextValue = {
  transcript: string;
  healthDraft: HealthDraft;
  diaryDraft: DiaryDraft;
  moneyDraft: MoneyDraft;
  setVoiceTranscript: (transcript: string) => Promise<void>;
  updateHealthDraft: (updates: Partial<HealthDraft>) => void;
  updateDiaryDraft: (updates: Partial<DiaryDraft>) => void;
  updateMoneyDraft: (updates: Partial<MoneyDraft>) => void;
  clearVoiceInput: () => void;
};

const VoiceInputContext = createContext<VoiceInputContextValue | null>(null);

function VoiceInputProvider({ children }: { children: ReactNode }) {
  const [transcript, setTranscript] = useState('');
  const [healthDraft, setHealthDraft] = useState<HealthDraft>(
    createEmptyHealthDraft(),
  );
  const [diaryDraft, setDiaryDraft] = useState<DiaryDraft>(
    createEmptyDiaryDraft(),
  );
  const [moneyDraft, setMoneyDraft] = useState<MoneyDraft>(
    createEmptyMoneyDraft(),
  );

  const setVoiceTranscript = async (nextTranscript: string) => {
    const normalizedTranscript = nextTranscript.trim();
    const [parsedHealthDraft, parsedDiaryDraft, parsedMoneyDraft] =
      await Promise.all([
        parseHealthTranscript(normalizedTranscript),
        parseDiaryTranscript(normalizedTranscript),
        parseMoneyTranscript(normalizedTranscript),
      ]);

    setTranscript(normalizedTranscript);
    setHealthDraft(parsedHealthDraft);
    setDiaryDraft(parsedDiaryDraft);
    setMoneyDraft(parsedMoneyDraft);
  };

  const updateHealthDraft = (updates: Partial<HealthDraft>) => {
    setHealthDraft((currentDraft) => mergeHealthDraft(currentDraft, updates));
  };

  const updateDiaryDraft = (updates: Partial<DiaryDraft>) => {
    setDiaryDraft((currentDraft) => mergeDiaryDraft(currentDraft, updates));
  };

  const updateMoneyDraft = (updates: Partial<MoneyDraft>) => {
    setMoneyDraft((currentDraft) => mergeMoneyDraft(currentDraft, updates));
  };

  const clearVoiceInput = () => {
    setTranscript('');
    setHealthDraft(createEmptyHealthDraft());
    setDiaryDraft(createEmptyDiaryDraft());
    setMoneyDraft(createEmptyMoneyDraft());
  };

  const value = useMemo(
    () => ({
      transcript,
      healthDraft,
      diaryDraft,
      moneyDraft,
      setVoiceTranscript,
      updateHealthDraft,
      updateDiaryDraft,
      updateMoneyDraft,
      clearVoiceInput,
    }),
    [transcript, healthDraft, diaryDraft, moneyDraft],
  );

  return (
    <VoiceInputContext.Provider value={value}>
      {children}
    </VoiceInputContext.Provider>
  );
}

function useVoiceInput() {
  const context = useContext(VoiceInputContext);

  if (context === null) {
    throw new Error('useVoiceInput must be used within VoiceInputProvider');
  }

  return context;
}

export { VoiceInputProvider, useVoiceInput };
