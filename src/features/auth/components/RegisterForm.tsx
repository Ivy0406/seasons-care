import { Link } from 'react-router-dom';

import {
  FieldWrapper,
  InputFieldEmail,
  InputFieldPassword,
} from '@/components/ui/InputField';
import { RoundedButtonDisabled } from '@/components/ui/RoundedButtons';

function RegisterForm() {
  return (
    <>
      <div className="mb-10 flex w-full flex-col gap-3 pb-7">
        <FieldWrapper label="帳號" htmlFor="account">
          <InputFieldEmail id="account" placeholder="example@mail.com" />
        </FieldWrapper>
        <FieldWrapper label="密碼" htmlFor="password">
          <InputFieldPassword placeholder="6-12位數密碼，請區分大小寫" />
        </FieldWrapper>
      </div>
      <div className="flex w-full flex-col items-center gap-3">
        <RoundedButtonDisabled>註冊帳號</RoundedButtonDisabled>
        <div className="flex items-center gap-1">
          <p className="font-paragraph-md text-neutral-600">已有帳號？</p>
          <Link to="/login" className="font-label-md text-primary-dark">
            點此登入
          </Link>
        </div>
      </div>
    </>
  );
}

export default RegisterForm;
