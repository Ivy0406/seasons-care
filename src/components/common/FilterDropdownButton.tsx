import { useEffect, useId, useRef, useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

import cn from '@/lib/utils';

type FilterOption<T extends string> = {
  label: string;
  value: T;
};

type FilterDropdownButtonProps<T extends string> = {
  value: T;
  options: FilterOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  menuClassName?: string;
  buttonClassName?: string;
};

function FilterDropdownButton<T extends string>({
  value,
  options,
  onChange,
  className,
  menuClassName,
  buttonClassName,
}: FilterDropdownButtonProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const selectedOption = options.find((option) => option.value === value);
  const widestOptionLabel = options.reduce(
    (widest, option) =>
      option.label.length > widest.length ? option.label : widest,
    selectedOption?.label ?? '',
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn('relative inline-flex w-fit max-w-full', className)}
    >
      <button
        type="button"
        className={cn(
          'font-label-md relative inline-grid max-w-full grid-cols-[minmax(0,1fr)_auto] items-center justify-between rounded-full border-2 border-neutral-900 bg-neutral-200 px-1.5 py-0.75 whitespace-nowrap text-neutral-800',
          'transition-colors active:bg-neutral-200',
          buttonClassName,
        )}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((previous) => !previous)}
      >
        <span className="invisible pl-2">{widestOptionLabel}</span>
        <span className="pointer-events-none absolute inset-y-0 right-5 left-0 flex items-center justify-center px-3 text-center">
          {selectedOption?.label}
        </span>
        <div className="flex size-4 shrink-0 items-center justify-center">
          {open ? (
            <ChevronUp className="size-2 text-neutral-800" strokeWidth={5} />
          ) : (
            <ChevronDown className="size-2 text-neutral-800" strokeWidth={5} />
          )}
        </div>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className={cn(
            'absolute top-full right-0 z-20 mt-1 max-h-48 min-w-full overflow-y-auto rounded-sm border-2 border-neutral-900 bg-neutral-200',
            menuClassName,
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                className={cn(
                  'font-label-md block w-full px-5 py-1.5 text-left whitespace-nowrap text-neutral-600',
                  isSelected ? 'text-neutral-800' : 'hover:bg-neutral-100',
                )}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export type { FilterOption };
export default FilterDropdownButton;
