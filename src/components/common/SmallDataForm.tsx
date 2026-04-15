import {
  ListFormDateTimeRow,
  ListFormImportantRow,
  ListFormInputRow,
  ListFormNoteRow,
  ListFormParticipantsRow,
  ListFormRepeatRow,
  ListFormSelectRow,
  type RepeatPatternValue,
} from '@/components/common/ListFormRows';
import type { HealthDraft } from '@/features/health/types';
import type { MoneyCategoryValue, MoneyDraft } from '@/features/money/types';
import cn from '@/lib/utils';
import type { DiaryDraft } from '@/pages/CareLog/types';

import type { UseFormRegister } from 'react-hook-form';

type BaseFormCardProps = {
  children: React.ReactNode;
  className?: string;
};

function BaseFormCard({ children, className }: BaseFormCardProps) {
  return (
    <div
      className={cn(
        'h-fit w-full rounded-lg border-2 border-neutral-900 bg-neutral-100 p-4',
        className,
      )}
    >
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

type HealthDataSmallFormProps = {
  className?: string;
  value: HealthDraft;
  onChange: (updates: Partial<HealthDraft>) => void;
};

function HealthDataSmallForm({
  className,
  value,
  onChange,
}: HealthDataSmallFormProps) {
  return (
    <BaseFormCard className={className}>
      <ListFormDateTimeRow
        label="時間"
        dateValue={value.dateValue}
        timeValue={value.timeValue}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="血壓 (收縮壓)"
        unit="mmHg"
        inputProps={{
          value: value.systolic,
          inputMode: 'numeric',
          onChange: (event) => onChange({ systolic: event.target.value }),
        }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="血壓 (舒張壓)"
        unit="mmHg"
        inputProps={{
          value: value.diastolic,
          inputMode: 'numeric',
          onChange: (event) => onChange({ diastolic: event.target.value }),
        }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="體溫"
        unit="°C"
        inputProps={{
          value: value.temperature,
          inputMode: 'decimal',
          onChange: (event) => onChange({ temperature: event.target.value }),
        }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="血氧"
        unit="%"
        inputProps={{
          value: value.bloodOxygen,
          inputMode: 'numeric',
          onChange: (event) => onChange({ bloodOxygen: event.target.value }),
        }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="體重"
        unit="kg"
        inputProps={{
          value: value.weight,
          inputMode: 'decimal',
          onChange: (event) => onChange({ weight: event.target.value }),
        }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="血糖"
        unit="mg/dL"
        inputProps={{
          value: value.bloodSugar,
          inputMode: 'numeric',
          onChange: (event) => onChange({ bloodSugar: event.target.value }),
        }}
        className="border-b-0"
      />
    </BaseFormCard>
  );
}

type JournalDataSmallFormProps = {
  className?: string;
  value: DiaryDraft;
  onChange: (updates: Partial<DiaryDraft>) => void;
};

type HealthDataFormField =
  | 'systolic'
  | 'diastolic'
  | 'temperature'
  | 'spO2'
  | 'weight'
  | 'glucoseLevel';

type HealthDataFormProps = {
  className?: string;
  register?: UseFormRegister<Record<HealthDataFormField, string>>;
  recordDate?: string;
  recordTime?: string;
  onDateChange?: (value: string) => void;
  onTimeChange?: (value: string) => void;
  onDateClick?: () => void;
  onTimeClick?: () => void;
};

function HealthDataForm({
  className,
  register,
  recordDate = '',
  recordTime = '',
  onDateChange,
  onTimeChange,
  onDateClick,
  onTimeClick,
}: HealthDataFormProps) {
  return (
    <BaseFormCard className={className}>
      <ListFormDateTimeRow
        label="時間"
        dateValue={recordDate}
        timeValue={recordTime}
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
        onDateClick={onDateClick}
        onTimeClick={onTimeClick}
        className="border-neutral-900"
      />
      <p className="font-paragraph-sm pt-5 text-neutral-600">
        以下至少填寫一項數值
      </p>
      <ListFormInputRow
        label="血壓 (收縮壓)"
        unit="mmHg"
        inputProps={{
          type: 'number',
          step: 'any',
          placeholder: '—',
          ...register?.('systolic'),
        }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="血壓 (舒張壓)"
        unit="mmHg"
        inputProps={{
          type: 'number',
          step: 'any',
          placeholder: '—',
          ...register?.('diastolic'),
        }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="體溫"
        unit="°C"
        inputProps={{
          type: 'number',
          step: 'any',
          placeholder: '—',
          ...register?.('temperature'),
        }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="血氧"
        unit="%"
        inputProps={{
          type: 'number',
          step: 'any',
          placeholder: '—',
          ...register?.('spO2'),
        }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="體重"
        unit="kg"
        inputProps={{
          type: 'number',
          step: 'any',
          placeholder: '—',
          ...register?.('weight'),
        }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="血糖"
        unit="mg/dL"
        inputProps={{
          type: 'number',
          step: 'any',
          placeholder: '—',
          ...register?.('glucoseLevel'),
        }}
        className="border-b-0"
      />
    </BaseFormCard>
  );
}

function JournalDataSmallForm({
  className,
  value,
  onChange,
}: JournalDataSmallFormProps) {
  return (
    <BaseFormCard className={className}>
      <ListFormInputRow
        label="日誌名稱"
        inputProps={{
          value: value.title,
          onChange: (event) => onChange({ title: event.target.value }),
        }}
        className="border-neutral-900"
      />
      <ListFormDateTimeRow
        label="時間"
        dateValue={value.dateValue}
        timeValue={value.timeValue}
        className="border-neutral-900"
      />
      <ListFormRepeatRow
        value={value.repeatPattern as RepeatPatternValue}
        onChange={(repeatPattern) => onChange({ repeatPattern })}
        className="border-neutral-900"
      />
      <ListFormParticipantsRow label="參與者" className="border-neutral-900" />
      <ListFormImportantRow
        label="是否標記為重要"
        checked={value.isImportant}
        onCheckedChange={(isImportant) => onChange({ isImportant })}
        className="border-neutral-900"
      />
      <ListFormNoteRow
        label="備註"
        textareaProps={{
          value: value.note,
          onChange: (event) => onChange({ note: event.target.value }),
        }}
        onClear={() => onChange({ note: '' })}
        className="border-b-0"
      />
    </BaseFormCard>
  );
}

type MoneyDataSmallFormProps = {
  className?: string;
  value: MoneyDraft;
  onChange: (updates: Partial<MoneyDraft>) => void;
};

function MoneyDataSmallForm({
  className,
  value,
  onChange,
}: MoneyDataSmallFormProps) {
  return (
    <BaseFormCard className={className}>
      <ListFormInputRow
        label="帳目名稱"
        inputProps={{
          value: value.title,
          onChange: (event) => onChange({ title: event.target.value }),
        }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="金額"
        inputProps={{
          value: value.amount,
          inputMode: 'numeric',
          onChange: (event) => onChange({ amount: event.target.value }),
        }}
        className="border-neutral-900"
      />
      <ListFormDateTimeRow
        label="時間"
        dateValue={value.dateValue}
        timeValue={value.timeValue}
        onDateChange={(dateValue) => onChange({ dateValue })}
        onTimeChange={(timeValue) => onChange({ timeValue })}
        className="border-neutral-900"
      />
      <ListFormSelectRow
        label="類別"
        value={value.category ?? ''}
        placeholder="請選擇類別"
        options={[
          { value: 'medical', label: '醫療支出' },
          { value: 'food', label: '飲食支出' },
          { value: 'traffic', label: '交通費用' },
          { value: 'other', label: '生活雜支' },
        ]}
        onChange={(category) =>
          onChange({ category: category as MoneyCategoryValue })
        }
        className="border-neutral-900"
      />
      <ListFormImportantRow
        label="是否需分帳"
        checked={value.needsSplit}
        onCheckedChange={(needsSplit) => onChange({ needsSplit })}
        className="border-neutral-900"
      />
      <ListFormNoteRow
        label="備註"
        textareaProps={{
          value: value.notes,
          onChange: (event) => onChange({ notes: event.target.value }),
          placeholder: '',
        }}
        onClear={() => onChange({ notes: '' })}
        className="border-b-0"
      />
    </BaseFormCard>
  );
}

export {
  HealthDataForm,
  HealthDataSmallForm,
  JournalDataSmallForm,
  MoneyDataSmallForm,
};
