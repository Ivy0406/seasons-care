import { Children, isValidElement } from 'react';
import type { ReactNode } from 'react';

import { ChevronDown } from 'lucide-react';

import { AvatarGroup } from '@/components/ui/avatar';
import cn from '@/lib/utils';

type DynamicUserGroupProps = {
  children: ReactNode;
  onClick?: () => void;
  onArrowClick?: () => void;
  showArrow?: boolean;
  className?: string;
};

function DynamicUserGroup({
  children,
  onClick,
  onArrowClick,
  showArrow = true,
  className,
}: DynamicUserGroupProps) {
  const childArray = Children.toArray(children).filter(isValidElement);
  const count = childArray.length;
  const WrapperTag = onClick ? 'button' : 'div';

  let spacingClass: string = '-space-x-2';
  if (count === 3) {
    spacingClass = '-space-x-3';
  } else if (count > 3) {
    spacingClass = '-space-x-4';
  }

  return (
    <WrapperTag
      type={onClick ? 'button' : undefined}
      className={cn(
        'flex h-11 w-full max-w-25 items-center justify-between rounded-full bg-neutral-800 p-2',
        onClick && 'cursor-pointer',
        onClick && 'appearance-none border-0 text-left',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      <AvatarGroup
        className={cn(
          'flex w-fit flex-row-reverse justify-end space-x-reverse',
          spacingClass,
        )}
      >
        {children}
      </AvatarGroup>
      {showArrow ? (
        <ChevronDown
          className="text-neutral-100"
          size={16}
          strokeWidth={2.5}
          onClick={(event) => {
            event.stopPropagation();
            (onArrowClick ?? onClick)?.();
          }}
        />
      ) : null}
    </WrapperTag>
  );
}

function UserGroup({
  children,
  onClick,
  onArrowClick,
  showArrow = true,
  className,
}: {
  children?: ReactNode;
  onClick?: () => void;
  onArrowClick?: () => void;
  showArrow?: boolean;
  className?: string;
}) {
  return (
    <DynamicUserGroup
      onClick={onClick}
      onArrowClick={onArrowClick}
      showArrow={showArrow}
      className={className}
    >
      {children}
    </DynamicUserGroup>
  );
}

export default UserGroup;
