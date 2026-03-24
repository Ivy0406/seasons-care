import { useEffect, useState } from 'react';

import { X } from 'lucide-react';

import {
  ListFormBirthDateRow,
  ListFormGenderRow,
  ListFormNameRow,
} from '@/components/common/ListFormRows';
import {
  RoundedButtonPrimary,
  RoundedButtonSecondary,
} from '@/components/common/RoundedButtons';
import cn from '@/lib/utils';

type GroupEntryDrawerProps = {
  open?: boolean;
  onClose?: () => void;
};

type DrawerStep = 'entry' | 'create' | 'success';

type DrawerIllustrationProps = {
  src: string;
  alt: string;
};

type DrawerActionStepProps = {
  image: DrawerIllustrationProps;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  className?: string;
  descriptionClassName?: string;
};

function DrawerIllustration({ src, alt }: DrawerIllustrationProps) {
  return (
    <div className="mx-2 aspect-331/160 overflow-hidden rounded-[8px]">
      <img
        src={src}
        alt={alt}
        className="h-full w-full rounded-[8px] border-2 border-neutral-900 object-cover"
      />
    </div>
  );
}

function DrawerActionStep({
  image,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimaryClick,
  onSecondaryClick,
  className,
  descriptionClassName,
}: DrawerActionStepProps) {
  return (
    <div className={cn('flex flex-col text-neutral-900', className)}>
      <DrawerIllustration src={image.src} alt={image.alt} />
      <p className={cn('font-paragraph-md mx-auto mt-3', descriptionClassName)}>
        {description}
      </p>
      <div className="mt-2 flex flex-col gap-3">
        <RoundedButtonPrimary onClick={onPrimaryClick}>
          {primaryLabel}
        </RoundedButtonPrimary>
        <RoundedButtonSecondary onClick={onSecondaryClick}>
          {secondaryLabel}
        </RoundedButtonSecondary>
      </div>
    </div>
  );
}

function GroupEntryDrawer({ open = false, onClose }: GroupEntryDrawerProps) {
  const [step, setStep] = useState<DrawerStep>('entry');
  const [careRecipientName, setCareRecipientName] = useState('');
  const [gender, setGender] = useState('male');
  const [birthDate] = useState('2026/01/12');
  const handleClose = () => {
    onClose?.();
  };

  useEffect(() => {
    if (!open) {
      setStep('entry');
    }
  }, [open]);

  if (step === 'success') {
    return (
      <div className="flex flex-col text-neutral-900">
        <div className="relative mb-5 flex items-center justify-center py-2">
          <button
            type="button"
            aria-label="關閉建立完成視窗"
            onClick={onClose}
            className="absolute left-0 inline-flex size-10 items-center justify-center"
          >
            <X className="size-8" strokeWidth={2} />
          </button>
          <h2 className="font-heading-sm">創建完成！</h2>
        </div>

        <div>
          <DrawerActionStep
            image={{
              src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
              alt: '家人陪伴情境示意',
            }}
            description="立即邀請成員，實現共同照護！"
            primaryLabel="分享邀請連結"
            secondaryLabel="暫時略過"
            onPrimaryClick={() => {}}
            onSecondaryClick={handleClose}
          />
        </div>
      </div>
    );
  }

  if (step === 'create') {
    return (
      <div className="flex flex-col text-neutral-900">
        <div className="relative mb-5 flex items-center justify-center py-2">
          <button
            type="button"
            aria-label="關閉建立群組視窗"
            onClick={onClose}
            className="absolute left-0 inline-flex size-10 items-center justify-center"
          >
            <X className="size-8" strokeWidth={2} />
          </button>
          <h2 className="font-label-lg">建立照護群組</h2>
        </div>

        <p className="font-paragraph-md mx-auto pb-3 text-neutral-900">
          建立或加入群組，來共同照護心愛的家人吧！
        </p>

        <div className="flex flex-col">
          <div className="mb-20 flex flex-col gap-2">
            <ListFormNameRow
              label="被照護者名稱"
              inputProps={{
                value: careRecipientName,
                onChange: (event) => setCareRecipientName(event.target.value),
              }}
            />
            <ListFormGenderRow
              label="被照護者性別"
              value={gender}
              options={[
                { value: '', label: '請選擇' },
                { value: 'male', label: '男' },
                { value: 'female', label: '女' },
                { value: 'other', label: '其他' },
              ]}
              onChange={setGender}
            />
            <ListFormBirthDateRow label="出生年月日" value={birthDate} />
          </div>

          <RoundedButtonPrimary onClick={() => setStep('success')}>
            建立群組
          </RoundedButtonPrimary>
        </div>
      </div>
    );
  }

  return (
    <DrawerActionStep
      image={{
        src: 'https://plus.unsplash.com/premium_photo-1745485079766-6c6dcbe1df52?auto=format&fit=crop&w=1200&q=80',
        alt: '老人摸手',
      }}
      description="您目前還沒有加入任何群組"
      primaryLabel="建立群組"
      secondaryLabel="加入群組"
      onPrimaryClick={() => setStep('create')}
      onSecondaryClick={() => {}}
    />
  );
}

export default GroupEntryDrawer;
