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
};

function FilterDropdownButton<T extends string>({
  value,
  options,
  onChange,
  className,
  menuClassName,
}: FilterDropdownButtonProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const selectedOption = options.find((option) => option.value === value);

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
    <div ref={rootRef} className={cn('relative inline-flex w-fit', className)}>
      <button
        type="button"
        className={cn(
          'font-label-md inline-flex items-center justify-between gap-1 rounded-full border-2 border-neutral-900 bg-neutral-200 px-1.5 py-[3px] whitespace-nowrap text-neutral-800',
          'transition-colors active:bg-neutral-200',
        )}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((previous) => !previous)}
      >
        <span className="truncate pl-2">{selectedOption?.label}</span>
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
            'absolute top-full left-0 z-20 mt-1 overflow-hidden rounded-[4px] border-2 border-neutral-900 bg-neutral-200',
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
