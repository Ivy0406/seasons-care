import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { HealthDraft } from '@/features/health/types';
import {
  createEmptyHealthDraft,
  mergeHealthDraft,
  parseHealthTranscript,
} from '@/features/voice/services/healthParser';

type VoiceInputKind = 'health' | null;

type VoiceInputContextValue = {
  activeKind: VoiceInputKind;
  transcript: string;
  healthDraft: HealthDraft;
  setHealthTranscript: (transcript: string) => Promise<void>;
  updateHealthDraft: (updates: Partial<HealthDraft>) => void;
  clearVoiceInput: () => void;
};

const VoiceInputContext = createContext<VoiceInputContextValue | null>(null);

function VoiceInputProvider({ children }: { children: ReactNode }) {
  const [activeKind, setActiveKind] = useState<VoiceInputKind>(null);
  const [transcript, setTranscript] = useState('');
  const [healthDraft, setHealthDraft] = useState<HealthDraft>(
    createEmptyHealthDraft(),
  );

  const setHealthTranscript = async (nextTranscript: string) => {
    const parsedDraft = await parseHealthTranscript(nextTranscript);

    setActiveKind('health');
    setTranscript(nextTranscript.trim());
    setHealthDraft(parsedDraft);
  };

  const updateHealthDraft = (updates: Partial<HealthDraft>) => {
    setHealthDraft((currentDraft) => mergeHealthDraft(currentDraft, updates));
  };

  const clearVoiceInput = () => {
    setActiveKind(null);
    setTranscript('');
    setHealthDraft(createEmptyHealthDraft());
  };

  const value = useMemo(
    () => ({
      activeKind,
      transcript,
      healthDraft,
      setHealthTranscript,
      updateHealthDraft,
      clearVoiceInput,
    }),
    [activeKind, transcript, healthDraft],
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
