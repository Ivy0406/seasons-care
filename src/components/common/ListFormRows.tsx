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

type InlineDatePickerProps = {
  value: string;
  onChange?: (value: string) => void;
  onTriggerClick?: () => void;
  parseFormat?: string;
  outputFormat?: string;
  yearOptions: number[];
  triggerClassName?: string;
  panelClassName?: string;
};

type ScrollableDatePickerProps = {
  value: string;
  onChange?: (value: string) => void;
  parseFormat?: string;
  outputFormat?: string;
  yearOptions: number[];
};

function parseDateValue(value: string, dateFormat = 'yyyy/MM/dd') {
  const parsedDate = parse(value, dateFormat, new Date());

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

function formatDateValue(date: Date, dateFormat = 'yyyy/MM/dd') {
  return format(date, dateFormat);
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

function useDismissOnOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    if (!isOpen) return undefined;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as HTMLElement | null;

      if (
        target?.closest('[data-slot="select-content"]') ||
        ref.current?.contains(target)
      ) {
        return;
      }

      onClose();
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, ref]);
}

function InlineDatePicker({
  value,
  onChange,
  onTriggerClick,
  parseFormat = 'yyyy/MM/dd',
  outputFormat = 'yyyy/MM/dd',
  yearOptions,
  triggerClassName,
  panelClassName,
}: InlineDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedDate = parseDateValue(value, parseFormat);
  const currentDate = new Date();
  const selectedYear = selectedDate?.getFullYear() ?? currentDate.getFullYear();
  const selectedMonth =
    (selectedDate?.getMonth() ?? currentDate.getMonth()) + 1;
  const selectedDay = selectedDate?.getDate() ?? currentDate.getDate();
  const dayOptions = useMemo(() => {
    const daysInMonth = getDaysInMonth(
      new Date(selectedYear, selectedMonth - 1, 1),
    );

    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  }, [selectedMonth, selectedYear]);

  const handleDateUpdate = (date: Date | undefined, closePanel = false) => {
    if (!date || !onChange) return;

    onChange(formatDateValue(date, outputFormat));

    if (closePanel) {
      setIsOpen(false);
    }
  };

  const handleDateSegmentChange = (
    segment: 'year' | 'month' | 'day',
    nextValue: string,
  ) => {
    if (!onChange) return;

    const nextDate = updateDateSegment(
      selectedDate,
      segment,
      Number(nextValue),
    );

    handleDateUpdate(nextDate, segment === 'day');
  };

  useDismissOnOutsideClick(rootRef, isOpen, () => setIsOpen(false));

  return (
    <div ref={rootRef} className="relative" data-vaul-no-drag="">
      <button
        type="button"
        onClick={() => {
          if (!onChange) {
            onTriggerClick?.();
            return;
          }

          setIsOpen((currentIsOpen) => !currentIsOpen);
        }}
        className={cn(
          'font-label-md inline-flex min-h-8 items-center rounded-md border-none bg-neutral-200 px-2 py-1 text-right text-neutral-600 transition-colors hover:bg-neutral-300 active:bg-neutral-400',
          triggerClassName,
        )}
      >
        {value}
      </button>
      {onChange && isOpen ? (
        <div
          data-vaul-no-drag=""
          className={cn(
            'absolute top-full right-0 z-50 mt-2 touch-pan-y rounded-sm bg-neutral-200 p-2 shadow-md ring-2 ring-neutral-900',
            panelClassName,
          )}
        >
          <div className="flex gap-2">
            <Select
              value={String(selectedYear)}
              onValueChange={(nextValue) => {
                if (nextValue) {
                  handleDateSegmentChange('year', nextValue);
                }
              }}
            >
              <SelectTrigger className="bg-neutral-100" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end" className="max-h-60 touch-pan-y">
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}年
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(selectedMonth)}
              onValueChange={(nextValue) => {
                if (nextValue) {
                  handleDateSegmentChange('month', nextValue);
                }
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
              onValueChange={(nextValue) => {
                if (nextValue) {
                  handleDateSegmentChange('day', nextValue);
                }
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
  );
}

function ScrollableDatePicker({
  value,
  onChange,
  parseFormat = 'yyyy/MM/dd',
  outputFormat = 'yyyy/MM/dd',
  yearOptions,
}: ScrollableDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedDate = parseDateValue(value, parseFormat);
  const currentDate = new Date();
  const selectedYear = selectedDate?.getFullYear() ?? currentDate.getFullYear();
  const selectedMonth =
    (selectedDate?.getMonth() ?? currentDate.getMonth()) + 1;
  const selectedDay = selectedDate?.getDate() ?? currentDate.getDate();
  const dayOptions = useMemo(() => {
    const daysInMonth = getDaysInMonth(
      new Date(selectedYear, selectedMonth - 1, 1),
    );

    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  }, [selectedMonth, selectedYear]);

  const handleDateChange = (
    segment: 'year' | 'month' | 'day',
    nextValue: number,
  ) => {
    if (!onChange) return;

    const nextDate = updateDateSegment(selectedDate, segment, nextValue);

    onChange(formatDateValue(nextDate, outputFormat));
  };

  useDismissOnOutsideClick(rootRef, isOpen, () => setIsOpen(false));

  return (
    <div ref={rootRef} className="relative" data-vaul-no-drag="">
      <button
        type="button"
        onClick={() => {
          if (!onChange) return;

          setIsOpen((currentIsOpen) => !currentIsOpen);
        }}
        className="font-label-md inline-flex min-h-8 items-center rounded-md border-none bg-neutral-200 px-2 py-1 text-right text-neutral-600 transition-colors hover:bg-neutral-300 active:bg-neutral-400"
      >
        {value}
      </button>
      {onChange && isOpen ? (
        <div
          data-vaul-no-drag=""
          className="absolute right-0 bottom-full z-50 mb-2 rounded-sm bg-neutral-200 p-2 shadow-md ring-2 ring-neutral-900"
        >
          <div className="flex gap-2">
            <div
              data-vaul-no-drag=""
              className="max-h-44 w-20 overflow-y-auto overscroll-contain rounded-md bg-neutral-100 p-1"
            >
              {yearOptions.map((year) => (
                <button
                  key={year}
                  type="button"
                  className={cn(
                    'font-label-md flex w-full items-center justify-center rounded-sm px-2 py-1 text-neutral-600',
                    year === selectedYear
                      ? 'bg-neutral-900 text-neutral-50'
                      : 'hover:bg-neutral-200 active:bg-neutral-300',
                  )}
                  onClick={() => handleDateChange('year', year)}
                >
                  {year}年
                </button>
              ))}
            </div>
            <div
              data-vaul-no-drag=""
              className="max-h-44 w-16 overflow-y-auto overscroll-contain rounded-md bg-neutral-100 p-1"
            >
              {Array.from({ length: 12 }, (_, index) => index + 1).map(
                (month) => (
                  <button
                    key={month}
                    type="button"
                    className={cn(
                      'font-label-md flex w-full items-center justify-center rounded-sm px-2 py-1 text-neutral-600',
                      month === selectedMonth
                        ? 'bg-neutral-900 text-neutral-50'
                        : 'hover:bg-neutral-200 active:bg-neutral-300',
                    )}
                    onClick={() => handleDateChange('month', month)}
                  >
                    {month}月
                  </button>
                ),
              )}
            </div>
            <div
              data-vaul-no-drag=""
              className="max-h-44 w-16 overflow-y-auto overscroll-contain rounded-md bg-neutral-100 p-1"
            >
              {dayOptions.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={cn(
                    'font-label-md flex w-full items-center justify-center rounded-sm px-2 py-1 text-neutral-600',
                    day === selectedDay
                      ? 'bg-neutral-900 text-neutral-50'
                      : 'hover:bg-neutral-200 active:bg-neutral-300',
                  )}
                  onClick={() => {
                    handleDateChange('day', day);
                    setIsOpen(false);
                  }}
                >
                  {day}日
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
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
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(
    () => Array.from({ length: 121 }, (_, index) => currentYear - index),
    [currentYear],
  );

  return (
    <ListFormRow
      label={label}
      htmlFor={label}
      className={cn('border-b-0', className)}
    >
      <ScrollableDatePicker
        value={value}
        onChange={onChange}
        parseFormat="yyyy-MM-dd"
        outputFormat="yyyy-MM-dd"
        yearOptions={yearOptions}
      />
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
  className,
}: ListFormSelectRowProps) {
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
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const timeRootRef = useRef<HTMLDivElement>(null);
  const parsedTime = parseTimeValue(timeValue);
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(
    () => Array.from({ length: 11 }, (_, index) => currentYear - 5 + index),
    [currentYear],
  );

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

  const handleTimeToggle = () => {
    if (onTimeChange) {
      if (isTimeOpen) {
        setIsTimeOpen(false);
        return;
      }

      setIsTimeOpen(true);
      return;
    }

    onTimeClick?.();
  };

  useDismissOnOutsideClick(timeRootRef, isTimeOpen, () => setIsTimeOpen(false));

  return (
    <ListFormRow label={label} htmlFor={label} className={className}>
      <div className="relative flex items-center gap-2">
        <InlineDatePicker
          value={dateValue}
          onChange={onDateChange}
          onTriggerClick={onDateClick}
          yearOptions={yearOptions}
          triggerClassName="flex h-8 min-w-28 cursor-pointer items-center justify-center gap-1 rounded-lg px-3 py-1"
        />
        <div ref={timeRootRef} className="relative">
          <button
            type="button"
            onClick={handleTimeToggle}
            className="font-label-md flex h-8 w-full cursor-pointer items-center justify-center gap-1 rounded-lg bg-neutral-200 px-2 py-1 text-neutral-600 transition-colors hover:bg-neutral-300 active:bg-neutral-400"
          >
            {timeValue}
          </button>
          {onTimeChange && isTimeOpen ? (
            <div className="absolute top-full right-0 z-50 mt-2 rounded-sm bg-neutral-200 p-2 shadow-md ring-2 ring-neutral-900">
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
