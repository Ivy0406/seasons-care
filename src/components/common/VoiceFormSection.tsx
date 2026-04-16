import { useState, type ReactNode } from 'react';

import VoiceCTA from '@/components/common/voiceCTA';
import RecordingDrawer from '@/features/voice/components/RecordingDrawer';

type VoiceFormSectionProps = {
  title: string;
  onClose: () => void;
  ctaClassName?: string;
  onVoiceFinish: (payload: {
    transcript: string;
  }) =>
    | Promise<{ shouldClose?: boolean } | void>
    | { shouldClose?: boolean }
    | void;
  children: ReactNode;
};

function VoiceFormSection({
  title,
  onClose,
  ctaClassName,
  onVoiceFinish,
  children,
}: VoiceFormSectionProps) {
  const [showRecordingDrawer, setShowRecordingDrawer] = useState(false);

  return (
    <>
      <VoiceCTA
        title={title}
        onClose={onClose}
        className={ctaClassName}
        onInputClick={() => setShowRecordingDrawer(true)}
      />
      {children}
      <RecordingDrawer
        open={showRecordingDrawer}
        onOpenChange={setShowRecordingDrawer}
        onFinish={onVoiceFinish}
      />
    </>
  );
}

export default VoiceFormSection;
