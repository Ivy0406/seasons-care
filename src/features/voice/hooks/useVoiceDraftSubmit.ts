import { useState } from 'react';

import { toast } from 'sonner';

import useCreateHealthData from '@/features/health/hooks/useCreateHealthData';
import type { HealthDraft } from '@/features/health/types';
import useCreateMoneyItem from '@/features/money/hooks/useCreateMoneyItem';
import type { MoneyDraft } from '@/features/money/types';
import useCreateCareLogEntry from '@/pages/CareLog/hooks/useCreateCareLogEntry';
import type { DiaryDraft } from '@/pages/CareLog/types';
import { diaryDraftToCareLogEntry } from '@/pages/CareLog/utils/careLogVoice';
import type { GroupMember } from '@/types/group';

type UseVoiceDraftSubmitOptions = {
  healthDraft: HealthDraft;
  diaryDrafts: DiaryDraft[];
  moneyDraft: MoneyDraft;
  groupMembers: GroupMember[];
  shouldSubmitHealth: boolean;
  shouldSubmitMoney: boolean;
  onSuccess: () => void;
};

function isFailedResult(result: PromiseSettledResult<unknown>): boolean {
  if (result.status === 'rejected') return true;
  const val = result.value;
  if (val === null) return true;
  if (val !== null && typeof val === 'object' && 'success' in val) {
    return !(val as { success: boolean }).success;
  }
  return false;
}

function useVoiceDraftSubmit({
  healthDraft,
  diaryDrafts,
  moneyDraft,
  groupMembers,
  shouldSubmitHealth,
  shouldSubmitMoney,
  onSuccess,
}: UseVoiceDraftSubmitOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitFromDraft: submitHealthDraft } = useCreateHealthData();
  const { handleCreateMoneyItem } = useCreateMoneyItem();
  const { handleCreateCareLogEntry } = useCreateCareLogEntry();

  const handleSaveAll = async () => {
    setIsSubmitting(true);

    try {
      const submissions: Promise<unknown>[] = [
        ...(shouldSubmitHealth ? [submitHealthDraft(healthDraft)] : []),
        ...diaryDrafts.map((draft) =>
          handleCreateCareLogEntry(
            diaryDraftToCareLogEntry(draft, groupMembers),
          ),
        ),
        ...(shouldSubmitMoney ? [handleCreateMoneyItem(moneyDraft)] : []),
      ];

      const results = await Promise.allSettled(submissions);

      if (results.some(isFailedResult)) {
        toast.error('部分資料儲存失敗，請檢查後再試');
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error('[useVoiceDraftSubmit] 儲存失敗:', error);
      toast.error('儲存時發生錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSaveAll };
}

export default useVoiceDraftSubmit;
