import { toast } from 'sonner';

import type { HealthDraft } from '@/features/health/types';
import {
  hasHealthDraftContent,
  parseHealthTranscript,
} from '@/features/voice/services/healthParser';

async function handleHealthVoiceFinish({
  transcript,
  applyVoiceDraft,
}: {
  transcript: string;
  applyVoiceDraft: (draft: HealthDraft, transcript: string) => void;
}) {
  const parsedDraft = await parseHealthTranscript(transcript);

  if (!hasHealthDraftContent(parsedDraft)) {
    toast.error('這段語音暫時無法辨識成健康數值，請重新錄製或手動輸入。');
    return { shouldClose: false };
  }

  applyVoiceDraft(parsedDraft, transcript);

  return { shouldClose: true };
}

export default handleHealthVoiceFinish;
