import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

import { ChevronRight } from 'lucide-react';

import chevronsUpDownIcon from '@/assets/icons/chevrons-up-down.svg';
import Input from '@/components/ui/input';
import InputClearButton from '@/components/ui/InputClearButton';
import SingleAvatar from '@/components/ui/SingleAvatar';
import ToggleButton from '@/components/ui/ToggleButton';
import cn from '@/lib/utils';

type ListFormRowProps = {
  label: string;
  htmlFor: string;
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
  selectProps?: SelectHTMLAttributes<HTMLSelectElement>;
  className?: string;
};

type ListFormBirthDateRowProps = {
  label: string;
  value: string;
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

function ListFormRow({
  label,
  htmlFor,
  children,
  className,
}: ListFormRowProps) {
  return (
    <div
      className={cn(
        'flex min-h-12 items-center gap-4 border-b border-neutral-900',
        className,
      )}
    >
      <label
        htmlFor={htmlFor}
        className="font-label-md shrink-0 text-neutral-900"
      >
        {label}
      </label>
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
  const htmlFor = inputProps?.id ?? inputProps?.name ?? label;

  return (
    <ListFormRow label={label} htmlFor={htmlFor} className={className}>
      <Input
        placeholder="輸入名稱"
        className="font-paragraph-md h-auto border-0 bg-transparent px-0 py-0 pr-4 text-right text-neutral-900 shadow-none placeholder:text-neutral-600 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        {...inputProps}
      />
    </ListFormRow>
  );
}

function ListFormGenderRow({
  label,
  selectProps,
  className,
}: ListFormGenderRowProps) {
  const htmlFor = selectProps?.id ?? selectProps?.name ?? label;

  return (
    <ListFormRow label={label} htmlFor={htmlFor} className={className}>
      <div className="relative min-w-0">
        <select
          id={htmlFor}
          className="font-paragraph-md h-auto min-w-0 appearance-none border-0 bg-transparent px-0 py-0 pr-8 text-right font-bold text-neutral-600 outline-none"
          {...selectProps}
        >
          <option value="">請選擇</option>
          <option value="male">男</option>
          <option value="female">女</option>
          <option value="other">其他</option>
        </select>
        <div className="pointer-events-none absolute top-1/2 right-0 flex h-5 w-5 -translate-y-1/2 items-center justify-center">
          <img
            src={chevronsUpDownIcon}
            alt=""
            aria-hidden="true"
            className="h-3 w-3"
          />
        </div>
      </div>
    </ListFormRow>
  );
}

function ListFormBirthDateRow({
  label,
  value,
  className,
}: ListFormBirthDateRowProps) {
  return (
    <ListFormRow
      label={label}
      htmlFor={label}
      className={cn('border-b-0', className)}
    >
      <div className="font-label-md inline-flex min-h-8 items-center rounded-md border-none bg-neutral-200 px-2 py-1 text-right text-neutral-600">
        {value}
      </div>
    </ListFormRow>
  );
}

function ListFormParticipantsRow({
  label,
  className,
}: ListFormParticipantsRowProps) {
  return (
    <ListFormRow label={label} htmlFor={label} className={className}>
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
        <ChevronRight className="size-4 text-neutral-600" strokeWidth={2.5} />
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
    <ListFormRow label={label} htmlFor={label} className={className}>
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
  const htmlFor = textareaProps?.id ?? textareaProps?.name ?? label;

  return (
    <ListFormRow
      label={label}
      htmlFor={htmlFor}
      className={cn('items-start border-b-0', className)}
    >
      <div className="relative w-full">
        <textarea
          id={htmlFor}
          rows={1}
          className="font-label-md block min-h-12 w-full resize-none overflow-hidden bg-transparent py-0 pr-12 text-left text-neutral-900 outline-none placeholder:text-neutral-600"
          style={{ fieldSizing: 'content' }}
          {...textareaProps}
        />
        <InputClearButton
          className="absolute top-0 right-0"
          onClick={onClear}
        />
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
};
