import React, { useState } from 'react';
import ForgotPassword from 'pages/User/func_forgot/ForgotPassPage';
import ResetPassword from 'pages/User/func_forgot/ResetPassPage';
import { Alert } from 'react-bootstrap';


const ForgotPasswordFlow = () => {
  const [step, setStep] = useState(1); // 管理步驟
  const [email, setEmail] = useState(''); // 儲存輸入的電子郵件
  const [showMessage, setShowMessage] = useState(false); // 控制提示訊息顯示

  const handleNext = (email) => {
    setEmail(email); // 設定用戶的電子郵件
    setShowMessage(true); // 顯示提示訊息
    setTimeout(() => {
      setShowMessage(false); // 隱藏訊息
      setStep(2); // 切換到下一步
    }, 2000); // 2秒後切換頁面
  };

  return (
    <div>
      {step === 1 ? (
        <>
          {showMessage && (
            <Alert variant="success">已寄驗證碼到您信箱!</Alert>
          )}
          <ForgotPassword onNext={handleNext} />
        </>
      ) : (
        <ResetPassword email={email} />
      )}
    </div>
  );
};

export default ForgotPasswordFlow;