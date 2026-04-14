import { useEffect, useId, useRef } from 'react';

import {
  Html5Qrcode,
  Html5QrcodeScannerState,
  Html5QrcodeSupportedFormats,
} from 'html5-qrcode';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';

type QRCodeScannerPanelProps = {
  onBack: () => void;
  onDetected: (value: string) => void;
};

function QRCodeScannerPanel({ onBack, onDetected }: QRCodeScannerPanelProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasDetectedRef = useRef(false);
  const scannerElementId = useId().replace(/:/g, '');

  useEffect(() => {
    const scannerElement = document.getElementById(scannerElementId);
    scannerElement?.replaceChildren();

    let isCancelled = false;
    const scanner = new Html5Qrcode(scannerElementId, {
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      verbose: false,
    });
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        if (isCancelled) {
          return;
        }

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            aspectRatio: 1,
            disableFlip: false,
          },
          (decodedText) => {
            const nextInviteCode = decodedText.trim().toUpperCase();

            if (hasDetectedRef.current || nextInviteCode === '') {
              return;
            }

            hasDetectedRef.current = true;
            onDetected(nextInviteCode);
            toast.success('已帶入邀請碼', { duration: 700 });
          },
          () => undefined,
        );

        if (isCancelled) {
          const scannerState = scanner.getState();

          if (
            scannerState === Html5QrcodeScannerState.SCANNING ||
            scannerState === Html5QrcodeScannerState.PAUSED
          ) {
            await scanner.stop().catch(() => undefined);
          }

          scanner.clear();
          scannerElement?.replaceChildren();
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        toast.error('無法開啟相機，請確認權限設定', { duration: 1800 });
        onBack();
      }
    };

    startScanner().catch(() => undefined);

    return () => {
      isCancelled = true;
      const activeScanner = scannerRef.current;
      scannerRef.current = null;

      if (!activeScanner) {
        return;
      }

      const scannerState = activeScanner.getState();

      if (
        scannerState === Html5QrcodeScannerState.SCANNING ||
        scannerState === Html5QrcodeScannerState.PAUSED
      ) {
        activeScanner
          .stop()
          .catch(() => undefined)
          .finally(() => {
            activeScanner.clear();
            scannerElement?.replaceChildren();
          });
        return;
      }

      activeScanner.clear();
      scannerElement?.replaceChildren();
    };
  }, [onBack, onDetected, scannerElementId]);

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

      <div className="relative mx-auto w-full max-w-50 overflow-hidden rounded-xl border-2 border-neutral-900 bg-neutral-800">
        <div id={scannerElementId} className="aspect-square w-full" />
        <div className="pointer-events-none absolute inset-2 rounded-xl border-2 border-dashed border-neutral-50" />
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
