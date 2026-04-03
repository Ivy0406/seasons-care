import { useState } from 'react';

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
import cn from '@/lib/utils';

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

function HealthDataSmallForm({ className }: { className?: string }) {
  return (
    <BaseFormCard className={className}>
      <ListFormDateTimeRow
        label="時間"
        dateValue="2026/01/12"
        timeValue="10:00"
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="血壓 (收縮壓)"
        unit="mmHg"
        inputProps={{ defaultValue: '155' }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="血壓 (舒張壓)"
        unit="mmHg"
        inputProps={{ defaultValue: '92' }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="體溫"
        unit="°C"
        inputProps={{ defaultValue: '34.5' }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="血氧"
        unit="%"
        inputProps={{ defaultValue: '98' }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="體重"
        unit="kg"
        inputProps={{ defaultValue: '70' }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="血糖"
        unit="mg/dL"
        inputProps={{ defaultValue: '155' }}
        className="border-b-0"
      />
    </BaseFormCard>
  );
}

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
  onDateClick?: () => void;
  onTimeClick?: () => void;
};

function HealthDataForm({
  className,
  register,
  recordDate = '',
  recordTime = '',
  onDateClick,
  onTimeClick,
}: HealthDataFormProps) {
  return (
    <BaseFormCard className={className}>
      <ListFormDateTimeRow
        label="時間"
        dateValue={recordDate}
        timeValue={recordTime}
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

function JournalDataSmallForm({ className }: { className?: string }) {
  const [repeatPattern, setRepeatPattern] =
    useState<RepeatPatternValue>('none');
  const [isImportant, setIsImportant] = useState(true);
  const [note, setNote] = useState('');

  return (
    <BaseFormCard className={className}>
      <ListFormInputRow
        label="日誌名稱"
        inputProps={{ defaultValue: '' }}
        className="border-neutral-900"
      />
      <ListFormDateTimeRow
        label="時間"
        dateValue="2026/01/12"
        timeValue="10:00"
        className="border-neutral-900"
      />
      <ListFormRepeatRow
        value={repeatPattern}
        onChange={setRepeatPattern}
        className="border-neutral-900"
      />
      <ListFormParticipantsRow label="參與者" className="border-neutral-900" />
      <ListFormImportantRow
        label="是否標記為重要"
        checked={isImportant}
        onCheckedChange={setIsImportant}
        className="border-neutral-900"
      />
      <ListFormNoteRow
        label="備註"
        textareaProps={{
          value: note,
          onChange: (e) => setNote(e.target.value),
        }}
        onClear={() => setNote('')}
        className="border-b-0"
      />
    </BaseFormCard>
  );
}

function MoneyDataSmallForm({ className }: { className?: string }) {
  const [category, setCategory] = useState('none');
  const [needsSplit, setNeedsSplit] = useState(false);
  const [note, setNote] = useState('');

  return (
    <BaseFormCard className={className}>
      <ListFormInputRow
        label="帳目名稱"
        inputProps={{ placeholder: '' }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="金額"
        inputProps={{ placeholder: '', type: 'number' }}
        className="border-neutral-900"
      />
      <ListFormDateTimeRow
        label="時間"
        dateValue="2026/01/12"
        timeValue="10:00"
        className="border-neutral-900"
      />
      <ListFormSelectRow
        label="類別"
        value={category}
        options={[
          { value: 'none', label: '無' },
          { value: 'medical', label: '醫療支出' },
          { value: 'food', label: '飲食支出' },
          { value: 'traffic', label: '交通費用' },
          { value: 'other', label: '生活支出' },
        ]}
        onChange={setCategory}
        className="border-neutral-900"
      />
      <ListFormImportantRow
        label="是否需分帳"
        checked={needsSplit}
        onCheckedChange={setNeedsSplit}
        className="border-neutral-900"
      />
      <ListFormNoteRow
        label="備註"
        textareaProps={{
          value: note,
          onChange: (e) => setNote(e.target.value),
          placeholder: '',
        }}
        onClear={() => setNote('')}
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
