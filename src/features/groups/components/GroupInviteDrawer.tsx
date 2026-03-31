import { useState } from 'react';

import { Link as LinkIcon, Link2, Share, X } from 'lucide-react';

import BaseDrawer from '@/components/common/BaseDrawer';
import Modal from '@/components/common/Modal';
import { RoundedButtonSecondary } from '@/components/common/RoundedButtons';

type GroupInviteDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteCode?: string;
};

const DEFAULT_INVITE_CODE = '14673156';

function MockQrCode() {
  return <div className="mx-auto size-[145px] bg-neutral-300" />;
}

function GroupInviteDrawer({
  open,
  onOpenChange,
  inviteCode = DEFAULT_INVITE_CODE,
}: GroupInviteDrawerProps) {
  const [isCopiedModalOpen, setIsCopiedModalOpen] = useState(false);
  const inviteLink = `https://seasons-care.app/invite/${inviteCode}`;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setIsCopiedModalOpen(true);
  };

  const handleShareLink = async () => {
    if (navigator.share) {
      await navigator.share({
        title: '邀請加入照護群組',
        text: '邀請你加入我的照護群組',
        url: inviteLink,
      });
      return;
    }

    await navigator.clipboard.writeText(inviteLink);
  };

  return (
    <>
      <BaseDrawer open={open} onOpenChange={onOpenChange}>
        <div className="flex flex-col text-neutral-900">
          <div className="relative mb-8 flex items-center justify-center py-2">
            <button
              type="button"
              aria-label="關閉邀請成員視窗"
              onClick={() => onOpenChange(false)}
              className="absolute left-0 inline-flex size-10 items-center justify-center"
            >
              <X className="size-8" strokeWidth={1.5} />
            </button>
            <h2 className="font-label-lg">邀請成員</h2>
          </div>

          <p className="font-paragraph-md mb-5 text-center text-neutral-700">
            你的邀請連結將在30天後過期。
          </p>

          <MockQrCode />

          <p className="font-label-lg mt-3 text-center">{inviteCode}</p>

          <div className="mt-9 flex flex-col gap-3">
            <RoundedButtonSecondary
              className="border border-neutral-900"
              onClick={handleCopyCode}
            >
              <span className="inline-flex items-center gap-2">
                <Link2 className="size-5" strokeWidth={2.5} />
                複製邀請號碼
              </span>
            </RoundedButtonSecondary>

            <RoundedButtonSecondary
              className="border border-neutral-900"
              onClick={handleShareLink}
            >
              <span className="inline-flex items-center gap-2">
                <Share className="size-5" strokeWidth={2.5} />
                分享邀請連結
              </span>
            </RoundedButtonSecondary>
          </div>
        </div>
      </BaseDrawer>

      <Modal
        open={isCopiedModalOpen}
        title="連結已複製"
        variant="success"
        statusLayout="icon-first"
        autoCloseMs={1200}
        onClose={() => {
          setIsCopiedModalOpen(false);
        }}
        className="aspect-square h-30 w-30 rounded-[8px] border-0 bg-neutral-700/80 px-0 py-0"
        titleClassName="font-paragraph-md text-neutral-50"
        statusIcon={
          <span className="inline-flex size-10 items-center justify-center text-neutral-50">
            <LinkIcon className="size-8" strokeWidth={2.2} />
          </span>
        }
      />
    </>
  );
}

export default GroupInviteDrawer;
