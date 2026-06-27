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
    <div className="grid grid-cols-12 gap-4 justify-center">
      <div className="col-span-12 md:col-span-10 lg:col-span-7 xl:col-span-6 mx-auto">
        <div className="card card-bordered border-0 shadow-sm rounded-xl bg-base-100">
          <div className="card-body p-6 md:p-10">
            <div className="text-center mb-6">
              <h2 className="font-bold text-2xl mb-2 text-base-content">忘記密碼</h2>
              <p className="text-base-content/60">
                請輸入您的電子郵件，我們將發送重置密碼的驗證碼，確認是您本人進行密碼修正
              </p>
            </div>

            {error && (
              <div className="alert alert-error flex items-center mb-4">
                <Info size={20} className="mr-2" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-control w-full mb-6">
                <label className="label pb-1" htmlFor="formEmail">
                  <span className="label-text font-medium text-base-content">電子郵件地址</span>
                </label>
                <label
                  className={`input input-bordered flex items-center gap-2 py-2 ${
                    showInvalid ? 'border-error' : ''
                  }`}
                >
                  <Mail size={18} className="text-base-content/50" />
                  <input
                    id="formEmail"
                    type="email"
                    className="grow"
                    placeholder="example@company.com"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => setIsTouched(true)}
                    aria-describedby="emailHelpBlock"
                  />
                </label>
                {showInvalid && (
                  <span className="label-text-alt text-error mt-1">
                    請輸入有效的電子郵件格式
                  </span>
                )}
                <span id="emailHelpBlock" className="label-text-alt text-base-content/60 mt-1">
                  請輸入您註冊時使用的電子郵件地址
                </span>
              </div>

              <div className="grid gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="font-medium rounded-full py-2 w-full"
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
              </div>

              <div className="text-center mt-6">
                <a href="/login" className="link link-hover text-primary">
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
