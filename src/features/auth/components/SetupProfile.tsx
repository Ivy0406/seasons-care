import { useState } from 'react';

import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

import BaseDrawer from '@/components/ui/BaseDrawer';
import { FieldWrapper, InputFieldName } from '@/components/ui/InputField';
import {
  RoundedButtonDisabled,
  RoundedButtonPrimary,
} from '@/components/ui/RoundedButtons';
import SingleAvatar from '@/components/ui/SingleAvatar';

type SetupProfileFormValues = {
  name: string;
};

type SetupProfileProps = {
  onSubmit: (data: SetupProfileFormValues & { avatar: string }) => void;
};

const mockAvatars = [
  {
    id: 1,
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2gbduGx3PLhooclj5FTu26kXR2mFU-e6RHw&s',
    name: '角色 1',
  },
  {
    id: 2,
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLwmfCSSY4cz2MRwxWp7LkpG9fiiYwrd4a6A&s',
    name: '角色 2',
  },
  {
    id: 3,
    src: 'https://media.gq.com.tw/photos/5f610be207ee6a88a9ff4511/16:9/w_2560%2Cc_limit/S__21971252.jpg',
    name: '角色 3',
  },
  {
    id: 4,
    src: 'https://preview.qiantucdn.com/58pic/7D/UR/Xx/Wj3owH57aGsDqXVrzQ7TSFT9YtNYfIjZ3h_PIC2018.png!qt_h320_webp',
    name: '角色 4',
  },
  {
    id: 5,
    src: 'https://p3-pc-sign.douyinpic.com/tos-cn-i-0813c000-ce/oUEAIekfwl6Ej0A9WCGpiAFpNA6DiAwEAxfZbE~tplv-dy-aweme-images-v2:1440:1440:q75.webp?biz_tag=aweme_images&from=327834062&lk3s=138a59ce&s=PackSourceEnum_SEARCH&sc=image&se=false&x-expires=1775433600&x-signature=FsOpzfZmcp%2BS8gaEUXuwDq%2Bx738%3D',
    name: '角色 5',
  },
  {
    id: 6,
    src: 'https://p3-pc-sign.douyinpic.com/tos-cn-i-0813c000-ce/osaBgQcMgiAEQi7X8AQ7JAAeQsfXJvgf2ZkFV8~noop.jpeg?biz_tag=pcweb_cover&card_type=303&column_n=0&from=327834062&lk3s=138a59ce&s=PackSourceEnum_SEARCH&se=false&x-expires=1774634400&x-signature=IhcEPOrnedk0QXM94FXz3uQxVJM%3D',
    name: '角色 6',
  },
];

const SetupProfile = ({ onSubmit }: SetupProfileProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(mockAvatars[0]);
  const [tempSelectedAvatar, setTempSelectedAvatar] = useState(mockAvatars[0]);
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

  const localOnSubmit = (data: SetupProfileFormValues) => {
    onSubmit({ ...data, avatar: selectedAvatar.src });
  };

  return (
    <form
      className="flex w-full flex-col items-center gap-1"
      onSubmit={handleSubmit(localOnSubmit)}
    >
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
          src={selectedAvatar.src}
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
                {mockAvatars.map((avatar) => (
                  <SingleAvatar
                    key={avatar.id}
                    src={avatar.src}
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

      <FieldWrapper label="建立使用者名稱" htmlFor="name">
        <InputFieldName
          id="name"
          {...register('name', { required: '使用者名字是必填' })}
          error={errors.name?.message}
        />
      </FieldWrapper>
      <div className="mt-4 w-full">
        {isValid ? (
          <RoundedButtonPrimary onClick={handleSubmit(localOnSubmit)}>
            建立檔案
          </RoundedButtonPrimary>
        ) : (
          <RoundedButtonDisabled>建立檔案</RoundedButtonDisabled>
        )}
      </div>
    </form>
  );
};

export default SetupProfile;
