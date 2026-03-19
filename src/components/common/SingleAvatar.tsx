import cn from '@/lib/utils';

import { Avatar, AvatarImage, AvatarFallback } from './avatar';

type SingleAvatarProps = {
  src: string;
  name: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
};

function SingleAvatar({
  src,
  name,
  isSelected,
  onClick,
  className,
}: SingleAvatarProps) {
  return (
    <Avatar
      className={cn(
        'size-20 ring-2 ring-neutral-900 transition-all',
        isSelected && 'ring-primary-dark ring-4',
        onClick && 'cursor-pointer',
        className,
      )}
      data-state={isSelected ? 'checked' : 'unchecked'}
      onClick={onClick}
    >
      <AvatarImage src={src} alt={name} />
      <AvatarFallback>{name[0]}</AvatarFallback>
    </Avatar>
  );
}

export default SingleAvatar;
