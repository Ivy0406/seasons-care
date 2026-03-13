import { useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';

import { Eye, EyeClosed } from 'lucide-react';

import Input from '@/components/ui/input';
import InputClearButton from '@/components/ui/InputClearButton';
import cn from '@/lib/utils';

type InputFieldProps = React.ComponentProps<typeof Input> & {
  wrapperClassName?: string;
  suffix?: ReactNode;
  error?: string;
  onClear?: () => void;
};

type FieldWrapperProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
  labelClassName?: string;
};

export function FieldWrapper({
  label,
  htmlFor,
  children,
  labelClassName,
}: FieldWrapperProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className={cn('font-label-md text-neutral-900', labelClassName)}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function InputField({
  className,
  wrapperClassName,
  suffix,
  error,
  onClear,
  ...props
}: InputFieldProps) {
  const rightElement = error ? (
    <InputClearButton
      onClick={(e) => {
        e.preventDefault();
        onClear?.();
      }}
    />
  ) : (
    suffix
  );

  return (
    <div className="flex w-full flex-col gap-1">
      <div
        className={cn(
          'flex h-12 w-full items-center overflow-hidden rounded border-2 bg-neutral-200 transition-colors',
          error ? 'border-error-500' : 'border-neutral-900',
          wrapperClassName,
        )}
      >
        <Input
          className={cn(
            'font-paragraph-md flex-1 rounded-none border-0 bg-transparent p-3 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0',
            className,
          )}
          {...props}
        />

        {rightElement && (
          <div className="flex items-center justify-center pr-3">
            {rightElement}
          </div>
        )}
      </div>

      {error && <p className="text-error-500 text-base">{error}</p>}
    </div>
  );
}

export function InputFieldEmail(
  props: Omit<InputFieldProps, 'type' | 'suffix'>,
) {
  return <InputField type="email" placeholder="example@mail.com" {...props} />;
}

export function InputFieldPassword({
  onChange,
  value,
  ...props
}: Omit<InputFieldProps, 'type' | 'suffix'>) {
  const [showPassword, setShowPassword] = useState(false);

  const hasValue = typeof value === 'string' ? value.length > 0 : false;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  return (
    <InputField
      {...props}
      value={value}
      type={showPassword ? 'text' : 'password'}
      placeholder="6-12位數密碼，請區分大小寫"
      onChange={handleChange}
      suffix={
        hasValue && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword((prev) => !prev);
            }}
            className="flex h-full items-center text-neutral-800 hover:text-neutral-900 focus:outline-none"
          >
            {showPassword ? (
              <Eye className="h-6 w-6" />
            ) : (
              <EyeClosed className="h-6 w-6" />
            )}
          </button>
        )
      }
    />
  );
}

export function InputFieldName(
  props: Omit<InputFieldProps, 'type' | 'suffix'>,
) {
  return (
    <InputField
      type="text"
      placeholder="嘿！別害羞，告訴我們你是誰。"
      {...props}
    />
  );
}

export function InputFieldGroupId(
  props: Omit<InputFieldProps, 'type' | 'suffix'>,
) {
  return <InputField type="text" placeholder="請輸入照護群組 ID" {...props} />;
}
