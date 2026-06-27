import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Eye, EyeOff, ShieldCheck, CheckCircle, ArrowLeftCircle, Info } from 'lucide-react';
import { Button, Spinner } from 'components/common/ui';
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
      const response = await Axios().post('/basic/forgot_verify', {
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
      // 處理錯誤
      const errorMessage = error.response?.data?.message || '驗證碼錯誤或已過期';
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

  return (
      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-10 lg:col-span-8 xl:col-span-7 md:col-start-2 lg:col-start-3 xl:col-start-4">
          <div className="card card-bordered border-0 shadow-sm bg-base-100">
            <div className="card-body p-4 md:p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  {onBack && (
                    <button
                      type="button"
                      className="btn btn-link no-underline p-0 mr-2"
                      onClick={handleBack}
                      disabled={isLoading}
                    >
                      <ArrowLeftCircle size={16} className="mr-1" /> 返回
                    </button>
                  )}
                </div>
                <h4 className="mb-0 text-center flex-grow text-xl font-semibold flex items-center justify-center">
                  <ShieldCheck size={20} className="mr-2" /> 重設密碼
                </h4>
                <div style={{ width: '60px' }}></div> {/* 為了保持標題居中 */}
              </div>

              {email && (
                <div className="alert alert-info mb-4">
                  <small>為 <strong>{email}</strong> 重設密碼</small>
                </div>
              )}

              {error && (
                <div className="alert alert-error flex items-center">
                  <Info size={18} className="mr-2" /> {error}
                </div>
              )}

              {successMessage && (
                <div className="alert alert-success flex items-center">
                  <CheckCircle size={18} className="mr-2" /> {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-control w-full mb-3">
                  <label className="label pb-1" htmlFor="formCode">
                    <span className="label-text font-medium">驗證碼</span>
                  </label>
                  <div className="join w-full">
                    <span className="join-item flex items-center px-3 bg-base-200 border border-base-300">
                      <Key size={18} />
                    </span>
                    <input
                      id="formCode"
                      type="text"
                      placeholder="輸入6位數驗證碼"
                      value={code}
                      onChange={(e) => handleFieldChange('code', e.target.value)}
                      onBlur={() => setFormTouched(prev => ({ ...prev, code: true }))}
                      disabled={isLoading || !!successMessage}
                      className={`join-item input input-bordered w-full ${codeInvalid ? 'input-error' : ''}`}
                    />
                  </div>
                  {codeInvalid && (
                    <span className="label-text-alt text-error mt-1">
                      請輸入6位數驗證碼
                    </span>
                  )}
                  <span className="label-text-alt text-base-content/60 mt-1">
                    驗證碼已發送到您的電子郵件
                  </span>
                </div>

                <div className="form-control w-full mb-3">
                  <label className="label pb-1" htmlFor="formNewPassword">
                    <span className="label-text font-medium">新密碼</span>
                  </label>
                  <div className="join w-full">
                    <span className="join-item flex items-center px-3 bg-base-200 border border-base-300">
                      <Key size={18} />
                    </span>
                    <input
                      id="formNewPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="輸入新密碼"
                      value={newPassword}
                      onChange={(e) => handleFieldChange('newPassword', e.target.value)}
                      onBlur={() => setFormTouched(prev => ({ ...prev, newPassword: true }))}
                      disabled={isLoading || !!successMessage}
                      className={`join-item input input-bordered w-full ${newPasswordInvalid ? 'input-error' : ''}`}
                    />
                    <button
                      type="button"
                      className="join-item btn btn-outline"
                      onClick={togglePasswordVisibility}
                      disabled={isLoading || !!successMessage}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {newPasswordInvalid && (
                    <span className="label-text-alt text-error mt-1">
                      密碼需包含大寫字母、數字和特殊字符
                    </span>
                  )}

                  {newPassword && (
                    <div className="mt-2">
                      <small className="flex justify-between">
                        <span>密碼強度：</span>
                        <span className={strengthTextClass[getStrengthColor()]}>{getStrengthText()}</span>
                      </small>
                      <progress
                        className={`progress ${strengthBarClass[getStrengthColor()]} w-full mt-1`}
                        value={passwordStrength}
                        max="100"
                        style={{ height: '5px' }}
                      ></progress>
                      <span className="label-text-alt text-base-content/60 mt-1 block">
                        建議使用至少8個字符，包含大小寫字母、數字和符號
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-control w-full mb-4">
                  <label className="label pb-1" htmlFor="formConfirmPassword">
                    <span className="label-text font-medium">確認新密碼</span>
                  </label>
                  <div className="join w-full">
                    <span className="join-item flex items-center px-3 bg-base-200 border border-base-300">
                      <Key size={18} />
                    </span>
                    <input
                      id="formConfirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="再次輸入新密碼"
                      value={confirmPassword}
                      onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                      onBlur={() => setFormTouched(prev => ({ ...prev, confirmPassword: true }))}
                      disabled={isLoading || !!successMessage}
                      className={`join-item input input-bordered w-full ${confirmPasswordInvalid ? 'input-error' : ''}`}
                    />
                    <button
                      type="button"
                      className="join-item btn btn-outline"
                      onClick={toggleConfirmPasswordVisibility}
                      disabled={isLoading || !!successMessage}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirmPasswordInvalid && (
                    <span className="label-text-alt text-error mt-1">
                      與新密碼不一致
                    </span>
                  )}
                </div>

                <div className="grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading || !code || !newPassword || !confirmPassword || !!successMessage}
                    className="py-2"
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
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-3">
            <small className="text-base-content/60">
              沒有收到驗證碼？ <a href="#resend" className="no-underline link link-primary">重新發送</a>
            </small>
          </div>
        </div>
      </div>
  );
};

export default ResetPassword;
