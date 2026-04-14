import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { format, getDaysInMonth, parse } from 'date-fns';

import FormDiaryRepeatSelector, {
  type FormDiaryRepeatValue,
} from '@/components/common/FormDiaryRepeatSelector';
import InputClearButton from '@/components/common/InputClearButton';
import ListFormOptionSelector from '@/components/common/ListFormOptionSelector';
import ScrollableDatePicker from '@/components/common/ScrollableDatePicker';
import SingleAvatar from '@/components/common/SingleAvatar';
import ToggleButton from '@/components/common/ToggleButton';
import Input from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import cn from '@/lib/utils';

type ListFormRowProps = {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};

type ListFormTextRowProps = {
  label: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  className?: string;
};

type ListFormGenderRowProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
};

type ListFormBirthDateRowProps = {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  className?: string;
};

type ListFormParticipantsRowProps = {
  label: string;
  className?: string;
};

type ListFormImportantRowProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
};

type ListFormNoteRowProps = {
  label: string;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
  onClear?: () => void;
  className?: string;
};

type ListFormInputRowProps = {
  label: string;
  unit?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  className?: string;
};

type ListFormSelectRowProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

type RepeatPatternValue = FormDiaryRepeatValue;

type ListFormRepeatRowProps = {
  value: RepeatPatternValue;
  onChange: (value: RepeatPatternValue) => void;
  className?: string;
};

type ListFormDateTimeRowProps = {
  label: string;
  dateValue: string;
  timeValue: string;
  onDateChange?: (value: string) => void;
  onTimeChange?: (value: string) => void;
  onDateClick?: () => void;
  onTimeClick?: () => void;
  className?: string;
};

function parseDateValue(value: string) {
  const parsedDate = parse(value, 'yyyy/MM/dd', new Date());

  return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
}

function parseTimeValue(value: string) {
  const [rawHour = '09', rawMinute = '00'] = value.split(':');
  const hour24 = Number(rawHour);
  const minute = Number(rawMinute);

  if (
    Number.isNaN(hour24) ||
    Number.isNaN(minute) ||
    hour24 < 0 ||
    hour24 > 23
  ) {
    return {
      period: '上午' as const,
      hour12: 9,
      minute: 0,
    };
  }

  return {
    period: hour24 < 12 ? ('上午' as const) : ('下午' as const),
    hour12: hour24 % 12 === 0 ? 12 : hour24 % 12,
    minute,
  };
}

