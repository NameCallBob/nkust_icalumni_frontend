import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Eye, EyeOff, ShieldCheck, CheckCircle, ArrowLeftCircle, Info } from 'lucide-react';
import { Button, Spinner, Card } from 'components/common/ui';
import Axios from 'common/Axios';

const ResetPassword = ({ email, onBack, onResetSuccess }) => {
  // 基本狀態
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 密碼相關狀態
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formTouched, setFormTouched] = useState({
    code: false,
    newPassword: false,
    confirmPassword: false
  });

  const navigate = useNavigate();

  // 檢查密碼強度
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    // 長度檢查
    if (newPassword.length >= 8) strength += 25;

    // 複雜度檢查
    if (/[A-Z]/.test(newPassword)) strength += 25; // 大寫字母
    if (/[0-9]/.test(newPassword)) strength += 25; // 數字
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 25; // 特殊字符

    setPasswordStrength(strength);
  }, [newPassword]);

  // 獲取密碼強度顏色
  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'danger';
    if (passwordStrength < 75) return 'warning';
    return 'success';
  };

  // 獲取密碼強度文字
  const getStrengthText = () => {
    if (passwordStrength < 50) return '弱';
    if (passwordStrength < 75) return '中';
    return '強';
  };

  // Bootstrap 顏色名 -> DaisyUI/Tailwind 對照（純樣式映射，不影響邏輯）
  const strengthTextClass = { danger: 'text-error', warning: 'text-warning', success: 'text-success' };
  const strengthBarClass = { danger: 'progress-error', warning: 'progress-warning', success: 'progress-success' };

  // 表單驗證
  const validateForm = () => {
    // 檢查是否所有欄位都已填寫
    if (!code || !newPassword || !confirmPassword) {
      setError('所有欄位都需要填寫');
      return false;
    }

    // 驗證碼格式驗證（假設是6位數字）
    if (!/^\d{6}$/.test(code)) {
      setError('驗證碼應為6位數字');
      return false;
    }

    // 密碼強度檢查
    if (passwordStrength < 50) {
      setError('密碼強度太弱，請包含大寫字母、數字和特殊字符');
      return false;
    }

    // 檢查密碼一致性
    if (newPassword !== confirmPassword) {
      setError('新密碼與確認密碼不一致');
      return false;
    }

    return true;
  };

  // 處理欄位變更
  const handleFieldChange = (field, value) => {
    // 清除錯誤提示
    setError('');

    // 更新對應的欄位值
    switch (field) {
      case 'code':
        setCode(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }

    // 標記欄位為已觸碰
    setFormTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 驗證表單
    if (!validateForm()) {
      return;
    }

    // 設置載入狀態
    setIsLoading(true);

    try {
      // 發送重設密碼請求
      // 後端（資安修補 HIGH-1）要求驗證碼必須綁定 email，故一併送出
      const response = await Axios().post('/basic/forgot_verify', {
        "email": email,
        "code": code,
        "new_password": newPassword
      });

      // 處理成功響應
      setSuccessMessage('密碼重設成功！正在跳轉到登入頁面...');

      // 如果有成功回調函數，則調用它
      if (typeof onResetSuccess === 'function') {
        onResetSuccess();
      } else {
        // 否則使用默認行為
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      // 處理錯誤：後端錯誤可能在 error（字串或陣列，如密碼強度驗證）或 message 欄位
      const data = error.response?.data;
      let errorMessage = '驗證碼錯誤或已過期';
      if (data) {
        if (Array.isArray(data.error)) errorMessage = data.error.join('、');
        else if (data.error) errorMessage = data.error;
        else if (data.message) errorMessage = data.message;
      }
      setError(errorMessage);
    } finally {
      // 結束載入狀態
      setIsLoading(false);
    }
  };

  // 處理返回上一步
  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
    }
  };

  // 切換密碼可見性
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 切換確認密碼可見性
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // 各欄位的即時驗證狀態（沿用原 isInvalid 條件）
  const codeInvalid = formTouched.code && (!/^\d{6}$/.test(code) && code !== '');
  const newPasswordInvalid = formTouched.newPassword && passwordStrength < 50 && newPassword !== '';
  const confirmPasswordInvalid = formTouched.confirmPassword && newPassword !== confirmPassword && confirmPassword !== '';

  // 統一輸入框樣式（深藍聚焦、圓角、含左圖示留白）
  const inputBase =
    'w-full rounded-xl border bg-white pl-11 py-2.5 text-slate-900 placeholder:text-slate-400 ' +
    'shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/25 disabled:bg-slate-50 disabled:text-slate-400';
  const inputState = (invalid) =>
    invalid
      ? 'border-error focus:border-error focus:ring-error/20'
      : 'border-slate-200 focus:border-[#1e3a8a]';

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card padding="none" className="overflow-hidden">
        {/* 深藍 header 區，金線點綴 */}
        <div className="relative bg-[#0f172a] px-6 py-7 sm:px-8">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#a0781c] to-transparent" />
          <div className="flex items-center justify-between gap-3">
            {onBack ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-slate-300 transition hover:text-white disabled:opacity-50"
              >
                <ArrowLeftCircle size={18} /> 返回
              </button>
            ) : (
              <span className="w-14" />
            )}
            <span className="w-14" />
          </div>
          <div className="mt-3 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1e3a8a] text-white ring-4 ring-white/5">
              <ShieldCheck size={24} />
            </div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-white">重設密碼</h2>
            {email && (
              <p className="mt-1.5 text-sm text-slate-400">
                為 <span className="font-medium text-[#d6b25e]">{email}</span> 設定新密碼
              </p>
            )}
          </div>
        </div>

        {/* 表單主體 */}
        <div className="px-6 py-7 sm:px-8">
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              <Info size={18} className="mt-0.5 shrink-0" />
              <span className="break-words">{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              <CheckCircle size={18} className="mt-0.5 shrink-0" />
              <span className="break-words">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 驗證碼 */}
            <div>
              <label htmlFor="formCode" className="mb-1.5 block text-sm font-medium text-slate-700">
                驗證碼
              </label>
              <div className="relative">
                <Key size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="formCode"
                  type="text"
                  placeholder="輸入6位數驗證碼"
                  value={code}
                  onChange={(e) => handleFieldChange('code', e.target.value)}
                  onBlur={() => setFormTouched(prev => ({ ...prev, code: true }))}
                  disabled={isLoading || !!successMessage}
                  className={`${inputBase} pr-4 tracking-[0.3em] ${inputState(codeInvalid)}`}
                />
              </div>
              {codeInvalid ? (
                <p className="mt-1.5 text-xs text-error">請輸入6位數驗證碼</p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-400">驗證碼已發送到您的電子郵件</p>
              )}
            </div>

            {/* 新密碼 */}
            <div>
              <label htmlFor="formNewPassword" className="mb-1.5 block text-sm font-medium text-slate-700">
                新密碼
              </label>
              <div className="relative">
                <Key size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="formNewPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="輸入新密碼"
                  value={newPassword}
                  onChange={(e) => handleFieldChange('newPassword', e.target.value)}
                  onBlur={() => setFormTouched(prev => ({ ...prev, newPassword: true }))}
                  disabled={isLoading || !!successMessage}
                  className={`${inputBase} pr-12 ${inputState(newPasswordInvalid)}`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading || !!successMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-[#1e3a8a] disabled:opacity-50"
                  aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {newPasswordInvalid && (
                <p className="mt-1.5 text-xs text-error">密碼需包含大寫字母、數字和特殊字符</p>
              )}

              {newPassword && (
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">密碼強度</span>
                    <span className={`font-semibold ${strengthTextClass[getStrengthColor()]}`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <progress
                    className={`progress ${strengthBarClass[getStrengthColor()]} mt-1.5 h-1.5 w-full`}
                    value={passwordStrength}
                    max="100"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    建議使用至少8個字符，包含大小寫字母、數字和符號
                  </p>
                </div>
              )}
            </div>

            {/* 確認新密碼 */}
            <div>
              <label htmlFor="formConfirmPassword" className="mb-1.5 block text-sm font-medium text-slate-700">
                確認新密碼
              </label>
              <div className="relative">
                <Key size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="formConfirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="再次輸入新密碼"
                  value={confirmPassword}
                  onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                  onBlur={() => setFormTouched(prev => ({ ...prev, confirmPassword: true }))}
                  disabled={isLoading || !!successMessage}
                  className={`${inputBase} pr-12 ${inputState(confirmPasswordInvalid)}`}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  disabled={isLoading || !!successMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-[#1e3a8a] disabled:opacity-50"
                  aria-label={showConfirmPassword ? '隱藏密碼' : '顯示密碼'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPasswordInvalid && (
                <p className="mt-1.5 text-xs text-error">與新密碼不一致</p>
              )}
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={isLoading || !code || !newPassword || !confirmPassword || !!successMessage}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span className="ml-2">處理中...</span>
                </>
              ) : (
                '確認重設密碼'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            沒有收到驗證碼？{' '}
            <a href="#resend" className="font-medium text-[#1e3a8a] underline-offset-2 hover:underline">
              重新發送
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
