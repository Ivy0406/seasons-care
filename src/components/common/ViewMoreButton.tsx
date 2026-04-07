import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import cn from '@/lib/utils';

type ViewMoreButtonProps = {
  label?: string;
  className?: string;
  onClick?: () => void;
};

export default function ViewMoreButton({
  label = '查看更多',
  className,
  onClick,
}: ViewMoreButtonProps) {
  return (
    <Button
      type="button"
      className={cn(
        'font-label-md h-12 w-36.25 rounded-full border-2 border-neutral-50 bg-neutral-800 px-6 text-neutral-50 active:bg-neutral-900',
        className,
      )}
      onClick={onClick}
    >
      {label}
      <ChevronRight className="ml-1 size-4" />
    </Button>
  );
}
