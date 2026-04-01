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
import useCreateGroup from '@/features/groups/hooks/useCreateGroup';
import cn from '@/lib/utils';

type DrawerStep = 'entry' | 'create' | 'success';
type GroupEntryMode = 'create' | 'edit';

type GroupEntryDrawerProps = {
  open?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
  onInviteMembers?: () => void;
  initialStep?: DrawerStep;
  mode?: GroupEntryMode;
  initialGroupName?: string;
};

type DrawerIllustrationProps = {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
};

type DrawerActionStepProps = {
  image: DrawerIllustrationProps;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  className?: string;
  imageClassName?: string;
  imageWrapperClassName?: string;
  descriptionClassName?: string;
};

function DrawerIllustration({
  src,
  alt,
  className,
  wrapperClassName,
}: DrawerIllustrationProps) {
  return (
    <div
      className={cn(
        'mx-2 aspect-331/160 overflow-hidden rounded-[8px]',
        wrapperClassName,
      )}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          'h-full w-full rounded-[8px] border-2 border-neutral-900 object-cover',
          className,
        )}
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
  imageClassName,
  imageWrapperClassName,
  descriptionClassName,
}: DrawerActionStepProps) {
  return (
    <div className={cn('flex flex-col text-neutral-900', className)}>
      <DrawerIllustration
        src={image.src}
        alt={image.alt}
        className={cn(image.className, imageClassName)}
        wrapperClassName={cn(image.wrapperClassName, imageWrapperClassName)}
      />
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

function GroupEntryDrawer({
  open = false,
  onClose,
  onComplete,
  onInviteMembers,
  initialStep = 'entry',
  mode = 'create',
  initialGroupName = '',
}: GroupEntryDrawerProps) {
  const { isLoading, handleCreateGroup } = useCreateGroup();
  const [step, setStep] = useState<DrawerStep>(initialStep);
  const [careRecipientName, setCareRecipientName] = useState(initialGroupName);
  const [gender, setGender] = useState('male');
  const [birthDate] = useState('2026-04-01');
  const isEditMode = mode === 'edit';
  const canSubmit = careRecipientName.trim().length > 0;
  const successTitle = isEditMode ? '編輯完成！' : '創建完成！';
  const formTitle = isEditMode ? '編輯群組' : '建立照護群組';
  const formDescription = isEditMode
    ? '調整群組資訊，讓照護安排更符合目前需求。'
    : '建立或加入群組，來共同照護心愛的家人吧！';
  const submitLabel = isEditMode ? '完成編輯' : '建立群組';
  const successDescription = isEditMode
    ? '群組資訊已更新完成。'
    : '立即邀請成員，實現共同照護！';

  useEffect(() => {
    if (!open) {
      setStep(initialStep);
    }
  }, [initialStep, open]);

  useEffect(() => {
    setCareRecipientName(initialGroupName);
  }, [initialGroupName, open]);

  const handleClose = () => {
    if (step === 'success') {
      onComplete?.();
    }

    onClose?.();
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    if (isEditMode) {
      setStep('success');
      return;
    }

    try {
      await handleCreateGroup({
        recipientName: careRecipientName,
        recipientGender: gender,
        recipientBirthDate: birthDate,
      });
      setStep('success');
    } catch {
      // 錯誤已於上一層 hook 處理。
    }
  };

  if (step === 'success') {
    if (isEditMode) {
      return (
        <div className="flex flex-col text-neutral-900">
          <div className="relative mb-5 flex items-center justify-center py-2">
            <button
              type="button"
              aria-label="關閉編輯完成視窗"
              onClick={handleClose}
              className="absolute left-0 inline-flex size-10 items-center justify-center"
            >
              <X className="size-8" strokeWidth={2} />
            </button>
            <h2 className="font-heading-sm">{successTitle}</h2>
          </div>

          <div className="mx-auto size-40 rounded-[8px]">
            <img
              src="https://res.cloudinary.com/dyothufps/image/upload/v1774850087/%E5%89%8D%E5%B0%8E1_ejw28k.webp"
              alt="家人陪伴情境示意"
              className="h-full w-full object-cover"
            />
          </div>

          <p className="font-paragraph-md mx-auto mt-3 text-center text-neutral-700">
            {successDescription}
          </p>

          <div className="mt-7">
            <RoundedButtonPrimary onClick={handleClose}>
              完成
            </RoundedButtonPrimary>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col text-neutral-900">
        <div className="relative mb-5 flex items-center justify-center py-2">
          <button
            type="button"
            aria-label="關閉建立完成視窗"
            onClick={handleClose}
            className="absolute left-0 inline-flex size-10 items-center justify-center"
          >
            <X className="size-8" strokeWidth={2} />
          </button>
          <h2 className="font-heading-sm">{successTitle}</h2>
        </div>

        <div>
          <DrawerActionStep
            image={{
              src: 'https://res.cloudinary.com/dyothufps/image/upload/v1774850087/%E5%89%8D%E5%B0%8E1_ejw28k.webp',
              alt: '家人陪伴情境示意',
              className: 'border-0',
            }}
            description={successDescription}
            primaryLabel="分享邀請連結"
            secondaryLabel="暫時略過"
            onPrimaryClick={() => onInviteMembers?.()}
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
          <h2 className="font-label-lg">{formTitle}</h2>
        </div>

        <p className="font-paragraph-md mx-auto pb-3 text-neutral-900">
          {formDescription}
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

          <RoundedButtonPrimary
            onClick={handleSubmit}
            disabled={!canSubmit || isLoading}
          >
            {isLoading ? '建立中...' : submitLabel}
          </RoundedButtonPrimary>
        </div>
      </div>
    );
  }

  return (
    <DrawerActionStep
      image={{
        src: 'https://res.cloudinary.com/dyothufps/image/upload/v1774850087/%E5%89%8D%E5%B0%8E1_ejw28k.webp',
        alt: '老人摸手',
      }}
      imageClassName="border-0"
      description="您目前還沒有加入任何群組"
      primaryLabel="建立群組"
      secondaryLabel="加入群組"
      onPrimaryClick={() => setStep('create')}
      onSecondaryClick={() => {}}
    />
  );
}

export default GroupEntryDrawer;
