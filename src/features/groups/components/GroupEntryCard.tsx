import type { HTMLAttributes } from 'react';

import { Plus } from 'lucide-react';

import getAvatarSrcByKey from '@/assets/images/avatars';
import { CircleButtonPrimary } from '@/components/common/CircleIButton';
import SingleAvatar from '@/components/common/SingleAvatar';
import { CURRENT_USER_KEY } from '@/constants/auth';
import cn from '@/lib/utils';
import type { UserInfo } from '@/types/auth';

type GroupEntryCardProps = HTMLAttributes<HTMLDivElement> & {
  onActionClick?: () => void;
};

function GroupEntryCard({
  className,
  onActionClick,
  ...props
}: GroupEntryCardProps) {
  const currentUser: UserInfo | null = JSON.parse(
    localStorage.getItem(CURRENT_USER_KEY) ?? 'null',
  );
  const currentUserAvatarSrc = getAvatarSrcByKey(currentUser?.avatarKey ?? '');

  return (
    <div
      className={cn(
        'bg-primary-default flex w-full flex-col items-center justify-center gap-7 rounded-[8px] border-2 border-neutral-900 px-3 py-5 text-neutral-900',
        className,
      )}
      {...props}
    >
      <div className="flex justify-center gap-5">
        <SingleAvatar
          src={currentUserAvatarSrc}
          name={currentUser?.userName ?? ''}
          className="size-18.25 ring-2 ring-neutral-900"
        />
        <div className="flex-1">
          <div className="flex flex-col">
            <p className="font-label-md self-start bg-neutral-800 px-2 py-1 text-neutral-50">
              哈囉！{currentUser?.userName}
            </p>
            <p className="font-paragraph-md w-full border-2 border-neutral-900 bg-neutral-50 p-3 text-neutral-900">
              你現在尚未加入任何照護群組！點擊「+」立即新增或建立照護群組吧！
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="font-label-md">立即新增或建立照護群組</p>
        <CircleButtonPrimary
          className="size-15 [&&_svg]:size-11 [&&_svg]:stroke-1"
          onClick={onActionClick}
        >
          <Plus />
        </CircleButtonPrimary>
      </div>
    </div>
  );
}

export default GroupEntryCard;
