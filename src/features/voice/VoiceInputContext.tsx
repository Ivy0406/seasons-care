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
  hasMoneyDraftContent,
  mergeMoneyDraft,
  parseMoneyTranscript,
} from '@/features/voice/services/moneyParser';
import type { DiaryDraft } from '@/pages/CareLog/types';

type SetVoiceTranscriptResult = {
  hasDetectedContent: boolean;
};

type VoiceInputContextValue = {
  transcript: string;
  healthDraft: HealthDraft;
  diaryDrafts: DiaryDraft[];
  moneyDraft: MoneyDraft;
  setVoiceTranscript: (transcript: string) => Promise<SetVoiceTranscriptResult>;
  updateHealthDraft: (updates: Partial<HealthDraft>) => void;
  updateDiaryDraft: (id: string, updates: Partial<DiaryDraft>) => void;
  updateMoneyDraft: (updates: Partial<MoneyDraft>) => void;
  clearVoiceInput: () => void;
};

const VoiceInputContext = createContext<VoiceInputContextValue | null>(null);

function hasHealthDraftContent(draft: HealthDraft) {
  return (
    draft.systolic.trim() !== '' ||
    draft.diastolic.trim() !== '' ||
    draft.temperature.trim() !== '' ||
    draft.bloodOxygen.trim() !== '' ||
    draft.weight.trim() !== '' ||
    draft.bloodSugar.trim() !== ''
  );
}

function VoiceInputProvider({ children }: { children: ReactNode }) {
  const [transcript, setTranscript] = useState('');
  const [healthDraft, setHealthDraft] = useState<HealthDraft>(
    createEmptyHealthDraft(),
  );
  const [diaryDrafts, setDiaryDrafts] = useState<DiaryDraft[]>([
    createEmptyDiaryDraft(),
  ]);
  const [moneyDraft, setMoneyDraft] = useState<MoneyDraft>(
    createEmptyMoneyDraft(),
  );

  const setVoiceTranscript = async (nextTranscript: string) => {
    const normalizedTranscript = nextTranscript.trim();
    const [parsedHealthDraft, parsedDiaryDrafts, parsedMoneyDraft] =
      await Promise.all([
        parseHealthTranscript(normalizedTranscript),
        parseDiaryTranscript(normalizedTranscript),
        parseMoneyTranscript(normalizedTranscript),
      ]);

    setTranscript(normalizedTranscript);
    setHealthDraft(parsedHealthDraft);
    setDiaryDrafts(
      parsedDiaryDrafts.length > 0
        ? parsedDiaryDrafts
        : [createEmptyDiaryDraft()],
    );
    setMoneyDraft(parsedMoneyDraft);

    return {
      hasDetectedContent:
        hasHealthDraftContent(parsedHealthDraft) ||
        parsedDiaryDrafts.length > 0 ||
        hasMoneyDraftContent(parsedMoneyDraft),
    };
  };

  const updateHealthDraft = (updates: Partial<HealthDraft>) => {
    setHealthDraft((currentDraft) => mergeHealthDraft(currentDraft, updates));
  };

  const updateDiaryDraft = (id: string, updates: Partial<DiaryDraft>) => {
    setDiaryDrafts((currentDrafts) =>
      currentDrafts.map((draft) =>
        draft.id === id ? mergeDiaryDraft(draft, updates) : draft,
      ),
    );
  };

  const updateMoneyDraft = (updates: Partial<MoneyDraft>) => {
    setMoneyDraft((currentDraft) => mergeMoneyDraft(currentDraft, updates));
  };

  const clearVoiceInput = () => {
    setTranscript('');
    setHealthDraft(createEmptyHealthDraft());
    setDiaryDrafts([createEmptyDiaryDraft()]);
    setMoneyDraft(createEmptyMoneyDraft());
  };

  const value = useMemo(
    () => ({
      transcript,
      healthDraft,
      diaryDrafts,
      moneyDraft,
      setVoiceTranscript,
      updateHealthDraft,
      updateDiaryDraft,
      updateMoneyDraft,
      clearVoiceInput,
    }),
    [transcript, healthDraft, diaryDrafts, moneyDraft],
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
