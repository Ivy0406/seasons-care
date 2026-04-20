import { useEffect, useState } from 'react';

import { Camera, X } from 'lucide-react';

import BaseDrawer from '@/components/common/BaseDrawer';
import { CircleButtonPrimary } from '@/components/common/CircleIButton';
import { InputFieldInviteCode } from '@/components/common/InputField';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import QRCodeScannerPanel from '@/features/groups/components/QRCodeScannerPanel';
import useJoinGroup from '@/features/groups/hooks/useJoinGroup';

type GroupJoinDrawerProps = {
  open: boolean;
  initialInviteCode?: string;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

function extractInviteCode(value: string) {
  const trimmedValue = value.trim();
  const getInviteCodeFromParams = (params: URLSearchParams) => {
    const matchedEntry = Array.from(params.entries()).find(
      ([key]) => key.toLowerCase() === 'invitecode',
    );

    return matchedEntry ? matchedEntry[1].trim().toUpperCase() : null;
  };

  try {
    const parsedUrl = new URL(trimmedValue);
    const inviteCodeFromQuery = getInviteCodeFromParams(parsedUrl.searchParams);

    if (inviteCodeFromQuery) {
      return inviteCodeFromQuery;
    }

    const hashValue = parsedUrl.hash.startsWith('#')
      ? parsedUrl.hash.slice(1)
      : parsedUrl.hash;
    const [hashPath = '', hashQueryString = ''] = hashValue.split('?');
    const hashSearchParams = new URLSearchParams(hashQueryString);
    const inviteCodeFromHash = getInviteCodeFromParams(hashSearchParams);

    if (inviteCodeFromHash) {
      return inviteCodeFromHash;
    }

    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
    const hashPathSegments = hashPath.split('/').filter(Boolean);
    const lastPathSegment = hashPathSegments.at(-1) ?? pathSegments.at(-1);

    if (lastPathSegment && /^[a-zA-Z0-9]{8}$/.test(lastPathSegment)) {
      return lastPathSegment.toUpperCase();
    }
  } catch {
    // Not a URL; fall through to direct code extraction.
  }

  const matchedInviteCode = trimmedValue.match(/[A-Z0-9]{8}/i);
  return matchedInviteCode ? matchedInviteCode[0].toUpperCase() : trimmedValue;
}

function GroupJoinDrawer({
  open,
  initialInviteCode = '',
  onOpenChange,
  onSuccess,
}: GroupJoinDrawerProps) {
  const { isLoading, handleJoinGroup } = useJoinGroup();
  const [inviteCode, setInviteCode] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isJoinSuccess, setIsJoinSuccess] = useState(false);
  const [hasTouchedInviteCode, setHasTouchedInviteCode] = useState(false);
  const trimmedInviteCode = inviteCode.trim().toUpperCase();
  const isInviteCodeValid = /^[a-zA-Z0-9]{8}$/.test(trimmedInviteCode);
  const canSubmit = trimmedInviteCode.length === 8 && !isLoading;
  const showInviteCodeError =
    hasTouchedInviteCode && trimmedInviteCode !== '' && !isInviteCodeValid;

  useEffect(() => {
    if (open) {
      setInviteCode(initialInviteCode.toUpperCase());
      setHasTouchedInviteCode(false);
      return;
    }

    if (!open) {
      setIsScannerOpen(false);
      setInviteCode('');
      setIsJoinSuccess(false);
      setHasTouchedInviteCode(false);
    }
  }, [initialInviteCode, open]);

  const handleSubmitJoinGroup = async () => {
    setHasTouchedInviteCode(true);

    if (!isInviteCodeValid) return;

    const joinedGroup = await handleJoinGroup({
      inviteCode: trimmedInviteCode,
    });

    if (joinedGroup === null) {
      return;
    }

    setIsJoinSuccess(true);
  };

  let drawerContent: React.ReactNode;

  if (isJoinSuccess) {
    drawerContent = (
      <div className="flex flex-col text-neutral-900">
        <div className="relative mb-5 flex items-center justify-center py-2">
          <button
            type="button"
            aria-label="關閉加入群組視窗"
            onClick={() => onOpenChange(false)}
            className="absolute left-0 inline-flex size-10 items-center justify-center"
          >
            <X className="size-8" strokeWidth={1.5} />
          </button>
          <h2 className="font-heading-sm">加入完成！</h2>
        </div>

        <div className="mx-auto size-40 rounded-[8px]">
          <img
            src="https://res.cloudinary.com/dyothufps/image/upload/v1774934772/addgroup_2x_wlr34y.webp"
            alt="家人陪伴情境示意"
            className="h-full w-full object-cover"
          />
        </div>

        <p className="font-paragraph-md mx-auto mt-3 text-center text-neutral-700">
          群組加入完成，現在開始共同照護！
        </p>

        <div className="mt-6.75">
          <RoundedButtonPrimary
            type="button"
            className="bg-neutral-800"
            onClick={() => {
              onOpenChange(false);
              onSuccess?.();
            }}
          >
            立即開始照護
          </RoundedButtonPrimary>
        </div>
      </div>
    );
  } else if (isScannerOpen) {
    drawerContent = (
      <QRCodeScannerPanel
        onBack={() => setIsScannerOpen(false)}
        onDetected={(value) => {
          setInviteCode(extractInviteCode(value));
          setHasTouchedInviteCode(false);
          setIsScannerOpen(false);
        }}
      />
    );
  } else {
    drawerContent = (
      <div className="flex flex-col text-neutral-900">
        <div className="relative flex items-center justify-center py-2">
          <button
            type="button"
            aria-label="關閉加入群組視窗"
            onClick={() => onOpenChange(false)}
            className="absolute left-0 inline-flex size-10 items-center justify-center"
          >
            <X className="size-8" strokeWidth={1.5} />
          </button>
          <h2 className="font-label-lg">加入照護群組</h2>
        </div>

        <p className="font-paragraph-md mt-6 mb-3 text-center text-neutral-700">
          請輸入要加入的邀請碼
        </p>

        <InputFieldInviteCode
          value={inviteCode}
          onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
          onBlur={() => setHasTouchedInviteCode(true)}
          onClear={() => {
            setInviteCode('');
            setHasTouchedInviteCode(false);
          }}
          error={showInviteCodeError ? '格式錯誤' : undefined}
        />

        <div className="mt-6 flex flex-col items-center gap-3">
          <CircleButtonPrimary
            type="button"
            size="lg"
            className="bg-neutral-800"
            aria-label="開啟相機掃描 QR code"
            onClick={() => setIsScannerOpen(true)}
          >
            <Camera />
          </CircleButtonPrimary>
          <p className="font-label-md text-neutral-700">掃描 QR code</p>
        </div>

        <RoundedButtonPrimary
          type="button"
          onClick={handleSubmitJoinGroup}
          disabled={!canSubmit}
          className="mt-6"
        >
          {isLoading ? '加入中...' : '確認加入'}
        </RoundedButtonPrimary>
      </div>
    );
  }

  return (
    <BaseDrawer open={open} onOpenChange={onOpenChange}>
      {drawerContent}
    </BaseDrawer>
  );
}

export default GroupJoinDrawer;
