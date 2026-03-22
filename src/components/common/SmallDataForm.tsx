import type { ReactNode } from 'react';

import {
  ListFormDateTimeRow,
  ListFormImportantRow,
  ListFormInputRow,
  ListFormNoteRow,
  ListFormParticipantsRow,
  ListFormSelectRow,
} from '@/components/common/ListFormRows';
import cn from '@/lib/utils';

type BaseFormCardProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Base container for small data forms
 */
function BaseFormCard({ children, className }: BaseFormCardProps) {
  return (
    <div
      className={cn(
        'w-full max-w-md overflow-hidden rounded-[2rem] border-2 border-neutral-900 bg-neutral-100 p-6 shadow-sm',
        className,
      )}
    >
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

/**
 * Image 1: Health Metric Form
 */
export function HealthMetricSmallForm({ className }: { className?: string }) {
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
        unit="mg/dL"
        inputProps={{ defaultValue: '155' }}
        className="border-neutral-900"
      />
      <ListFormInputRow
        label="血壓 (舒張壓)"
        unit="mg/dL"
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

/**
 * Image 2: Journal Entry Form
 */
export function JournalEntrySmallForm({ className }: { className?: string }) {
  return (
    <BaseFormCard className={className}>
      <ListFormInputRow
        label="日誌名稱"
        inputProps={{ defaultValue: 'XXXXX' }}
        className="border-neutral-900"
      />
      <ListFormDateTimeRow
        label="時間"
        dateValue="2026/01/12"
        timeValue="10:00"
        className="border-neutral-900"
      />
      <ListFormSelectRow
        label="是否標示為重複"
        options={[{ value: 'daily', label: '每天' }]}
        className="border-neutral-900"
      />
      <ListFormParticipantsRow label="參與者" className="border-neutral-900" />
      <ListFormImportantRow
        label="是否標記為重要"
        checked
        onCheckedChange={() => {}}
        className="border-neutral-900"
      />
      <ListFormNoteRow
        label="備註"
        textareaProps={{ defaultValue: 'XXXXXXXXX' }}
        className="border-b-0"
      />
    </BaseFormCard>
  );
}

/**
 * Image 3: Accounting Form
 */
export function AccountingSmallForm({ className }: { className?: string }) {
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
        options={[{ value: 'none', label: '無' }]}
        className="border-neutral-900"
      />
      <ListFormImportantRow
        label="是否需分帳"
        checked={false}
        onCheckedChange={() => {}}
        className="border-neutral-900"
      />
      <ListFormNoteRow
        label="備註"
        textareaProps={{ placeholder: '' }}
        className="border-b-0"
      />
    </BaseFormCard>
  );
}
