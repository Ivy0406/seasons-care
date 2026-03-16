import { Avatar, AvatarImage, AvatarFallback } from './avatar';

function SingleAvatar({ src, name }: { src: string; name: string }) {
  return (
    <Avatar className="onSelected:ring-primary-default size-20 ring-2 ring-neutral-900">
      <AvatarImage src={src} alt={name} />
      <AvatarFallback>{name[0]}</AvatarFallback>
    </Avatar>
  );
}

export default SingleAvatar;
