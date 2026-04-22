import { Button } from '@/components/ui/button';
import cn from '@/lib/utils';

import NewBadge from './NewBadge';

type RoundedButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit';
  disabled?: boolean;
};

function RoundedButtonPrimary({
  children,
  onClick,
  className,
  type,
  disabled,
}: RoundedButtonProps) {
  return (
    <Button
      type={type}
      className={cn(
        'font-label-md h-[45.6px] w-full rounded-full bg-neutral-800 py-2 text-neutral-50 active:bg-neutral-900 disabled:bg-neutral-300 disabled:text-neutral-600 disabled:opacity-100',
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

function RoundedButtonSecondary({
  children,
  onClick,
  className,
  type,
  disabled,
}: RoundedButtonProps) {
  return (
    <Button
      type={type}
      className={cn(
        'font-label-md h-[45.6px] w-full rounded-full border-2 border-neutral-900 py-2 text-neutral-900 active:bg-neutral-200',
        className,
      )}
      variant="outline"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

function RoundedButtonDisabled({
  children,
}: Omit<RoundedButtonProps, 'onClick'>) {
  return (
    <Button
      className="font-label-md h-[45.6px] w-full rounded-full bg-neutral-300 py-2 text-neutral-600 disabled:opacity-100"
      variant="ghost"
      disabled
    >
      {children}
    </Button>
  );
}

function RoundedButtonNew({
  children,
  onClick,
  className,
  type,
  disabled,
}: RoundedButtonProps) {
  return (
    <Button
      type={type}
      className={cn(
        'font-label-md bg-secondary-default active:bg-secondary-dark h-[45.6px] w-full rounded-full border-2 border-neutral-900 py-2 text-neutral-900',
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <NewBadge />
      {children}
    </Button>
  );
}

export {
  RoundedButtonPrimary,
  RoundedButtonSecondary,
  RoundedButtonDisabled,
  RoundedButtonNew,
};
