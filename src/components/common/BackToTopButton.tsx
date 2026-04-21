import { ChevronUp } from 'lucide-react';

import { CircleButtonPrimary } from '@/components/common/CircleIButton';
import cn from '@/lib/utils';

type BackToTopButtonProps = {
  onClick: () => void;
  className?: string;
  variant?: 'dark' | 'light';
};

function BackToTopButton({
  onClick,
  className,
  variant = 'dark',
}: BackToTopButtonProps) {
  const isLight = variant === 'light';

  return (
    <CircleButtonPrimary
      onClick={onClick}
      className={cn(
        'size-10 border-2 border-neutral-900 transition-transform active:scale-95',
        isLight ? 'bg-neutral-100' : 'bg-neutral-800',
        className,
      )}
    >
      <ChevronUp
        className={cn(
          'size-6',
          isLight ? 'text-neutral-900' : 'text-neutral-50',
        )}
      />
    </CircleButtonPrimary>
  );
}

export default BackToTopButton;
