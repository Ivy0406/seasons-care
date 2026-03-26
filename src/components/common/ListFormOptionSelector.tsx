import { useEffect, useId, useRef, useState } from 'react';

import chevronsUpDownIcon from '@/assets/icons/chevrons-up-down.svg';
import cn from '@/lib/utils';

type ListFormOptionSelectorOption<T extends string> = {
  label: string;
  value: T;
};

type ListFormOptionSelectorProps<T extends string> = {
  value: T;
  options: ListFormOptionSelectorOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
};

function ListFormOptionSelector<T extends string>({
  value,
  options,
  onChange,
  className,
  triggerClassName,
  menuClassName,
}: ListFormOptionSelectorProps<T>) {
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
    <div ref={rootRef} className={cn('relative min-w-0', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        className={cn(
          'font-paragraph-md inline-flex items-center justify-end gap-1 bg-transparent px-0 py-0 text-right font-bold text-neutral-600 outline-none',
          triggerClassName,
        )}
        onClick={() => setOpen((previous) => !previous)}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <span className="flex size-4 shrink-0 items-center justify-center">
          <img
            src={chevronsUpDownIcon}
            alt=""
            aria-hidden="true"
            className="h-3 w-3"
          />
        </span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className={cn(
            'absolute top-full right-0 z-20 mt-2 overflow-hidden rounded-[8px] border-2 border-neutral-900 bg-neutral-100 shadow-[0_4px_0_0_rgba(33,37,41,0.08)]',
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
                  'font-paragraph-md block w-full px-4 py-2 text-right whitespace-nowrap text-neutral-600',
                  isSelected
                    ? 'bg-neutral-200 font-bold text-neutral-900'
                    : 'hover:bg-neutral-200/70',
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
      ) : null}
    </div>
  );
}

export type { ListFormOptionSelectorOption };
export default ListFormOptionSelector;
