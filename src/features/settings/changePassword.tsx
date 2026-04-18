import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import {
  FieldWrapper,
  InputFieldPassword,
} from '@/components/common/InputField';
import Modal from '@/components/common/Modal';
import {
  RoundedButtonDisabled,
  RoundedButtonPrimary,
} from '@/components/common/RoundedButtons';

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const PASSWORD_RULES = {
  required: '此欄位為必填',
  minLength: { value: 6, message: '長度需為6-12個字元' },
  maxLength: { value: 12, message: '長度需為6-12個字元' },
};

function ChangePassword() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ChangePasswordFormValues>({ mode: 'onChange' });

  const currentPasswordValue = watch('currentPassword', '');
  const newPasswordValue = watch('newPassword', '');
  const confirmPasswordValue = watch('confirmPassword', '');

  return (
    <>
      <form
        className="flex w-full flex-col gap-6 p-6"
        onSubmit={handleSubmit(() => setIsModalOpen(true))}
      >
        <p className="font-paragraph-md text-neutral-900">
          密碼必須為6-12位數，請區分大小寫。
        </p>

        <div className="flex flex-col gap-3">
          <FieldWrapper label="" htmlFor="currentPassword">
            <InputFieldPassword
              id="currentPassword"
              placeholder="目前的密碼"
              value={currentPasswordValue}
              {...register('currentPassword', PASSWORD_RULES)}
              onClear={() =>
                setValue('currentPassword', '', { shouldValidate: true })
              }
              error={errors.currentPassword?.message}
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

          <p className="font-paragraph-sm text-primary-dark">忘記密碼？</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          {isValid ? (
            <RoundedButtonPrimary type="submit">更改密碼</RoundedButtonPrimary>
          ) : (
            <RoundedButtonDisabled>更改密碼</RoundedButtonDisabled>
          )}
          <div className="flex items-center gap-1">
            <p className="font-paragraph-md text-neutral-600">還沒有帳號？</p>
            <Link
              to="/registration"
              className="font-label-md text-primary-dark"
            >
              點此註冊
            </Link>
          </div>
        </div>
      </form>

      <Modal
        open={isModalOpen}
        variant="success"
        title="密碼已變更成功"
        statusLayout="icon-first"
        autoCloseMs={1500}
        onClose={() => navigate('/settings')}
      />
    </>
  );
}

export default ChangePassword;
