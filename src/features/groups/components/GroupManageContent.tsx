import { Check, Ellipsis } from 'lucide-react';

import cn from '@/lib/utils';
import type { CareGroupInfo } from '@/types/group';

type GroupManageContentProps = {
  group: CareGroupInfo;
  isSelected: boolean;
  onSelect: () => void;
  onManage: () => void;
  showManageButton?: boolean;
};

function GroupManageContent({
  group,
  isSelected,
  onSelect,
  onManage,
  showManageButton = true,
}: GroupManageContentProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        'flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-2 transition-colors focus-visible:outline-none',
        isSelected ? 'bg-neutral-400' : 'bg-neutral-300',
      )}
    >
      <div className="flex min-w-0 flex-col">
        <p className="font-label-md py-0.5">{group.name}</p>
        <p
          className={cn(
            'font-paragraph-sm',
            isSelected ? 'text-neutral-900' : 'text-neutral-700',
          )}
        >
          {group.memberCount} 位成員
        </p>
      </div>
      <div className="flex items-center gap-3">
        {isSelected ? (
          <span
            aria-hidden="true"
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-neutral-50 [&_svg]:size-2 [&_svg]:stroke-[5]"
          >
            <Check />
          </span>
        ) : null}
        {showManageButton ? (
          <button
            type="button"
            aria-label={`管理${group.name}`}
            onClick={(event) => {
              event.stopPropagation();
              onManage();
            }}
            className="inline-flex size-8 items-center justify-center text-neutral-900"
          >
            <Ellipsis />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default GroupManageContent;
