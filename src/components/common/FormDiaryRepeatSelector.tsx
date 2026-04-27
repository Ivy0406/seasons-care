import { parse } from 'date-fns';

import ListFormOptionSelector from '@/components/common/ListFormOptionSelector';

type FormDiaryRepeatValue = 'none' | 'daily' | 'weeklyDay' | 'monthly';

type FormDiaryRepeatSelectorProps = {
  value: FormDiaryRepeatValue;
  onChange: (value: FormDiaryRepeatValue) => void;
  selectedDateValue?: string;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
};

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as const;

const baseRepeatPatternOptions: {
  value: FormDiaryRepeatValue;
  label: string;
}[] = [
  { value: 'none', label: '無' },
  { value: 'daily', label: '每天' },
  { value: 'weeklyDay', label: '每週幾' },
  { value: 'monthly', label: '每月' },
];

function getWeeklyDayLabel(selectedDateValue?: string) {
  if (!selectedDateValue) return '每週幾';

  const normalizedDateValue = selectedDateValue.replaceAll('-', '/');
  const parsedDate = parse(normalizedDateValue, 'yyyy/MM/dd', new Date());

  if (Number.isNaN(parsedDate.getTime())) {
    return '每週幾';
  }

  return `每週${WEEKDAY_LABELS[parsedDate.getDay()]}`;
}

function FormDiaryRepeatSelector({
  value,
  onChange,
  selectedDateValue,
  className,
  triggerClassName,
  menuClassName,
}: FormDiaryRepeatSelectorProps) {
  const repeatPatternOptions = baseRepeatPatternOptions.map((option) =>
    option.value === 'weeklyDay'
      ? { ...option, label: getWeeklyDayLabel(selectedDateValue) }
      : option,
  );

  return (
    <ListFormOptionSelector
      value={value}
      options={repeatPatternOptions}
      onChange={onChange}
      className={className}
      triggerClassName={triggerClassName}
      menuClassName={menuClassName}
    />
  );
}

export type { FormDiaryRepeatValue };
export default FormDiaryRepeatSelector;
