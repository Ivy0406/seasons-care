import { useEffect, useState } from 'react';

import { Check, X } from 'lucide-react';

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
  const isGroupIdValid = /^\d{8}$/.test(trimmedGroupId);
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
        <div className="flex flex-col gap-6 text-neutral-900">
          <div className="relative flex items-center justify-center py-2">
            <button
              type="button"
              aria-label="關閉加入群組視窗"
              onClick={() => onOpenChange(false)}
              className="absolute left-0 inline-flex size-10 items-center justify-center"
            >
              <X className="size-8" strokeWidth={1.5} />
            </button>
            <h2 className="font-heading-sm">加入成功！</h2>
          </div>

          <div className="flex flex-col items-center gap-4 pt-2 pb-1">
            <span className="bg-primary-default inline-flex size-10 items-center justify-center rounded-full text-neutral-900">
              <Check className="size-4" strokeWidth={3} />
            </span>
            <p className="font-paragraph-md text-center text-neutral-700">
              你已成功加入照護群組。
            </p>
          </div>

          <RoundedButtonPrimary
            type="button"
            onClick={() => onOpenChange(false)}
          >
            完成
          </RoundedButtonPrimary>
        </div>
      ) : (
        <div className="flex flex-col gap-6 text-neutral-900">
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

          <p className="font-paragraph-md text-center text-neutral-700">
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
            disabled={!isGroupIdValid}
          >
            確認加入
          </RoundedButtonPrimary>
        </div>
      )}
    </BaseDrawer>
  );
}

export default GroupJoinDrawer;
