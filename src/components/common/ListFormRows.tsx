import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';
import { useId } from 'react';

import FormDiaryRepeatSelector, {
  type FormDiaryRepeatValue,
} from '@/components/common/FormDiaryRepeatSelector';
import InputClearButton from '@/components/common/InputClearButton';
import ListFormOptionSelector from '@/components/common/ListFormOptionSelector';
import SingleAvatar from '@/components/common/SingleAvatar';
import ToggleButton from '@/components/common/ToggleButton';
import Input from '@/components/ui/input';
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
  onDateClick?: () => void;
  onTimeClick?: () => void;
  className?: string;
};

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
      {onChange ? (
        <input
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="font-label-md min-h-8 rounded-md border-none bg-neutral-200 px-2 py-1 text-right text-neutral-600 outline-none"
        />
      ) : (
        <div className="font-label-md inline-flex min-h-8 items-center rounded-md border-none bg-neutral-200 px-2 py-1 text-right text-neutral-600">
          {value}
        </div>
      )}
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
  onDateClick,
  onTimeClick,
  className,
}: ListFormDateTimeRowProps) {
  return (
    <ListFormRow label={label} className={className}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDateClick}
          className="font-label-md flex h-8 items-center rounded-lg bg-neutral-200 px-3 py-1 text-neutral-600 transition-colors hover:bg-neutral-300 active:bg-neutral-400"
        >
          {dateValue}
        </button>
        <button
          type="button"
          onClick={onTimeClick}
          className="font-label-md flex h-8 items-center rounded-lg bg-neutral-200 px-3 py-1 text-neutral-600 transition-colors hover:bg-neutral-300 active:bg-neutral-400"
        >
          {timeValue}
        </button>
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
