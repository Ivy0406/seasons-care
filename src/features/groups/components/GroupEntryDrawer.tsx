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
import useUpdateGroup from '@/features/groups/hooks/useUpdateGroup';
import cn from '@/lib/utils';

type DrawerStep = 'entry' | 'create' | 'success';
type GroupEntryMode = 'create' | 'edit';

type GroupEntryDrawerProps = {
  open?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
  onInviteMembers?: (inviteCode?: string) => void;
  onJoinGroup?: () => void;
  initialStep?: DrawerStep;
  mode?: GroupEntryMode;
  groupId?: string | null;
  initialGroupName?: string;
  initialRecipientName?: string;
  initialRecipientGender?: string;
  initialRecipientBirthDate?: string;
  initialDescription?: string;
  initialHealthStatus?: string;
};

type DrawerIllustrationProps = {
  src: string;
  alt: string;
  className?: string;
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
  descriptionClassName?: string;
};

type DrawerSuccessStepProps = {
  title: string;
  closeAriaLabel: string;
  description: string;
  primaryLabel: string;
  onPrimaryClick: () => void;
  onClose: () => void;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
};

function DrawerIllustration({ src, alt, className }: DrawerIllustrationProps) {
  return (
    <div className="mx-auto h-40 w-40 overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={cn('h-full w-full object-cover', className)}
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
  descriptionClassName,
}: DrawerActionStepProps) {
  return (
    <div className={cn('flex flex-col text-neutral-900', className)}>
      <DrawerIllustration
        src={image.src}
        alt={image.alt}
        className={cn(image.className, imageClassName)}
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

function DrawerSuccessStep({
  title,
  closeAriaLabel,
  description,
  primaryLabel,
  onPrimaryClick,
  onClose,
  secondaryLabel,
  onSecondaryClick,
}: DrawerSuccessStepProps) {
  return (
    <div className="flex flex-col text-neutral-900">
      <div className="relative mb-5 flex items-center justify-center py-2">
        <button
          type="button"
          aria-label={closeAriaLabel}
          onClick={onClose}
          className="absolute left-0 inline-flex size-10 items-center justify-center"
        >
          <X className="size-8" strokeWidth={2} />
        </button>
        <h2 className="font-heading-sm">{title}</h2>
      </div>

      <DrawerActionStep
        image={{
          src: 'https://res.cloudinary.com/dyothufps/image/upload/v1774934772/addgroup_2x_wlr34y.webp',
          alt: '家人陪伴情境示意',
          className: 'border-0',
        }}
        description={description}
        primaryLabel={primaryLabel}
        secondaryLabel={secondaryLabel ?? '完成'}
        onPrimaryClick={onPrimaryClick}
        onSecondaryClick={onSecondaryClick ?? onClose}
      />
    </div>
  );
}

function GroupEntryDrawer({
  open = false,
  onClose,
  onComplete,
  onInviteMembers,
  onJoinGroup,
  initialStep = 'entry',
  mode = 'create',
  groupId = null,
  initialGroupName = '',
  initialRecipientName = '',
  initialRecipientGender = 'male',
  initialRecipientBirthDate = '2026-04-01',
  initialDescription = '',
  initialHealthStatus = '',
}: GroupEntryDrawerProps) {
  const { isLoading, handleCreateGroup } = useCreateGroup();
  const { isLoading: isUpdating, handleUpdateGroup } = useUpdateGroup();
  const [step, setStep] = useState<DrawerStep>(initialStep);
  const [createdInviteCode, setCreatedInviteCode] = useState('');
  const [groupName, setGroupName] = useState(initialGroupName);
  const [careRecipientName, setCareRecipientName] =
    useState(initialRecipientName);
  const [gender, setGender] = useState(initialRecipientGender);
  const [birthDate, setBirthDate] = useState(initialRecipientBirthDate);
  const [description] = useState(initialDescription);
  const [healthStatus] = useState(initialHealthStatus);
  const isEditMode = mode === 'edit';
  const isSubmitting = isLoading || isUpdating;
  const canSubmit =
    groupName.trim().length > 0 && careRecipientName.trim().length > 0;
  const successTitle = isEditMode ? '編輯完成！' : '創建完成！';
  const formTitle = isEditMode ? '編輯群組' : '建立照護群組';
  const formDescription = isEditMode
    ? '調整群組資訊，讓照護安排更符合目前需求。'
    : '建立或加入群組，來共同照護心愛的家人吧！';
  const submitLabel = isEditMode ? '完成編輯' : '建立群組';
  const successDescription = isEditMode
    ? '群組資訊已更新完成。'
    : '立即邀請成員，實現共同照護！';
  let submitText = submitLabel;

  if (isSubmitting) {
    submitText = isEditMode ? '更新中...' : '建立中...';
  }

  useEffect(() => {
    if (!open) {
      setStep(initialStep);
    }
  }, [initialStep, open]);

  useEffect(() => {
    setGroupName(initialGroupName);
    setCareRecipientName(initialRecipientName);
    setGender(initialRecipientGender);
    setBirthDate(initialRecipientBirthDate);
  }, [
    initialGroupName,
    initialRecipientName,
    initialRecipientBirthDate,
    initialRecipientGender,
    open,
  ]);

  const handleClose = () => {
    if (step === 'success') {
      onComplete?.();
    }

    onClose?.();
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    if (isEditMode) {
      if (!groupId) return;

      const result = await handleUpdateGroup(groupId, {
        name: groupName,
        recipientName: careRecipientName,
        recipientGender: gender,
        recipientBirthDate: birthDate,
        description,
        healthStatus,
      });

      if (result) {
        setStep('success');
      }
      return;
    }

    const result = await handleCreateGroup({
      name: groupName,
      recipientName: careRecipientName,
      recipientGender: gender,
      recipientBirthDate: birthDate,
    });

    if (result) {
      setCreatedInviteCode(result.inviteCode ?? '');
      setStep('success');
    }
  };

  if (step === 'success') {
    if (isEditMode) {
      return (
        <DrawerSuccessStep
          title={successTitle}
          closeAriaLabel="關閉編輯完成視窗"
          description={successDescription}
          primaryLabel="完成"
          onPrimaryClick={handleClose}
          onClose={handleClose}
        />
      );
    }

    return (
      <DrawerSuccessStep
        title={successTitle}
        closeAriaLabel="關閉建立完成視窗"
        description={successDescription}
        primaryLabel="分享邀請連結"
        secondaryLabel="暫時略過"
        onPrimaryClick={() => onInviteMembers?.(createdInviteCode)}
        onSecondaryClick={handleClose}
        onClose={handleClose}
      />
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
              label="群組名稱"
              inputProps={{
                value: groupName,
                onChange: (event) => setGroupName(event.target.value),
              }}
            />
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
            <ListFormBirthDateRow
              label="出生年月日"
              value={birthDate}
              onChange={setBirthDate}
            />
          </div>

          <RoundedButtonPrimary
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
          >
            {submitText}
          </RoundedButtonPrimary>
        </div>
      </div>
    );
  }

  return (
    <DrawerActionStep
      image={{
        src: 'https://res.cloudinary.com/dyothufps/image/upload/v1774934773/nongroup_2x_qrajbi.webp',
        alt: '尚未加入群組示意圖',
      }}
      description="您目前還沒有加入任何群組"
      primaryLabel="建立群組"
      secondaryLabel="加入群組"
      imageClassName="aspect-square h-40"
      onPrimaryClick={() => setStep('create')}
      onSecondaryClick={() => onJoinGroup?.()}
    />
  );
}

export default GroupEntryDrawer;
