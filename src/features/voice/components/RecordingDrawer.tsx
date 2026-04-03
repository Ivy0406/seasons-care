import { useEffect, useRef } from 'react';

import { RotateCw, AudioLines } from 'lucide-react';
import { useNavigate } from 'react-router';

import BaseDrawer from '@/components/common/BaseDrawer';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import useSpeechRecognition from '@/features/voice/hooks/useSpeechRecognition';

type RecordingDrawerProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onFinish?: () => void;
};

function RecordingDrawer({
  trigger,
  open,
  onOpenChange,
  onFinish,
}: RecordingDrawerProps) {
  const navigate = useNavigate();
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();
  const displayText = `${transcript}${
    interimTranscript ? ` ${interimTranscript}` : ''
  }`.trim();
  let recordingStatusText = '錄音已停止';

  if (!isSupported) {
    recordingStatusText = '此瀏覽器不支援語音輸入';
  } else if (isListening) {
    recordingStatusText = '語音錄製中...';
  }

  useEffect(() => {
    const container = transcriptContainerRef.current;

    if (container === null) return;

    container.scrollTop = container.scrollHeight;
  }, [displayText]);

  const handleReset = () => {
    stopListening();
    resetTranscript();
    startListening();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      resetTranscript();
      startListening();
    } else {
      stopListening();
      resetTranscript();
    }

    onOpenChange?.(isOpen);
  };

  const handleFinish = () => {
    stopListening();
    handleOpenChange(false);

    if (onFinish) {
      onFinish();
      return;
    }

    setTimeout(() => navigate('/data-form'), 150);
  };

  return (
    <BaseDrawer
      trigger={trigger}
      open={open}
      onOpenChange={handleOpenChange}
      handleClassName="bg-neutral-500"
      className="bg-neutral-200"
      footer={
        <div className="flex w-full flex-col items-center gap-4 px-0 pb-0">
          <RoundedButtonPrimary
            className="h-12 w-[97px] bg-neutral-900 text-neutral-50 active:bg-neutral-800"
            onClick={handleFinish}
          >
            完成
          </RoundedButtonPrimary>

          <button
            type="button"
            className="font-label-sm flex items-center justify-center gap-2 text-neutral-900 transition-opacity"
            onClick={handleReset}
          >
            <RotateCw className="size-4" strokeWidth={3} />
            重新錄製
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center pt-2 pb-0">
          <p className="font-heading-sm text-neutral-900">
            {recordingStatusText}
          </p>
          <p className="font-paragraph-md mt-5 text-neutral-700">
            告訴我你今天想要記錄的事
          </p>
        </div>

        <div className="mt-3 mb-5 flex h-[200px] w-full flex-col overflow-hidden rounded-lg border-2 border-neutral-900 bg-white px-5">
          <div
            ref={transcriptContainerRef}
            className="h-full w-full overflow-y-auto px-2 py-4"
          >
            {displayText ? (
              <p className="font-paragraph-lg w-full text-left leading-10 whitespace-pre-wrap">
                <span className="text-primary-default bg-neutral-800 box-decoration-clone px-2 py-1">
                  {displayText}
                </span>
              </p>
            ) : (
              <p className="font-paragraph-lg w-full leading-10 whitespace-pre-wrap text-neutral-400">
                請開始說話，等待語音內容顯示...
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 pb-2">
          <AudioLines
            className={isListening ? 'size-10' : 'size-10 text-neutral-500'}
          />
        </div>
      </div>
    </BaseDrawer>
  );
}

export default RecordingDrawer;
