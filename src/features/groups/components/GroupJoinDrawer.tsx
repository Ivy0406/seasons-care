import { useEffect, useState } from 'react';

import { X } from 'lucide-react';

import BaseDrawer from '@/components/common/BaseDrawer';
import { InputFieldInviteCode } from '@/components/common/InputField';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import useJoinGroup from '@/features/groups/hooks/useJoinGroup';

type GroupJoinDrawerProps = {
  open: boolean;
  initialInviteCode?: string;
  onOpenChange: (open: boolean) => void;
};

function GroupJoinDrawer({
  open,
  initialInviteCode = '',
  onOpenChange,
}: GroupJoinDrawerProps) {
  const { isLoading, handleJoinGroup } = useJoinGroup();
  const [inviteCode, setInviteCode] = useState('');
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

  return (
    <BaseDrawer open={open} onOpenChange={onOpenChange}>
      {isJoinSuccess ? (
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
              src="https://res.cloudinary.com/dyothufps/image/upload/v1774850087/%E5%89%8D%E5%B0%8E1_ejw28k.webp"
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
              onClick={() => onOpenChange(false)}
            >
              立即開始照護
            </RoundedButtonPrimary>
          </div>
        </div>
      ) : (
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

          <p className="font-paragraph-md mt-17 mb-3 text-center text-neutral-700">
            請輸入要加入的邀請碼
          </p>

          <InputFieldInviteCode
            value={inviteCode}
            onChange={(event) =>
              setInviteCode(event.target.value.toUpperCase())
            }
            onBlur={() => setHasTouchedInviteCode(true)}
            onClear={() => {
              setInviteCode('');
              setHasTouchedInviteCode(false);
            }}
            error={showInviteCodeError ? '格式錯誤' : undefined}
          />

          <RoundedButtonPrimary
            type="button"
            onClick={handleSubmitJoinGroup}
            disabled={!canSubmit}
            className="mt-22"
          >
            {isLoading ? '加入中...' : '確認加入'}
          </RoundedButtonPrimary>
        </div>
      )}
    </BaseDrawer>
  );
}

export default GroupJoinDrawer;
