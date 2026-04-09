import getAvatarSrcByKey, { getAvatarKeys } from '@/assets/images/avatars';

type AvatarOption = {
  id: number;
  avatarKey: string;
  url: string;
};

const AVATAR_OPTIONS: AvatarOption[] = getAvatarKeys().map(
  (avatarKey, index) => ({
    id: index + 1,
    avatarKey,
    url: getAvatarSrcByKey(avatarKey),
  }),
);

const useAvatars = () => AVATAR_OPTIONS;

export default useAvatars;
