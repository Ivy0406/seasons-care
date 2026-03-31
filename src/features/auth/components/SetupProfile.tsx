import { useState } from 'react';

import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

import BaseDrawer from '@/components/common/BaseDrawer';
import { FieldWrapper, InputFieldName } from '@/components/common/InputField';
import {
  RoundedButtonDisabled,
  RoundedButtonPrimary,
} from '@/components/common/RoundedButtons';
import SingleAvatar from '@/components/common/SingleAvatar';

import useAvatars from '../hooks/useAvatars';

type SetupProfileFormValues = {
  name: string;
};

type SetupProfileProps = {
  onSubmit: (data: SetupProfileFormValues & { avatarKey: string }) => void;
  isLoading?: boolean;
};

const SetupProfile = ({ onSubmit, isLoading }: SetupProfileProps) => {
  const avatarOptions = useAvatars();
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [tempSelectedAvatar, setTempSelectedAvatar] = useState(
    avatarOptions[0],
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SetupProfileFormValues>({ mode: 'onChange' });
  const currentName = watch('name');

  const handleConfirmAvatar = () => {
    setSelectedAvatar(tempSelectedAvatar);
    setIsDrawerOpen(false);
  };

  const handleProfileSubmit = (data: SetupProfileFormValues) => {
    onSubmit({ ...data, avatarKey: selectedAvatar.avatarKey });
  };

  return (
    <form
      className="flex w-full flex-col items-center"
      onSubmit={handleSubmit(handleProfileSubmit)}
    >
      <div className="flex w-full flex-col pb-27">
        <div className="mb-5 flex flex-col items-center gap-1">
          <p className="font-heading-md text-neutral-900">
            我們精心為你打造了數位分身
          </p>
          <p className="font-heading-md text-neutral-900">
            選個角色，準備開始照護！
          </p>
        </div>
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
              <p className="font-label-md text-primary-dark mb-10 cursor-pointer">
                更換角色
              </p>
            }
          >
            <div className="relative flex flex-col items-center gap-5">
              <div className="flex w-full items-center justify-between">
                <div className="flex h-10 w-full items-center justify-center">
                  <X
                    className="absolute left-0 cursor-pointer"
                    onClick={() => setIsDrawerOpen(false)}
                  />
                  <p className="font-label-lg text-neutral-900">選擇角色</p>
                  <div />
                </div>
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
                      name={currentName || avatar.name}
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
          labelClassName="font-label-md text-neutral-900 text-center mb-3"
          label="建立使用者名稱"
          htmlFor="name"
        >
          <InputFieldName
            id="name"
            {...register('name', { required: '使用者名字是必填' })}
            error={errors.name?.message}
          />
        </FieldWrapper>
      </div>

      <div className="w-full">
        {isValid && !isLoading ? (
          <RoundedButtonPrimary onClick={handleSubmit(handleProfileSubmit)}>
            建立檔案
          </RoundedButtonPrimary>
        ) : (
          <RoundedButtonDisabled>
            {isLoading ? '建立中...' : '建立檔案'}
          </RoundedButtonDisabled>
        )}
      </div>
    </form>
  );
};

export default SetupProfile;
