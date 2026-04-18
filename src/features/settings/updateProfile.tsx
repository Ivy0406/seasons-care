import { useState } from 'react';

import axios from 'axios';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

import setupProfile from '@/api/endpoints/user';
import BaseDrawer from '@/components/common/BaseDrawer';
import { FieldWrapper, InputFieldName } from '@/components/common/InputField';
import Modal from '@/components/common/Modal';
import { RoundedButtonPrimary } from '@/components/common/RoundedButtons';
import SingleAvatar from '@/components/common/SingleAvatar';
import useAvatars from '@/features/auth/hooks/useAvatars';

type UpdateProfileFormValues = {
  name: string;
};

type UpdateProfileProps = {
  defaultName?: string;
  defaultAvatarKey?: string;
  onSuccess: () => void;
};

type ModalState = {
  open: boolean;
  variant: 'success' | 'error';
  message: string;
};

function UpdateProfile({
  defaultName = '',
  defaultAvatarKey,
  onSuccess,
}: UpdateProfileProps) {
  const avatarOptions = useAvatars();
  const initialAvatar =
    avatarOptions.find((a) => a.avatarKey === defaultAvatarKey) ??
    avatarOptions[0];

  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar);
  const [tempSelectedAvatar, setTempSelectedAvatar] = useState(initialAvatar);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    variant: 'success',
    message: '',
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    mode: 'onChange',
    defaultValues: { name: defaultName },
  });

  const currentName = watch('name');

  const handleConfirmAvatar = () => {
    setSelectedAvatar(tempSelectedAvatar);
    setIsDrawerOpen(false);
  };

  const handleFormSubmit = async (data: UpdateProfileFormValues) => {
    setIsLoading(true);
    try {
      await setupProfile({ userName: data.name, avatarKey: selectedAvatar.avatarKey });
      setModal({ open: true, variant: 'success', message: '個人資料已更新' });
    } catch (error) {
      const detail = axios.isAxiosError(error)
        ? (error.response?.data?.detail ?? '儲存失敗，請稍後再試')
        : '儲存失敗，請稍後再試';
      setModal({ open: true, variant: 'error', message: detail });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    if (modal.variant === 'success') onSuccess();
    setModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <form
        className="flex w-full flex-col items-center gap-8 p-6"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="flex flex-col items-center gap-3">
          <SingleAvatar
            isSelected
            src={selectedAvatar.url}
            className="h-35 w-35"
            name={currentName || '照護者'}
            onClick={() => setIsDrawerOpen(true)}
          />
          <BaseDrawer
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            trigger={
              <p className="font-label-md text-primary-dark cursor-pointer">
                更換角色
              </p>
            }
          >
            <div className="relative flex flex-col items-center gap-5">
              <div className="flex h-10 w-full items-center justify-center">
                <X
                  className="absolute left-0 cursor-pointer"
                  onClick={() => setIsDrawerOpen(false)}
                />
                <p className="font-label-lg text-neutral-900">選擇角色</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-paragraph-md text-neutral-900">
                  選擇喜歡的角色吧！
                </p>
                <div className="grid grid-cols-3 gap-5 pt-5 pb-8">
                  {avatarOptions.map((avatar) => (
                    <SingleAvatar
                      key={avatar.id}
                      src={avatar.url}
                      name={currentName || '照護者'}
                      isSelected={tempSelectedAvatar.id === avatar.id}
                      onClick={() => setTempSelectedAvatar(avatar)}
                    />
                  ))}
                </div>
              </div>
              <RoundedButtonPrimary
                className="h-10"
                onClick={handleConfirmAvatar}
                type="button"
              >
                確認
              </RoundedButtonPrimary>
            </div>
          </BaseDrawer>
        </div>

        <FieldWrapper
          label="使用者名稱"
          htmlFor="name"
          labelClassName="font-label-md text-neutral-900"
        >
          <InputFieldName
            id="name"
            {...register('name', { required: '使用者名稱是必填' })}
            error={errors.name?.message}
          />
        </FieldWrapper>

        <RoundedButtonPrimary type="submit" disabled={isLoading}>
          {isLoading ? '儲存中...' : '儲存'}
        </RoundedButtonPrimary>
      </form>

      <Modal
        open={modal.open}
        variant={modal.variant}
        title={modal.message}
        statusLayout="icon-first"
        autoCloseMs={modal.variant === 'success' ? 1500 : undefined}
        onClose={handleModalClose}
      />
    </>
  );
}

export default UpdateProfile;
