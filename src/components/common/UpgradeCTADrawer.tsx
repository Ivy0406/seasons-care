import { X } from 'lucide-react';

import BaseDrawer from './BaseDrawer';
import { RoundedButtonPrimary } from './RoundedButtons';

type UpgradeCTADrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function UpgradeCTADrawer({ open, onOpenChange }: UpgradeCTADrawerProps) {
  return (
    <BaseDrawer
      open={open}
      onOpenChange={onOpenChange}
      className="border-t-neutral-800 bg-neutral-800 ring-neutral-800"
    >
      <div className="relative mb-5 flex items-center justify-center">
        <button
          type="button"
          aria-label="關閉操作選單"
          className="absolute left-0 inline-flex size-6 items-center justify-center text-neutral-100"
          onClick={() => onOpenChange(false)}
        >
          <X className="size-8" strokeWidth={1.5} />
        </button>
        <p className="font-paragraph-lg text-neutral-100">新功能即將登場！</p>
      </div>
      <div className="flex h-fit w-full flex-col items-center gap-3">
        <div className="aspect-square w-40">
          <img
            src="https://res.cloudinary.com/dyothufps/image/upload/v1774934772/pro_2x_rxtdqk.webp"
            alt="盆栽"
            className="object-contain"
          />
        </div>
        <div className="font-paragraph-md flex flex-col items-center text-neutral-100">
          <p>儲存完整歷史任務與醫療數據，</p>
          <p>為家人提供最周全的守護！</p>
        </div>
      </div>
      <RoundedButtonPrimary className="font-label-md mt-5 bg-neutral-100 text-neutral-800">
        升級 Pro 方案
      </RoundedButtonPrimary>
    </BaseDrawer>
  );
}

export default UpgradeCTADrawer;
