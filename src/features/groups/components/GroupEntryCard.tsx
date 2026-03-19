import type { HTMLAttributes } from 'react';

import { Plus } from 'lucide-react';

import { CircleButtonPrimary } from '@/components/common/CircleIButton';
import cn from '@/lib/utils';

type GroupEntryCardProps = HTMLAttributes<HTMLDivElement> & {
  onActionClick?: () => void;
};

function GroupEntryCard({
  className,
  onActionClick,
  ...props
}: GroupEntryCardProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-5 rounded-[8px] border-2 border-neutral-900 bg-neutral-400 py-36 text-neutral-900',
        className,
      )}
      {...props}
    >
      <CircleButtonPrimary size="md" onClick={onActionClick}>
        <Plus />
      </CircleButtonPrimary>
      <p className="font-label-md">立即新增或建立照護群組</p>
    </div>
  );
}

export default GroupEntryCard;
