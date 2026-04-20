const avatarImageModules = import.meta.glob<string>('./Avatar-*.png', {
  eager: true,
  import: 'default',
});

export default function getAvatarSrcByKey(avatarKey: string): string {
  return avatarImageModules[`./${avatarKey}.png`] ?? '';
}

export function getAvatarKeys(): string[] {
  return Object.keys(avatarImageModules)
    .sort()
    .map((path) => path.replace('./', '').replace('.png', ''));
}
