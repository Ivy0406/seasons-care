import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import {
  FieldWrapper,
  InputFieldEmail,
  InputFieldPassword,
} from '@/components/common/InputField';
import Modal from '@/components/common/Modal';
import {
  RoundedButtonDisabled,
  RoundedButtonPrimary,
} from '@/components/common/RoundedButtons';

type ResetPasswordFormValues = {
  account: string;
  newPassword: string;
  confirmPassword: string;
};

const PASSWORD_RULES = {
  required: '此欄位為必填',
  minLength: { value: 6, message: '長度需為6-12個字元' },
  maxLength: { value: 12, message: '長度需為6-12個字元' },
};

function ResetPassword() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormValues>({ mode: 'onChange' });

  const newPasswordValue = watch('newPassword', '');
  const confirmPasswordValue = watch('confirmPassword', '');

  return (
    <section className="mx-auto max-w-200">
      <form
        className="flex w-full flex-col gap-6 p-6"
        onSubmit={handleSubmit(() => setIsModalOpen(true))}
      >
        <p className="font-paragraph-md text-neutral-900">
          密碼必須為6-12位數，請區分大小寫。
        </p>

        <div className="flex flex-col gap-3">
          <FieldWrapper label="" htmlFor="account">
            <InputFieldEmail
              id="account"
              placeholder="請輸入帳號 Email"
              {...register('account', {
                required: '此欄位為必填',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '請輸入正確的 Email 格式',
                },
              })}
              error={errors.account?.message}
            />
          </FieldWrapper>

          <FieldWrapper label="" htmlFor="newPassword">
            <InputFieldPassword
              id="newPassword"
              placeholder="新密碼"
              value={newPasswordValue}
              {...register('newPassword', PASSWORD_RULES)}
              onClear={() =>
                setValue('newPassword', '', { shouldValidate: true })
              }
              error={errors.newPassword?.message}
            />
          </FieldWrapper>

          <FieldWrapper label="" htmlFor="confirmPassword">
            <InputFieldPassword
              id="confirmPassword"
              placeholder="再次輸入新密碼"
              value={confirmPasswordValue}
              {...register('confirmPassword', {
                ...PASSWORD_RULES,
                validate: (value) =>
                  value === newPasswordValue || '兩次輸入的密碼不一致',
              })}
              onClear={() =>
                setValue('confirmPassword', '', { shouldValidate: true })
              }
              error={errors.confirmPassword?.message}
            />
          </FieldWrapper>
        </div>

        <div className="flex flex-col items-center gap-3">
          {isValid ? (
            <RoundedButtonPrimary type="submit">重設密碼</RoundedButtonPrimary>
          ) : (
            <RoundedButtonDisabled>重設密碼</RoundedButtonDisabled>
          )}
        </div>
      </form>

      <Modal
        open={isModalOpen}
        variant="success"
        title="密碼已重設成功"
        statusLayout="icon-first"
        autoCloseMs={1500}
        onClose={() => navigate('/login')}
      />
    </section>
  );
}

export default ResetPassword;
