import { useState } from 'react';

import { RotateCw, AudioLines } from 'lucide-react';

import BaseDrawer from '@/components/common/BaseDrawer';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';

type RecordingDrawerProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function RecordingDrawer({
  trigger,
  open,
  onOpenChange,
}: RecordingDrawerProps) {
  // 模擬即將實作的語音辨識狀態。
  const [mockTranscript] = useState([
    '今日上午十點生命徵象穩定，血壓量測收縮壓 128、舒張壓 84，心率每分鐘 72 ...',
  ]);

  const handleReset = () => {
    // 重新錄製邏輯
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange?.(isOpen);
    if (!isOpen) {
      handleReset();
    }
  };

  const handleFinish = () => {
    handleOpenChange(false);
  };

  return (
    <BaseDrawer
      trigger={trigger}
      open={open}
      onOpenChange={handleOpenChange}
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
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center pt-2 pb-0">
          <p className="font-heading-sm text-neutral-900">語音錄製中...</p>
          <p className="font-paragraph-md mt-5 text-neutral-700">
            告訴我你今天想要記錄的事
          </p>
        </div>

        <div className="flex min-h-[220px] w-full flex-col gap-1 rounded-lg border-2 border-neutral-900 bg-white px-3 pt-13">
          <p className="w-full text-left leading-[4px]!">
            <span className="font-paragraph-lg text-primary-default bg-neutral-800 box-decoration-clone px-2 py-1 leading-[40px]!">
              {mockTranscript}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 pb-2">
          <AudioLines className="size-10" />
        </div>
      </div>
    </BaseDrawer>
  );
}

export default RecordingDrawer;
