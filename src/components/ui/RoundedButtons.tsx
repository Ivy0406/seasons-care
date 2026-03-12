import { Button } from '@/components/ui/button';

import ProBadge from './ProBadge';

function RoundedButtonPrimary({ children }: { children: React.ReactNode }) {
  return (
    <Button className="font-label-md h-[45.6px] w-full rounded-full bg-neutral-800 py-2 text-neutral-50">
      {children}
    </Button>
  );
}

function RoundedButtonSecondary({ children }: { children: React.ReactNode }) {
  return (
    <Button
      className="font-label-md h-[45.6px] w-full rounded-full border-2 border-neutral-900 py-2 text-neutral-900"
      variant="outline"
    >
      {children}
    </Button>
  );
}

function RoundedButtonDisabled({ children }: { children: React.ReactNode }) {
  return (
    <Button
      className="font-label-md h-[45.6px] w-full rounded-full bg-neutral-300 py-2 text-neutral-600"
      variant="ghost"
    >
      {children}
    </Button>
  );
}

function RoundedButtonPro({ children }: { children: React.ReactNode }) {
  return (
    <Button className="font-label-md bg-secondary-default h-[45.6px] w-full rounded-full border-2 border-neutral-900 py-2 text-neutral-900">
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
