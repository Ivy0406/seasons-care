import cn from '@/lib/utils';

function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'size-5 animate-spin rounded-full border-2 border-current border-t-transparent',
        className,
      )}
      aria-label="載入中"
    />
  );
}

export default Spinner;
