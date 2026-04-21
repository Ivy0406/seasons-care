type AvatarImages = {
  id: number;
  avatarKey: string;
  url: string;
  name: string;
};

const AVATAR_OPTIONS: AvatarImages[] = [
  {
    id: 1,
    avatarKey: 'Avatar-01',
    url: new URL('@/assets/images/avatars/Avatar-01.png', import.meta.url).href,
    name: '喵喵',
  },
  {
    id: 2,
    avatarKey: 'Avatar-02',
    url: new URL('@/assets/images/avatars/Avatar-02.png', import.meta.url).href,
    name: '汪汪',
  },
  {
    id: 3,
    avatarKey: 'Avatar-03',
    url: new URL('@/assets/images/avatars/Avatar-03.png', import.meta.url).href,
    name: '虎虎',
  },
  {
    id: 4,
    avatarKey: 'Avatar-04',
    url: new URL('@/assets/images/avatars/Avatar-04.png', import.meta.url).href,
    name: '猴猴',
  },
  {
    id: 5,
    avatarKey: 'Avatar-05',
    url: new URL('@/assets/images/avatars/Avatar-05.png', import.meta.url).href,
    name: '雀雀',
  },
  {
    id: 6,
    avatarKey: 'Avatar-06',
    url: new URL('@/assets/images/avatars/Avatar-06.png', import.meta.url).href,
    name: '熊貓',
  },
];

const useAvatars = () => {
  return AVATAR_OPTIONS;
};

export default useAvatars;
