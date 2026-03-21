import { useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import cn from '@/lib/utils';

type CircleButtonProps = Omit<React.ComponentProps<typeof Button>, 'size'> & {
  children: ReactNode;
  size?: 'sm' | 'md';
};

type CheckBoxButtonProps = CircleButtonProps & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  checkedClassName?: string;
  uncheckedClassName?: string;
};

type ButtonClickEvent = Parameters<
  NonNullable<React.ComponentProps<typeof Button>['onClick']>
>[0];

const baseCircleClass =
  'rounded-full p-0 flex-shrink-0 flex items-center justify-center transition-colors';

const sizeClassMap = {
  sm: 'h-6 w-6 [&&_svg]:size-2 [&&_svg]:stroke-[5]',
  md: 'h-10 w-10 [&&_svg]:size-6 [&&_svg]:stroke-[2]',
};

// 1. Primary ：黑邊框、深色底
function CircleButtonPrimary({
  children,
  className,
  size = 'md',
  ...props
}: CircleButtonProps) {
  return (
    <Button
      className={cn(
        baseCircleClass,
        'border-2 border-neutral-900 bg-neutral-800 text-neutral-50 active:bg-neutral-700',
        sizeClassMap[size],
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

// 2. Secondary ：黑邊框、淺色底
function CircleButtonSecondary({
  children,
  className,
  size = 'md',
  ...props
}: CircleButtonProps) {
  return (
    <Button
      className={cn(
        baseCircleClass,
        'border-2 border-neutral-900 bg-neutral-50 text-neutral-900 active:bg-neutral-200',
        sizeClassMap[size],
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

// 3. CheckBoxButton：沒邊框、點擊切換綠色/灰色
function CheckBoxButton({
  children,
  className,
  size = 'md',
  checked,
  defaultChecked = false,
  onCheckedChange,
  checkedClassName,
  uncheckedClassName,
  ...props
}: CheckBoxButtonProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleToggle = (e: ButtonClickEvent) => {
    const newState = !isChecked;

    if (!isControlled) {
      setInternalChecked(newState);
    }

    onCheckedChange?.(newState);
    props.onClick?.(e);
  };

  return (
    <Button
      {...props}
      onClick={handleToggle}
      aria-pressed={isChecked}
      className={cn(
        baseCircleClass,
        sizeClassMap[size],
        isChecked
          ? (checkedClassName ?? 'bg-primary-default text-neutral-50')
          : (uncheckedClassName ?? 'bg-neutral-400 text-white'),
        className,
      )}
    >
      {children}
    </Button>
  );
}

export { CircleButtonPrimary, CircleButtonSecondary, CheckBoxButton };
