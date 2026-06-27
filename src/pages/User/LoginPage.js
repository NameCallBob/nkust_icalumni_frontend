import React, { useEffect, useState } from 'react';
import Axios from 'common/Axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GraduationCap, Mail, Lock, Eye, EyeOff, UserCircle2, ShieldAlert, ArrowLeft } from 'lucide-react';
import SEO from 'SEO';

const BLOCK_TIME_SECONDS = 300; // 封鎖持續時間：5分鐘

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginStage, setLoginStage] = useState('email'); // 'email' 或 'password'
  const [welcomeMessage, setWelcomeMessage] = useState('');

  const navigator = useNavigate();

  useEffect(() => {
    // 檢查是否有儲存的帳號資訊
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    // 初始化登入嘗試次數與封鎖狀態
    const lastAttemptTime = localStorage.getItem('lastAttemptTime');
    const attempts = parseInt(localStorage.getItem('loginAttempts') || '0', 10);

    if (lastAttemptTime) {
      const elapsedTime = Math.floor(Date.now() / 1000) - parseInt(lastAttemptTime, 10);
      if (elapsedTime < BLOCK_TIME_SECONDS && attempts >= 5) {
        setBlockTimeLeft(BLOCK_TIME_SECONDS - elapsedTime);
      } else {
        localStorage.removeItem('lastAttemptTime');
        localStorage.removeItem('loginAttempts');
      }
    }

    // 檢查是否已登入
    if (window.localStorage.getItem('jwt') != "None"){
      Axios().post("api/token/verify/",{
        "token":window.localStorage.getItem('jwt')
      })
      .then((res) => {
        toast.success('已登入，自動跳轉');
        setTimeout(() => {
          navigator('/alumni/manage/');
        }, 600);
      })
      .catch((err) => {
        // console.log(err);
        // 清除失效的 token
        window.localStorage.removeItem('jwt');
      });
    }
  }, []);

  useEffect(() => {
    // 倒計時更新
    if (blockTimeLeft > 0) {
      const timer = setInterval(() => {
        setBlockTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [blockTimeLeft]);

  const handleEmailContinue = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('請輸入有效的電子郵件地址');
      return;
    }
    
    // 查詢此郵箱是否註冊過，並顯示個性化歡迎訊息
    Axios()
      .get(`/basic/check-user?email=${encodeURIComponent(email)}`)
      .then((res) => {
        if (res.data.exists) {
          setWelcomeMessage(`歡迎回來，${res.data.name || '系友'}！`);
        } else {
          setWelcomeMessage('歡迎回來！');
        }
        setLoginStage('password');
      })
      .catch((err) => {
        // 即使出錯也進入密碼階段，但不顯示個性化訊息
        setWelcomeMessage('歡迎回來！');
        setLoginStage('password');
      });
  };

  const handleBackToEmail = () => {
    setLoginStage('email');
    setPassword('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (isLoading || blockTimeLeft > 0) return;

    setError('');
    setIsLoading(true);

    Axios()
      .post('/basic/login', { email, password })
      .then((res) => {
        // 處理記住我功能
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lastAttemptTime');
        window.localStorage.setItem('jwt', res.data.token);
        window.localStorage.setItem('super', res.data.is_super);

        const issuedAt = Math.floor(Date.now() / 1000);
        const validityDuration = 14400;
        const expiry = issuedAt + validityDuration;

        localStorage.setItem('issuedAt', issuedAt);
        localStorage.setItem('expiry', expiry);

        // 使用優雅的成功訊息
        toast.success('歡迎回到系友平台，尊榮系友！', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // 使用過渡動畫
        const card = document.querySelector('.login-container');
        if (card) card.classList.add('opacity-0', 'transition-opacity', 'duration-700');

        setTimeout(() => {
          navigator('/alumni/manage/');
        }, 1500);
      })
      .catch((err) => {
        setIsLoading(false);
        
        if (err.response && err.response.status === 403) {
          toast.warn("此帳號未啟用或您未繳費");
        } else {
          toast.error('帳號密碼不匹配，請再試一次。');
        }
        
        // 更新登入嘗試次數與封鎖時間
        const currentAttempts = parseInt(localStorage.getItem('loginAttempts') || '0', 10) + 1;
        localStorage.setItem('loginAttempts', currentAttempts);
        
        if (currentAttempts >= 5) {
          const currentTime = Math.floor(Date.now() / 1000);
          localStorage.setItem('lastAttemptTime', currentTime);
          setBlockTimeLeft(BLOCK_TIME_SECONDS);
        }
      });
  };

  return (
    <>
      <SEO
        main={false}
        title="系友登入"
        description="歡迎系友登入系統，上傳最新的消息讓大家了解！"
        keywords={["智慧商務", "登入", "忘記密碼", "系友會", "尊榮系友"]}
      />

      {/* 全頁分割版面：左側品牌、右側表單；手機自動堆疊 */}
      <div className="min-h-screen w-full flex flex-col lg:flex-row bg-base-100">
        {/* 左側品牌面板（深藍漸層 + 金色細節） */}
        <div className="relative lg:w-5/12 overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#1e2f6e] to-[#0f172a] text-white px-8 py-12 lg:px-12 lg:py-0 flex flex-col justify-center">
          {/* 裝飾光暈 */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="relative max-w-md mx-auto lg:mx-0">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur mb-6">
              <GraduationCap className="h-7 w-7 text-amber-300" />
            </div>
            <p className="tracking-[0.3em] text-xs text-white/60 mb-3">NKUST&nbsp;ICALUMNI</p>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold leading-tight">
              國立高雄科技大學<br />智慧商務系系友會
            </h1>
            <div className="mt-5 h-px w-20 bg-gradient-to-r from-amber-300 to-transparent" />
            <p className="mt-5 text-white/70 leading-relaxed max-w-sm">
              連結系友、共享商務資源，登入以管理您的個人資料、發布消息與職缺。
            </p>
          </div>
        </div>

        {/* 右側表單區 */}
        <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="login-container w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl font-bold text-base-content">
                {loginStage === 'email' ? '歡迎回來' : welcomeMessage || '歡迎回來'}
              </h2>
              <p className="mt-2 text-sm text-base-content/60">
                {loginStage === 'email' ? '請輸入您的電子郵件以繼續' : '請輸入您的密碼完成登入'}
              </p>
            </div>

            {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}

            {blockTimeLeft > 0 && (
              <div className="alert alert-warning mb-4">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <div className="text-sm">
                  <strong>基於安全考量，登入暫時受限。</strong>
                  <div className="mt-1">
                    請等待 <span className="font-bold">{Math.floor(blockTimeLeft / 60)}</span> 分
                    <span className="font-bold"> {blockTimeLeft % 60}</span> 秒後再試
                  </div>
                </div>
              </div>
            )}

            <form
              onSubmit={loginStage === 'password' ? handleLogin : (e) => { e.preventDefault(); handleEmailContinue(); }}
              className="space-y-5"
            >
              {loginStage === 'email' ? (
                <>
                  <div className="form-control">
                    <label htmlFor="formBasicEmail" className="label pb-1.5">
                      <span className="label-text font-medium">電子郵件 <span className="text-error">*</span></span>
                    </label>
                    <label className="input input-bordered flex items-center gap-2 focus-within:border-primary">
                      <Mail className="h-4 w-4 text-base-content/40" />
                      <input
                        id="formBasicEmail"
                        type="email"
                        placeholder="請輸入您的電子郵件"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="grow bg-transparent outline-none"
                        autoFocus
                      />
                    </label>
                    <span className="label-text-alt text-base-content/50 mt-1.5">
                      請輸入您註冊時使用的電子郵件地址
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={!email || blockTimeLeft > 0}
                  >
                    繼續
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="w-full flex items-center gap-3 rounded-xl border border-base-300 bg-base-200/50 px-4 py-3 text-left hover:border-primary transition-colors"
                  >
                    <UserCircle2 className="h-9 w-9 text-primary/70 shrink-0" />
                    <div className="min-w-0">
                      <div className="truncate font-medium text-base-content">{email}</div>
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <ArrowLeft className="h-3 w-3" /> 更換帳號
                      </div>
                    </div>
                  </button>

                  <div className="form-control">
                    <label htmlFor="formBasicPassword" className="label pb-1.5">
                      <span className="label-text font-medium">密碼 <span className="text-error">*</span></span>
                    </label>
                    <label className="input input-bordered flex items-center gap-2 focus-within:border-primary">
                      <Lock className="h-4 w-4 text-base-content/40" />
                      <input
                        id="formBasicPassword"
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="請輸入您的密碼"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="grow bg-transparent outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        aria-label="切換密碼顯示"
                        className="text-base-content/50 hover:text-primary"
                      >
                        {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </label>
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="label cursor-pointer gap-2 p-0">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm checkbox-primary"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span className="label-text">記住我</span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => navigator('/forgot')}
                    >
                      忘記密碼？
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isLoading || blockTimeLeft > 0}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        登入中...
                      </>
                    ) : (
                      '登入'
                    )}
                  </button>
                </>
              )}
            </form>

            <p className="mt-8 text-center text-xs text-base-content/40">
              © 2026 國立高雄科技大學 智慧商務系系友會
            </p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" />
    </>
  );
};

export default Login;