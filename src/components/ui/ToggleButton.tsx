import cn from '@/lib/utils';

import Switch from './switch';

type ToggleButtonProps = {
  thumbClassName?: string;
  className?: string;
  size?: 'sm' | 'default';
};

function ToggleButton({
  thumbClassName,
  className,
  size,
  ...props
}: ToggleButtonProps & React.ComponentProps<typeof Switch>) {
  return (
    <Switch
      {...props}
      className={cn(
        `py-0.5 data-checked:bg-neutral-800 data-unchecked:border data-unchecked:border-neutral-800 data-unchecked:bg-neutral-50 data-[size=default]:h-5 data-[size=default]:w-10.5`,
        className,
      )}
      thumbClassName={cn(
        `data-unchecked:bg-neutral-800 data-checked:bg-neutral-50 data-[size=default]:size-4 data-unchecked:translate-x-0.5! data-checked: translate-x-[23px]!`,
        thumbClassName,
      )}
      size={size}
    />
  );
}

export default ToggleButton;
