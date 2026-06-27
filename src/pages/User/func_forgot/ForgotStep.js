import React, { useState, useEffect } from 'react';
import ForgotPassword from 'pages/User/func_forgot/ForgotPassPage';
import ResetPassword from 'pages/User/func_forgot/ResetPassPage';
import Axios from 'common/Axios';
import { CheckCircle, XCircle, Mail, Key, X, ShieldCheck } from 'lucide-react';
import { Card } from 'components/common/ui';

const ForgotPasswordFlow = () => {
  // 基本狀態管理
  const [step, setStep] = useState(1); // 管理步驟
  const [email, setEmail] = useState(''); // 儲存輸入的電子郵件
  
  // 提示訊息狀態管理
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    variant: 'success',
    icon: <CheckCircle className="mr-2" size={18} />
  });
  
  // 載入狀態
  const [isLoading, setIsLoading] = useState(false);
  
  // 處理階段1的提交：發送驗證碼
  const handleNext = async (email) => {
    setEmail(email); // 設定用戶的電子郵件
    setIsLoading(true); // 開始載入
    
    try {
      const response = await Axios().post('/basic/forgot_password', { 'email': email });
      
      if (response.status === 200) {
        showNotification('已寄驗證碼到您信箱，請查收！', 'success');
        // 延遲切換到下一步，讓用戶有時間看到成功訊息
        setTimeout(() => {
          setStep(2); // 切換到下一步
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '查無此電子郵件或系統發生錯誤';
      showNotification(errorMessage, 'danger');
    } finally {
      setIsLoading(false); // 結束載入狀態
    }
  };
  
  // 回到上一步
  const handleBack = () => {
    setStep(1);
  };
  
  // 重設密碼成功的回調
  const handleResetSuccess = () => {
    showNotification('密碼重設成功！即將返回登入頁面...', 'success');
    // 這裡可以設定一個定時器，然後導航到登入頁面
    setTimeout(() => {
      // window.location.href = '/login';
      // 或使用 React Router 導航
    }, 3000);
  };
  
  // 統一的提示訊息顯示函數
  const showNotification = (message, variant) => {
    const icon = variant === 'success' ?
      <CheckCircle className="mr-2" size={18} /> :
      <XCircle className="mr-2" size={18} />;
    
    setNotification({
      show: true,
      message,
      variant,
      icon
    });
    
    // 自動隱藏提示訊息
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };
  
  // 清除提示訊息
  const clearNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };
  
  // 獲取當前步驟的進度百分比
  const getProgressPercentage = () => {
    return step === 1 ? 33 : 66;
  };
  
  // 獲取當前步驟的標題
  const getStepTitle = () => {
    return step === 1 ? '步驟一：發送重設密碼信件' : '步驟二：輸入驗證碼並重設密碼';
  };
  
  // 獲取當前步驟的圖示
  const getStepIcon = () => {
    return step === 1 ? <Mail className="mr-2" size={20} /> : <Key className="mr-2" size={20} />;
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        {/* 標題區 */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e3a8a] text-white shadow-lg shadow-[#1e3a8a]/20">
            <ShieldCheck size={26} strokeWidth={2} />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
            重設密碼
          </h1>
          <span className="mx-auto mt-3 block h-px w-16 bg-[#a0781c]" />
          <p className="mt-4 text-sm text-slate-500">
            智慧商務系系友會 · 帳號安全中心
          </p>
        </div>

        <Card padding="lg" className="overflow-hidden">
          {/* 步驟標頭 */}
          <div className="mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-[#1e3a8a] sm:text-xl">
                {getStepIcon()}
                {getStepTitle()}
              </h2>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#1e3a8a]/5 px-3 py-1 text-xs font-medium text-[#1e3a8a]">
                步驟 {step} / 2
              </span>
            </div>

            {/* 進度條 */}
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1e3a8a] to-[#2b4fb8] transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          {/* 提示訊息 */}
          {notification.show && (
            <div
              className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm ${
                notification.variant === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}
              role="alert"
            >
              <span className="mt-0.5 shrink-0">{notification.icon}</span>
              <span className="flex-1 break-words leading-relaxed">{notification.message}</span>
              <button
                type="button"
                className="shrink-0 rounded-lg p-1 text-current/70 transition hover:bg-black/5"
                onClick={clearNotification}
                aria-label="關閉"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* 步驟內容 */}
          <div>
            {step === 1 ? (
              <ForgotPassword onNext={handleNext} isLoading={isLoading} />
            ) : (
              <ResetPassword
                email={email}
                onBack={handleBack}
                onResetSuccess={handleResetSuccess}
              />
            )}
          </div>

          {/* 底部說明 */}
          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs leading-relaxed text-slate-500">
              {step === 1
                ? '輸入您的電子郵件後，我們將發送一封含有驗證碼的郵件給您'
                : '請檢查您的信箱並輸入收到的驗證碼，然後設定新密碼'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordFlow;