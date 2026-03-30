import { useEffect, useState } from 'react';

import { X } from 'lucide-react';

import BaseDrawer from '@/components/common/BaseDrawer';
import { InputFieldGroupId } from '@/components/common/InputField';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';

type GroupJoinDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function GroupJoinDrawer({ open, onOpenChange }: GroupJoinDrawerProps) {
  const [groupId, setGroupId] = useState('');
  const [isJoinSuccess, setIsJoinSuccess] = useState(false);
  const [hasTouchedGroupId, setHasTouchedGroupId] = useState(false);
  const trimmedGroupId = groupId.trim();
  const isGroupIdValid = /^[a-zA-Z0-9]{8}$/.test(trimmedGroupId);
  const canSubmit = trimmedGroupId.length === 8;
  const showGroupIdError =
    hasTouchedGroupId && trimmedGroupId !== '' && !isGroupIdValid;

  useEffect(() => {
    if (!open) {
      setGroupId('');
      setIsJoinSuccess(false);
      setHasTouchedGroupId(false);
    }
  }, [open]);

  const handleJoinGroup = () => {
    setHasTouchedGroupId(true);

    if (!isGroupIdValid) return;

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

          <div className="mx-2 aspect-331/160 overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80"
              alt="家人陪伴情境示意"
              className="h-full w-full rounded-lg border-2 border-neutral-900 object-cover"
            />
          </div>

          <p className="font-paragraph-md mx-auto mt-3 text-center text-neutral-700">
            群組加入完成，現在開始共同照護！
          </p>

          <div className="mt-10">
            <RoundedButtonPrimary
              type="button"
              onClick={() => onOpenChange(false)}
            >
              完成
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
            請輸入要加入的群組 ID
          </p>

          <InputFieldGroupId
            value={groupId}
            onChange={(event) => setGroupId(event.target.value)}
            onBlur={() => setHasTouchedGroupId(true)}
            onClear={() => {
              setGroupId('');
              setHasTouchedGroupId(false);
            }}
            error={showGroupIdError ? '格式錯誤' : undefined}
          />

          <RoundedButtonPrimary
            type="button"
            onClick={handleJoinGroup}
            disabled={!canSubmit}
            className="mt-22"
          >
            確認加入
          </RoundedButtonPrimary>
        </div>
      )}
    </BaseDrawer>
  );
}

export default GroupJoinDrawer;
