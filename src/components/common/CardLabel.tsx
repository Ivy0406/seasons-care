import cn from '@/lib/utils';

type CardLabelProps = {
  children: React.ReactNode;
  className?: string;
};

function CardLabelSecondary({ children, className }: CardLabelProps) {
  return (
    <div
      className={cn(
        'bg-secondary-default flex h-[29px] w-fit items-center justify-center px-2 py-1',
        className,
      )}
    >
      <p className={cn('font-label-sm text-neutral-900', className)}>
        {children}
      </p>
    </div>
  );
}

function CardLabelPrimary({ children, className }: CardLabelProps) {
  return (
    <div
      className={cn(
        'bg-primary-default flex h-7.25 w-fit min-w-12.25 items-center justify-center px-2 py-1',
        className,
      )}
    >
      <p className={cn('font-label-sm', className)}>{children}</p>
    </div>
  );
}

function CardLabelNeutral({ children, className }: CardLabelProps) {
  return (
    <div
      className={cn(
        'flex h-[29px] w-fit items-center justify-center bg-neutral-800 px-2 py-1',
        className,
      )}
    >
      <p className={cn('font-label-sm text-neutral-50', className)}>
        {children}
      </p>
    </div>
  );
}

export { CardLabelPrimary, CardLabelSecondary, CardLabelNeutral };
