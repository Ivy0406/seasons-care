import { useEffect, useRef } from 'react';

import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';

type QRCodeScannerPanelProps = {
  onBack: () => void;
  onDetected: (value: string) => void;
};

type BarcodeDetectorResult = {
  rawValue?: string;
};

type BarcodeDetectorInstance = {
  detect: (source: ImageBitmapSource) => Promise<BarcodeDetectorResult[]>;
};

type BarcodeDetectorCtor = new (options?: {
  formats?: string[];
}) => BarcodeDetectorInstance;

function QRCodeScannerPanel({ onBack, onDetected }: QRCodeScannerPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const isDetectingRef = useRef(false);

  useEffect(() => {
    const BarcodeDetectorClass = (
      window as Window & { BarcodeDetector?: BarcodeDetectorCtor }
    ).BarcodeDetector;

    if (!BarcodeDetectorClass) {
      toast.error('目前裝置暫不支援 QR code 掃描', { duration: 1800 });
      onBack();
      return undefined;
    }

    let isCancelled = false;
    const detector = new BarcodeDetectorClass({ formats: ['qr_code'] });
    let scheduleScanFrame = () => undefined;

    const stopScanner = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      isDetectingRef.current = false;
    };

    async function scanFrame() {
      if (isCancelled) {
        return;
      }

      const video = videoRef.current;

      if (!video) {
        scheduleScanFrame();
        return;
      }

      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        scheduleScanFrame();
        return;
      }

      if (isDetectingRef.current) {
        scheduleScanFrame();
        return;
      }

      try {
        isDetectingRef.current = true;
        const [firstResult] = await detector.detect(video);
        const nextInviteCode = firstResult?.rawValue?.trim().toUpperCase();

        if (nextInviteCode) {
          onDetected(nextInviteCode);
          toast.success('已帶入邀請碼', { duration: 700 });
          return;
        }
      } catch {
        toast.error('掃描 QR code 失敗，請改用手動輸入', {
          duration: 1000,
        });
        onBack();
        return;
      } finally {
        isDetectingRef.current = false;
      }

      scheduleScanFrame();
    }

    scheduleScanFrame = () => {
      frameRef.current = window.requestAnimationFrame(() => {
        scanFrame().catch(() => undefined);
      });
    };

    const startScanner = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        scanFrame().catch(() => undefined);
      } catch {
        toast.error('無法開啟相機，請確認權限設定', { duration: 1800 });
        onBack();
      }
    };

    startScanner().catch(() => undefined);

    return () => {
      isCancelled = true;
      stopScanner();
    };
  }, [onBack, onDetected]);

  return (
    <div className="flex flex-col text-neutral-900">
      <div className="relative flex items-center justify-center py-2">
        <button
          type="button"
          aria-label="返回輸入邀請碼"
          onClick={onBack}
          className="absolute left-0 inline-flex size-10 items-center justify-center"
        >
          <ChevronLeft className="size-8" strokeWidth={1.5} />
        </button>
        <h2 className="font-label-lg">掃描 QR code</h2>
      </div>

      <p className="font-paragraph-md mt-10 mb-4 text-center text-neutral-700">
        將 QR code 對準框內，自動帶入邀請碼
      </p>

      <div className="relative mx-auto w-full max-w-90 overflow-hidden rounded-[20px] border-2 border-neutral-900 bg-neutral-800">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="aspect-square w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-6 rounded-[20px] border-2 border-dashed border-neutral-50/90" />
      </div>

      <RoundedButtonPrimary
        type="button"
        className="mt-8 bg-neutral-800"
        onClick={onBack}
      >
        改用手動輸入
      </RoundedButtonPrimary>
    </div>
  );
}

export default QRCodeScannerPanel;
