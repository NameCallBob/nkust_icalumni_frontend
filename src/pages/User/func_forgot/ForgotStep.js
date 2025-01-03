import React, { useState } from 'react';
import ForgotPassword from 'pages/User/func_forgot/ForgotPassPage';
import ResetPassword from 'pages/User/func_forgot/ResetPassPage';
import { Alert } from 'react-bootstrap';
import Axios from 'common/Axios';

const ForgotPasswordFlow = () => {
  const [step, setStep] = useState(1); // 管理步驟
  const [email, setEmail] = useState(''); // 儲存輸入的電子郵件
  const [showMessage, setShowMessage] = useState(false); // 控制提示訊息顯示
  const [message, setMessage] = useState(''); // 儲存提示訊息
  const [variant, setVariant] = useState('success'); // 設定提示訊息的樣式

  const handleNext = (email) => {
    setEmail(email); // 設定用戶的電子郵件

    Axios().post('/basic/forgot_password', { 'email' : email })
      .then((res) => {
        if (res.status === 200) {
          setMessage('已寄驗證碼到您信箱!'); // 設定成功訊息
          setVariant('success'); // 設定訊息樣式為成功
          setShowMessage(true); // 顯示提示訊息
          setTimeout(() => {
            setShowMessage(false); // 隱藏訊息
            setStep(2); // 切換到下一步
          }, 2000); // 2秒後切換頁面
        }
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || '查無此電子郵件'); // 設定錯誤訊息
        setVariant('danger'); // 設定訊息樣式為錯誤
        setShowMessage(true); // 顯示提示訊息
        setTimeout(() => {
          setShowMessage(false); // 隱藏訊息
        }, 2000); // 2秒後隱藏訊息
      });
  };

  return (
    <div>
      {showMessage && (
        <Alert variant={variant}>{message}</Alert>
      )}
      {step === 1 ? (
        <ForgotPassword onNext={handleNext} />
      ) : (
        <ResetPassword email={email} />
      )}
    </div>
  );
};

export default ForgotPasswordFlow;
