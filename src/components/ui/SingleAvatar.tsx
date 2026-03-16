import { Avatar, AvatarImage, AvatarFallback } from './avatar';

type SingleAvatarProps = {
  src: string;
  name: string;
  isSelected?: boolean;
  onClick?: () => void;
};

function SingleAvatar({ src, name, isSelected, onClick }: SingleAvatarProps) {
  return (
    <Avatar
      className="size-20 ring-2 ring-neutral-900"
      data-state={isSelected ? 'checked' : 'unchecked'}
      onClick={onClick}
    >
      <AvatarImage src={src} alt={name} />
      <AvatarFallback>{name[0]}</AvatarFallback>
    </Avatar>
  );
}

export default SingleAvatar;
