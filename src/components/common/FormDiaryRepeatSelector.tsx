import ListFormOptionSelector from '@/components/common/ListFormOptionSelector';

type FormDiaryRepeatValue = 'none' | 'daily' | 'weeklyDay' | 'monthly';

type FormDiaryRepeatSelectorProps = {
  value: FormDiaryRepeatValue;
  onChange: (value: FormDiaryRepeatValue) => void;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
};

const repeatPatternOptions: { value: FormDiaryRepeatValue; label: string }[] = [
  { value: 'none', label: '無' },
  { value: 'daily', label: '每天' },
  { value: 'weeklyDay', label: '每週幾' },
  { value: 'monthly', label: '每月' },
];

function FormDiaryRepeatSelector({
  value,
  onChange,
  className,
  triggerClassName,
  menuClassName,
}: FormDiaryRepeatSelectorProps) {
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
