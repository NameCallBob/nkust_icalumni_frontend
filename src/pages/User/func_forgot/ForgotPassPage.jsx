import React, { useState } from 'react';
import { Mail, ArrowRightCircle, Info } from 'lucide-react';
import { Button, Spinner } from 'components/common/ui';

const ForgotPassword = ({ onNext }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // 驗證電子郵件格式
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isEmailValid = email ? validateEmail(email) : false;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('請輸入您的電子郵件');
      return;
    }

    if (!validateEmail(email)) {
      setError('請輸入有效的電子郵件格式');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // 這裡可以添加與後端 API 的通信邏輯
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 800));
      onNext(email); // 移動到下一步，並傳遞電子郵件
    } catch (err) {
      setError('發送重置密碼郵件時出錯，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsTouched(true);
    // 清除之前的錯誤
    if (e.target.value && validateEmail(e.target.value)) {
      setError('');
    }
  };

  // 是否顯示無效狀態
  const showInvalid = isTouched && email && !isEmailValid;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-2xl shadow-[0_10px_40px_-12px_rgba(15,23,42,0.25)] ring-1 ring-slate-900/5 overflow-hidden">
          {/* Header 區塊 */}
          <div className="px-7 md:px-10 pt-9 pb-7 text-center border-b border-slate-100">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e3a8a]/10 text-[#1e3a8a]">
              <Mail size={26} />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0f172a] tracking-tight">
              忘記密碼
            </h2>
            <span className="mt-3 mb-4 block mx-auto h-px w-12 bg-gradient-to-r from-transparent via-[#a0781c] to-transparent" />
            <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-md mx-auto">
              請輸入您的電子郵件，我們將發送重置密碼的驗證碼，確認是您本人進行密碼修正
            </p>
          </div>

          {/* 表單區塊 */}
          <div className="px-7 md:px-10 py-8">
            {error && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <Info size={18} className="mt-0.5 shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-7">
                <label
                  className="mb-2 block text-sm font-semibold text-[#0f172a]"
                  htmlFor="formEmail"
                >
                  電子郵件地址
                </label>
                <div
                  className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-colors focus-within:ring-2 focus-within:ring-[#1e3a8a]/30 ${
                    showInvalid
                      ? 'border-red-400 focus-within:border-red-400'
                      : 'border-slate-200 focus-within:border-[#1e3a8a]'
                  }`}
                >
                  <Mail size={18} className="shrink-0 text-slate-400" />
                  <input
                    id="formEmail"
                    type="email"
                    className="w-full bg-transparent text-sm text-[#0f172a] placeholder:text-slate-400 outline-none"
                    placeholder="example@company.com"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => setIsTouched(true)}
                    aria-describedby="emailHelpBlock"
                  />
                </div>
                {showInvalid ? (
                  <p className="mt-2 text-xs text-red-600">請輸入有效的電子郵件格式</p>
                ) : (
                  <p id="emailHelpBlock" className="mt-2 text-xs text-slate-400">
                    請輸入您註冊時使用的電子郵件地址
                  </p>
                )}
              </div>

              <Button
                variant="primary"
                type="submit"
                size="lg"
                className="w-full justify-center font-semibold"
                disabled={isLoading || !email || !isEmailValid}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2 text-current" />
                    處理中...
                  </>
                ) : (
                  <>
                    下一步
                    <ArrowRightCircle className="ml-2" size={18} />
                  </>
                )}
              </Button>

              <div className="mt-7 text-center">
                <a
                  href="/login"
                  className="text-sm font-medium text-[#1e3a8a] hover:text-[#0f172a] transition-colors"
                >
                  返回登入頁面
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
