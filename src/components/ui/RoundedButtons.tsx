import { Button } from '@/components/ui/button';

import ProBadge from './ProBadge';

type RoundedButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

function RoundedButtonPrimary({ children, onClick }: RoundedButtonProps) {
  return (
    <Button
      className="font-label-md h-[45.6px] w-full rounded-full bg-neutral-800 py-2 text-neutral-50 active:bg-neutral-900"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function RoundedButtonSecondary({ children, onClick }: RoundedButtonProps) {
  return (
    <Button
      className="font-label-md h-[45.6px] w-full rounded-full border-2 border-neutral-900 py-2 text-neutral-900 active:bg-neutral-200"
      variant="outline"
      onClick={onClick}
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

function RoundedButtonPro({ children, onClick }: RoundedButtonProps) {
  return (
    <Button
      className="font-label-md bg-secondary-default active:bg-secondary-dark h-[45.6px] w-full rounded-full border-2 border-neutral-900 py-2 text-neutral-900"
      onClick={onClick}
    >
      <ProBadge />
      {children}
    </Button>
  );
}

export {
  RoundedButtonPrimary,
  RoundedButtonSecondary,
  RoundedButtonDisabled,
  RoundedButtonPro,
};
