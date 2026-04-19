import { useEffect, useState } from 'react';

import { Mic } from 'lucide-react';

type Spotlight = {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  cx: number;
  cy: number;
};

type Props = {
  micButtonRef: React.RefObject<HTMLElement | null>;
  addButtonRef: React.RefObject<HTMLDivElement | null>;
  onDismiss: () => void;
};

function measureSpotlight(
  el: HTMLElement | null,
  padding = 1,
): Spotlight | null {
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  const rawRx = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 12;
  const paddedHeight = rect.height + padding * 2;
  const rx = Math.min(rawRx + padding, paddedHeight / 2);
  return {
    x: rect.left - padding,
    y: rect.top - padding,
    width: rect.width + padding * 2,
    height: paddedHeight,
    rx,
    cx: rect.left + rect.width / 2,
    cy: rect.top + rect.height / 2,
  };
}

const STEPS = ['mic', 'add'] as const;
type Step = (typeof STEPS)[number];

type StepLabel = {
  title: React.ReactNode;
  desc?: string;
};

const STEP_LABELS: Record<Step, StepLabel> = {
  mic: {
    title: (
      <>
        點擊 <Mic className="inline size-4 align-middle" strokeWidth={1.5} />{' '}
        按鈕錄製照護資料吧！
      </>
    ),
  },
  add: {
    title: <>或是點擊「新增」手動建立資料！ </>,
  },
};

export default function OnboardingOverlay({
  micButtonRef,
  addButtonRef,
  onDismiss,
}: Props) {
  const [step, setStep] = useState<Step>('mic');
  const [micSpot, setMicSpot] = useState<Spotlight | null>(null);
  const [addSpot, setAddSpot] = useState<Spotlight | null>(null);

  useEffect(() => {
    const measure = () => {
      setMicSpot(measureSpotlight(micButtonRef.current));
      setAddSpot(measureSpotlight(addButtonRef.current));
    };

    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [micButtonRef, addButtonRef]);

  const activeSpot = step === 'mic' ? micSpot : addSpot;
  const label = STEP_LABELS[step];

  const handleClick = () => {
    if (step === 'mic') {
      setStep('add');
    } else {
      onDismiss();
    }
  };

  return (
    <button
      type="button"
      aria-label={step === 'mic' ? '查看下一個提示' : '關閉引導'}
      className="fixed inset-0 z-100 w-full border-0 bg-transparent p-0"
      onClick={handleClick}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <defs>
          <mask id="onboarding-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {activeSpot && (
              <rect
                x={activeSpot.x}
                y={activeSpot.y}
                width={activeSpot.width}
                height={activeSpot.height}
                rx={activeSpot.rx}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.7)"
          mask="url(#onboarding-spotlight-mask)"
        />
      </svg>

      {activeSpot && (
        <div
          className="absolute flex flex-col items-center gap-1"
          style={{
            left: activeSpot.x + activeSpot.width,
            top: activeSpot.y - 12,
            transform: 'translateX(-100%) translateY(-100%)',
            pointerEvents: 'none',
          }}
        >
          <div className="rounded-xl border-2 border-neutral-900 bg-neutral-50 text-center shadow-lg">
            <p className="font-paragraph-md px-5 py-4 whitespace-nowrap text-neutral-900">
              {label.title}
            </p>
          </div>
          <div className="h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-neutral-900" />
        </div>
      )}

      <div
        className="absolute bottom-1/3 left-1/2 -translate-x-1/2"
        style={{ pointerEvents: 'none' }}
      >
        <p className="font-paragraph-sm text-center text-neutral-300">
          {step === 'mic' ? '點擊繼續' : '點擊關閉'}
        </p>
      </div>
    </button>
  );
}