function to24HourTime(period: '上午' | '下午', hour12: number, minute: number) {
  const normalizedHour = hour12 % 12;
  const hour24 = period === '下午' ? normalizedHour + 12 : normalizedHour;

  return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function formatDateValue(date: Date) {
  return format(date, 'yyyy/MM/dd');
}

function updateDateSegment(
  currentDate: Date | undefined,
  segment: 'year' | 'month' | 'day',
  value: number,
) {
  const baseDate = currentDate ?? new Date();
  const nextDate = new Date(baseDate);

  if (segment === 'year') {
    nextDate.setFullYear(value);
  }

  if (segment === 'month') {
    nextDate.setMonth(value - 1);
  }

  const maxDay = getDaysInMonth(nextDate);

  if (segment === 'day') {
    nextDate.setDate(Math.min(value, maxDay));
    return nextDate;
  }

  nextDate.setDate(Math.min(baseDate.getDate(), maxDay));
  return nextDate;
}

function ListFormRow({
  label,
  htmlFor,
  children,
  className,
}: ListFormRowProps) {
  const LabelTag = htmlFor ? 'label' : 'div';

  return (
    <div
      className={cn(
        'flex min-h-12 items-center gap-4 border-b border-neutral-900',
        className,
      )}
    >
      <LabelTag
        {...(htmlFor ? { htmlFor } : {})}
        className="font-label-md shrink-0 text-neutral-900"
      >
        {label}
      </LabelTag>
      <div className="flex min-w-0 flex-1 items-center justify-end">
        {children}
      </div>
    </div>
  );
}

function ListFormNameRow({
  label,
  inputProps,
  className,
}: ListFormTextRowProps) {
  const fallbackId = useId();
  const htmlFor = inputProps?.id ?? inputProps?.name ?? fallbackId;

  return (
    <ListFormRow label={label} htmlFor={htmlFor} className={className}>
      <Input
        placeholder="輸入名稱"
        className="font-paragraph-md h-auto border-0 bg-transparent px-0 py-0 pr-4 text-right text-neutral-900 shadow-none placeholder:text-neutral-600 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        id={htmlFor}
        {...inputProps}
      />
    </ListFormRow>
  );
}

function ListFormGenderRow({
  label,
  value,
  options,
  onChange,
  className,
}: ListFormGenderRowProps) {
  return (
    <ListFormRow label={label} className={className}>
      <div className="relative min-w-0">
        <ListFormOptionSelector
          value={value}
          options={options}
          onChange={onChange}
        />
      </div>
    </ListFormRow>
  );
}

function ListFormBirthDateRow({
  label,
  value,
  onChange,
  className,
}: ListFormBirthDateRowProps) {
  return (
    <ListFormRow label={label} className={cn('border-b-0', className)}>
      <ScrollableDatePicker value={value} onChange={onChange} />
    </ListFormRow>
  );
}

function ListFormParticipantsRow({
  label,
  className,
}: ListFormParticipantsRowProps) {
  return (
    <ListFormRow label={label} className={className}>
      <div className="flex items-center justify-end gap-2">
        <SingleAvatar
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqrpYjz-y8bMs_qvQFR_w4vW_HEUAsQwzgMSbzLMJFytcdMUrY4M25Jx7EjoGDbvSIRaagzEacgR2hIhCLy39aMqWGH9cR-MQ3LjZzljWWCoDjzgU2y7G9nisZk47dRYesEYrG9Bg79XhA/s400/nigaoe_nakajima_atsushi.png"
          name="Amy"
          className="size-7 ring-1"
        />
        <SingleAvatar
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipUJt5ufuYdkpMS8MbIkWE_zDCxYe3inh3TTB7DVH37W_z8zPS_IU1-2J074kzv0wpHwLbe-pGVyxleTDTORHHUUWZmwkJJKxC4xIrwONn1eslfC_2_gzKACafQwFZjG1NelxBcpzZoTde/s400/nigaoe_masaoka_shiki.png"
          name="Ben"
          className="size-7 ring-1"
        />
        <SingleAvatar
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjl69uVfqLnrYRJTq45_yeYNwVdGPDOg6qFgbZz9pp7P83ki1MYzMreZG6YLR12gF89m6dpSppmJesyF4gNG_X6EWyLliOqcejs7ZFYZm-gy7WKvty5G0gaYp8egXBL3HfjrNZJUL2f9SXU/s400/nigaoe_tekla_badarzewska.png"
          name="Chloe"
          className="size-7 ring-1"
        />
        <SingleAvatar
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgoTl4DxRR5CVuFrHVzaA1D7FpTp_W0jmAQzf89GfkAYaAJL-CipobWEhm-QwSrw9BW01kTyx2tVHChs-3KjZqKCIkjfl7mivcChR4bhFe4Ek22AV7zsCv_0aV19_G-wCfZOS_NYsKTBO0/s400/13_Mussorgsky.png"
          name="David"
          className="size-7 ring-1"
        />
      </div>
    </ListFormRow>
  );
}

function ListFormImportantRow({
  label,
  checked,
  onCheckedChange,
  className,
}: ListFormImportantRowProps) {
  return (
    <ListFormRow label={label} className={className}>
      <ToggleButton
        checked={checked}
        onCheckedChange={onCheckedChange}
        size="default"
      />
    </ListFormRow>
  );
}

function ListFormNoteRow({
  label,
  textareaProps,
  onClear,
  className,
}: ListFormNoteRowProps) {
  const fallbackId = useId();
  const htmlFor = textareaProps?.id ?? textareaProps?.name ?? fallbackId;
  const hasTextareaValue = Boolean(textareaProps?.value?.toString().trim());

  return (
    <ListFormRow
      label={label}
      htmlFor={htmlFor}
      className={cn('items-start border-b-0 pt-4', className)}
    >
      <div className="relative w-full">
        <textarea
          id={htmlFor}
          rows={4}
          className="font-label-md block max-h-40 min-h-24 w-full resize-none overflow-y-auto pr-12 text-left text-neutral-900 outline-none placeholder:text-neutral-600"
          {...textareaProps}
        />
        {hasTextareaValue ? (
          <InputClearButton
            className="absolute top-0 right-0"
            onClick={onClear}
          />
        ) : null}
      </div>
    </ListFormRow>
  );
}

function ListFormInputRow({
  label,
  unit,
  inputProps,
  className,
}: ListFormInputRowProps) {
  const fallbackId = useId();
  const htmlFor = inputProps?.id ?? inputProps?.name ?? fallbackId;

  return (
    <ListFormRow label={label} htmlFor={htmlFor} className={className}>
      <div className="flex flex-1 items-center justify-end gap-1">
        <Input
          id={htmlFor}
          className="font-label-md zpy-0 h-auto border-0 bg-transparent px-0 text-right text-neutral-900 placeholder:text-neutral-600 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          {...inputProps}
        />
        {unit && (
          <span className="font-paragraph-sm shrink-0 text-neutral-900">
            {unit}
          </span>
        )}
      </div>
    </ListFormRow>
  );
}

function ListFormSelectRow({
  label,
  value,
  options,
  onChange,
  placeholder,
  className,
}: ListFormSelectRowProps) {
  return (
    <ListFormRow label={label} className={className}>
      <div className="relative min-w-0">
        <ListFormOptionSelector
          value={value}
          options={options}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </ListFormRow>
  );
}

function ListFormRepeatRow({
  value,
  onChange,
  className,
}: ListFormRepeatRowProps) {
  return (
    <ListFormRow label="是否標示為重複" className={className}>
      <div className="relative min-w-0">
        <FormDiaryRepeatSelector value={value} onChange={onChange} />
      </div>
    </ListFormRow>
  );
}

function ListFormDateTimeRow({
  label,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  onDateClick,
  onTimeClick,
  className,
}: ListFormDateTimeRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const selectedDate = parseDateValue(dateValue);
  const parsedTime = parseTimeValue(timeValue);
  const currentYear = new Date().getFullYear();
  const selectedYear = selectedDate?.getFullYear() ?? currentYear;
  const selectedMonth = (selectedDate?.getMonth() ?? new Date().getMonth()) + 1;
  const selectedDay = selectedDate?.getDate() ?? new Date().getDate();
  const yearOptions = useMemo(
    () => Array.from({ length: 11 }, (_, index) => currentYear - 5 + index),
    [currentYear],
  );
  const dayOptions = useMemo(() => {
    const daysInMonth = getDaysInMonth(
      new Date(selectedYear, selectedMonth - 1, 1),
    );

    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  }, [selectedMonth, selectedYear]);

  const handleDateUpdate = (date: Date | undefined, closePanel = false) => {
    if (!date || !onDateChange) return;

    onDateChange(formatDateValue(date));

    if (closePanel) {
      setIsDateOpen(false);
    }
  };

  const handleDateSegmentChange = (
    segment: 'year' | 'month' | 'day',
    value: string,
  ) => {
    if (!onDateChange) return;

    const nextDate = updateDateSegment(selectedDate, segment, Number(value));

    handleDateUpdate(nextDate, segment === 'day');
  };

  const handleTimeChange = (value: string) => {
    onTimeChange?.(value);
  };

  const handleTimeSegmentChange = (
    segment: 'period' | 'hour' | 'minute',
    value: string,
  ) => {
    const nextPeriod =
      segment === 'period' ? (value as '上午' | '下午') : parsedTime.period;
    const nextHour = segment === 'hour' ? Number(value) : parsedTime.hour12;
    const nextMinute = segment === 'minute' ? Number(value) : parsedTime.minute;

    handleTimeChange(to24HourTime(nextPeriod, nextHour, nextMinute));

    if (segment === 'minute') {
      setIsTimeOpen(false);
    }
  };

  const handleDateToggle = () => {
    if (onDateChange) {
      if (isDateOpen) {
        setIsDateOpen(false);
        return;
      }

      setIsTimeOpen(false);
      setIsDateOpen(true);
      return;
    }

    onDateClick?.();
  };

  const handleTimeToggle = () => {
    if (onTimeChange) {
      if (isTimeOpen) {
        setIsTimeOpen(false);
        return;
      }

      setIsDateOpen(false);
      setIsTimeOpen(true);
      return;
    }

    onTimeClick?.();
  };

  useEffect(() => {
    if (!isDateOpen && !isTimeOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const { target } = event;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (containerRef.current?.contains(target)) {
        return;
      }

      if (target.closest('[data-slot="select-content"]')) {
        return;
      }

      setIsDateOpen(false);
      setIsTimeOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isDateOpen, isTimeOpen]);

  return (
    <ListFormRow label={label} className={className}>
      <div ref={containerRef} className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={handleDateToggle}
            className="font-label-md flex h-8 w-full cursor-pointer items-center justify-center gap-1 rounded-lg bg-neutral-200 px-3 py-1 text-neutral-600 transition-colors hover:bg-neutral-300 active:bg-neutral-400"
          >
            {dateValue}
          </button>
          {onDateChange && isDateOpen ? (
            <div className="absolute top-full right-0 z-50 mt-2 rounded-sm bg-neutral-200 p-2 shadow-md ring-2 ring-neutral-900">
              <div className="flex gap-2">
                <Select
                  value={String(selectedYear)}
                  onValueChange={(value) => {
                    if (value) handleDateSegmentChange('year', value);
                  }}
                >
                  <SelectTrigger className="bg-neutral-100" size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}年
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={String(selectedMonth)}
                  onValueChange={(value) => {
                    if (value) handleDateSegmentChange('month', value);
                  }}
                >
                  <SelectTrigger className="bg-neutral-100" size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {Array.from({ length: 12 }, (_, index) => index + 1).map(
                      (month) => (
                        <SelectItem key={month} value={String(month)}>
                          {month}月
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <Select
                  value={String(selectedDay)}
                  onValueChange={(value) => {
                    if (value) handleDateSegmentChange('day', value);
                  }}
                >
                  <SelectTrigger className="bg-neutral-100" size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {dayOptions.map((day) => (
                      <SelectItem key={day} value={String(day)}>
                        {day}日
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : null}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={handleTimeToggle}
            className="font-label-md flex h-8 w-full cursor-pointer items-center justify-center gap-1 rounded-lg bg-neutral-200 px-2 py-1 text-neutral-600 transition-colors hover:bg-neutral-300 active:bg-neutral-400"
          >
            {timeValue}
          </button>
          {onTimeChange && isTimeOpen ? (
            <div className="absolute top-full right-0 z-50 mt-2 rounded-sm bg-neutral-200 p-2 text-neutral-900 shadow-md ring-2 ring-neutral-900">
              <div className="flex gap-2">
                <Select
                  value={parsedTime.period}
                  onValueChange={(value) => {
                    if (value) handleTimeSegmentChange('period', value);
                  }}
                >
                  <SelectTrigger className="w-20 bg-neutral-100" size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end" className="w-auto min-w-0">
                    <SelectItem value="上午">上午</SelectItem>
                    <SelectItem value="下午">下午</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={String(parsedTime.hour12)}
                  onValueChange={(value) => {
                    if (value) handleTimeSegmentChange('hour', value);
                  }}
                >
                  <SelectTrigger className="w-15 bg-neutral-100" size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end" className="w-auto min-w-0">
                    {Array.from({ length: 12 }, (_, index) => index + 1).map(
                      (hour) => (
                        <SelectItem key={hour} value={String(hour)}>
                          {hour}時
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <Select
                  value={String(parsedTime.minute)}
                  onValueChange={(value) => {
                    if (value) handleTimeSegmentChange('minute', value);
                  }}
                >
                  <SelectTrigger className="w-15 bg-neutral-100" size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end" className="w-auto min-w-0">
                    {Array.from({ length: 12 }, (_, index) => index * 5).map(
                      (minute) => (
                        <SelectItem key={minute} value={String(minute)}>
                          {String(minute).padStart(2, '0')}分
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ListFormRow>
  );
}

export {
  ListFormRow,
  ListFormNameRow,
  ListFormGenderRow,
  ListFormBirthDateRow,
  ListFormParticipantsRow,
  ListFormImportantRow,
  ListFormNoteRow,
  ListFormInputRow,
  ListFormSelectRow,
  ListFormRepeatRow,
  ListFormDateTimeRow,
};

export type { RepeatPatternValue };
