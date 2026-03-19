import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

import {
  FieldWrapper,
  InputFieldEmail,
  InputFieldPassword,
} from '@/components/common/InputField';
import {
  RoundedButtonDisabled,
  RoundedButtonPrimary,
} from '@/components/common/RoundedButtons';

type RegisterFormValues = {
  account: string;
  password: string;
};

type RegisterFormProps = {
  onNext: (data: RegisterFormValues) => void;
};

function RegisterAccount({ onNext }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({ mode: 'onChange' });

  const passwordValue = watch('password', '');
  const onSubmit = (data: RegisterFormValues) => {
    onNext(data);
  };

  return (
    <form
      className="flex w-full flex-col items-center justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-10 flex w-full flex-col gap-3 pb-7">
        <FieldWrapper label="帳號" htmlFor="account">
          <InputFieldEmail
            id="account"
            placeholder="example@mail.com"
            {...register('account', {
              required: '請輸入帳號',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '請輸入正確的 Email 格式',
              },
            })}
            error={errors.account?.message}
          />
        </FieldWrapper>
        <FieldWrapper label="密碼" htmlFor="password">
          <InputFieldPassword
            id="password"
            placeholder="6-12位數密碼，請區分大小寫"
            value={passwordValue}
            {...register('password', {
              required: '請輸入密碼',
              minLength: {
                value: 6,
                message: '長度需為6-12個字元',
              },
              maxLength: {
                value: 12,
                message: '長度需為6-12個字元',
              },
            })}
            onClear={() => setValue('password', '', { shouldValidate: true })}
            error={errors.password?.message}
          />
        </FieldWrapper>
      </div>
      <div className="flex w-full flex-col items-center gap-3">
        {isValid ? (
          <RoundedButtonPrimary onClick={handleSubmit(onSubmit)}>
            註冊帳號
          </RoundedButtonPrimary>
        ) : (
          <RoundedButtonDisabled>註冊帳號</RoundedButtonDisabled>
        )}
        <div className="flex items-center gap-1">
          <p className="font-paragraph-md text-neutral-600">已有帳號？</p>
          <Link to="../login" className="font-label-md text-primary-dark">
            點此登入
          </Link>
        </div>
      </div>
    </form>
  );
}

export default RegisterAccount;
