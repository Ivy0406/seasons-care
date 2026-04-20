import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import useGetGroupMembers from '@/features/groups/hooks/useGetGroupMembers';
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
import useCurrentGroupId from '@/hooks/useCurrentGroupID';
import type { DiaryDraft } from '@/pages/CareLog/types';
import type { GroupMember } from '@/types/group';

type SetVoiceTranscriptResult = {
  hasDetectedContent: boolean;
};

type VoiceInputContextValue = {
  transcript: string;
  healthDraft: HealthDraft;
  diaryDrafts: DiaryDraft[];
  moneyDraft: MoneyDraft;
  groupMembers: GroupMember[];
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
  const { currentGroupId } = useCurrentGroupId();
  const { data: groupMembers = [] } = useGetGroupMembers(currentGroupId);
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

  const setVoiceTranscript = useCallback(
    async (nextTranscript: string) => {
      const normalizedTranscript = nextTranscript.trim();
      const [parsedHealthDraft, parsedDiaryDrafts, parsedMoneyDraft] =
        await Promise.all([
          parseHealthTranscript(normalizedTranscript),
          parseDiaryTranscript(normalizedTranscript, { groupMembers }),
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
    },
    [groupMembers],
  );

  const updateHealthDraft = useCallback((updates: Partial<HealthDraft>) => {
    setHealthDraft((currentDraft) => mergeHealthDraft(currentDraft, updates));
  }, []);

  const updateDiaryDraft = useCallback(
    (id: string, updates: Partial<DiaryDraft>) => {
      setDiaryDrafts((currentDrafts) =>
        currentDrafts.map((draft) =>
          draft.id === id ? mergeDiaryDraft(draft, updates) : draft,
        ),
      );
    },
    [],
  );

  const updateMoneyDraft = useCallback((updates: Partial<MoneyDraft>) => {
    setMoneyDraft((currentDraft) => mergeMoneyDraft(currentDraft, updates));
  }, []);

  const clearVoiceInput = useCallback(() => {
    setTranscript('');
    setHealthDraft(createEmptyHealthDraft());
    setDiaryDrafts([createEmptyDiaryDraft()]);
    setMoneyDraft(createEmptyMoneyDraft());
  }, []);

  const value = useMemo(
    () => ({
      transcript,
      healthDraft,
      diaryDrafts,
      moneyDraft,
      groupMembers,
      setVoiceTranscript,
      updateHealthDraft,
      updateDiaryDraft,
      updateMoneyDraft,
      clearVoiceInput,
    }),
    [
      transcript,
      healthDraft,
      diaryDrafts,
      moneyDraft,
      groupMembers,
      setVoiceTranscript,
      updateHealthDraft,
      updateDiaryDraft,
      updateMoneyDraft,
      clearVoiceInput,
    ],
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
