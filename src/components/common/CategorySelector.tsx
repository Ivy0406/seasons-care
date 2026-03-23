import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import cn from '@/lib/utils';

type Category = 'medication' | 'health' | 'hospital' | 'other';

const categories: { value: Category; label: string }[] = [
  { value: 'medication', label: '用藥紀錄' },
  { value: 'health', label: '健康紀錄' },
  { value: 'hospital', label: '醫院看診' },
  { value: 'other', label: '其他紀錄' },
];

interface CategorySelectorProps {
  defaultValue?: Category;
  value?: Category;
  onValueChange?: (value: Category) => void;
  className?: string;
}

function CategorySelector({
  defaultValue = 'medication',
  value: valueProp,
  onValueChange: onValueChangeProp,
  className,
}: CategorySelectorProps) {
  const [internalValue, setInternalValue] = useState<Category>(defaultValue);
  const isControlled = valueProp !== undefined;
  const selectedValue = isControlled ? valueProp : internalValue;

  const handleValueChange = (value: string | null) => {
    if (!value) return;
    const categoryVal = value as Category;
    if (!isControlled) {
      setInternalValue(categoryVal);
    }
    onValueChangeProp?.(categoryVal);
  };

  const activeCategory = categories.find((c) => c.value === selectedValue);

  return (
    <Select value={selectedValue} onValueChange={handleValueChange}>
      <SelectTrigger
        className={cn(
          'font-paragraph-md h-auto w-fit border-none bg-transparent p-0 shadow-none hover:bg-transparent focus-visible:ring-0',
          className,
        )}
      >
        {activeCategory?.label || '選擇類別'}
      </SelectTrigger>
      <SelectContent className="min-w-30 overflow-hidden rounded-[8px] border-2 border-neutral-900 bg-neutral-200">
        <div className="flex flex-col">
          {categories.map((cat, index) => (
            <div key={cat.value} className="w-full">
              <SelectItem
                value={cat.value}
                className="font-paragraph-md h-full cursor-pointer px-3 py-2 transition-colors focus:bg-neutral-300 data-selected:bg-neutral-300"
              >
                {cat.label}
              </SelectItem>
              {index < categories.length - 1 && (
                <div className="mx-0 h-px bg-neutral-400" />
              )}
            </div>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
}

export default CategorySelector;
