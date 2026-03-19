import { Children, isValidElement } from 'react';
import type { ReactNode } from 'react';

import { ChevronDown } from 'lucide-react';

import { AvatarGroup } from '@/components/ui/avatar';
import cn from '@/lib/utils';

type DynamicUserGroupProps = {
  children: ReactNode;
  onArrowClick?: () => void;
};

function DynamicUserGroup({ children, onArrowClick }: DynamicUserGroupProps) {
  const childArray = Children.toArray(children).filter(isValidElement);
  const count = childArray.length;

  let spacingClass: string = '-space-x-2';
  if (count === 3) {
    spacingClass = '-space-x-3';
  } else if (count > 3) {
    spacingClass = '-space-x-4';
  }

  return (
    <div className="flex h-11 w-full max-w-25 items-center justify-between rounded-full bg-neutral-800 p-2">
      <AvatarGroup
        className={cn(
          'flex w-fit flex-row-reverse justify-end space-x-reverse',
          spacingClass,
        )}
      >
        {children}
      </AvatarGroup>
      <ChevronDown
        className="text-neutral-100"
        size={16}
        strokeWidth={2.5}
        onClick={onArrowClick}
      />
    </div>
  );
}

function UserGroup({
  children,
  onArrowClick,
}: {
  children?: ReactNode;
  onArrowClick?: () => void;
}) {
  return (
    <DynamicUserGroup onArrowClick={onArrowClick}>{children}</DynamicUserGroup>
  );
}

export default UserGroup;
