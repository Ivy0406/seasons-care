import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { HealthDraft } from '@/features/health/types';
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
import type { DiaryDraft } from '@/pages/CareLog/types';

type VoiceInputContextValue = {
  transcript: string;
  healthDraft: HealthDraft;
  diaryDraft: DiaryDraft;
  setVoiceTranscript: (transcript: string) => Promise<void>;
  updateHealthDraft: (updates: Partial<HealthDraft>) => void;
  updateDiaryDraft: (updates: Partial<DiaryDraft>) => void;
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

  const setVoiceTranscript = async (nextTranscript: string) => {
    const normalizedTranscript = nextTranscript.trim();
    const [parsedHealthDraft, parsedDiaryDraft] = await Promise.all([
      parseHealthTranscript(normalizedTranscript),
      parseDiaryTranscript(normalizedTranscript),
    ]);

    setTranscript(normalizedTranscript);
    setHealthDraft(parsedHealthDraft);
    setDiaryDraft(parsedDiaryDraft);
  };

  const updateHealthDraft = (updates: Partial<HealthDraft>) => {
    setHealthDraft((currentDraft) => mergeHealthDraft(currentDraft, updates));
  };

  const updateDiaryDraft = (updates: Partial<DiaryDraft>) => {
    setDiaryDraft((currentDraft) => mergeDiaryDraft(currentDraft, updates));
  };

  const clearVoiceInput = () => {
    setTranscript('');
    setHealthDraft(createEmptyHealthDraft());
    setDiaryDraft(createEmptyDiaryDraft());
  };

  const value = useMemo(
    () => ({
      transcript,
      healthDraft,
      diaryDraft,
      setVoiceTranscript,
      updateHealthDraft,
      updateDiaryDraft,
      clearVoiceInput,
    }),
    [transcript, healthDraft, diaryDraft],
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
