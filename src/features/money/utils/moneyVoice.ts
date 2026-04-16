import { toast } from 'sonner';

import type { MoneyDraft } from '@/features/money/types';
import {
  hasMoneyDraftContent,
  parseMoneyTranscript,
} from '@/features/voice/services/moneyParser';

async function handleMoneyVoiceFinish({
  transcript,
  applyVoiceDraft,
}: {
  transcript: string;
  applyVoiceDraft: (draft: MoneyDraft, transcript: string) => void;
}) {
  const parsedDraft = await parseMoneyTranscript(transcript);

  if (!hasMoneyDraftContent(parsedDraft)) {
    toast.error('這段語音暫時無法辨識成帳目內容，請重新錄製或手動輸入。');
    return { shouldClose: false };
  }

  applyVoiceDraft(parsedDraft, transcript);

  return { shouldClose: true };
}

export default handleMoneyVoiceFinish;
