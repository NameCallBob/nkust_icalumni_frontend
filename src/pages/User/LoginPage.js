import React, { useEffect, useState } from 'react';
import { Form, Button, Spinner, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import Axios from 'common/Axios';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'css/user/login.css';
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
        document.querySelector('.login-container').classList.add('fade-out');
        
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
      <div className="login-page-wrapper">
        <div className="login-background-overlay"></div>
        <Container className="login-container my-5 rounded shadow">
          <Row className="justify-content-md-center">
            <Col md={8} lg={7}>
              <div className="text-center mb-5">
                <h1 className="elite-title">
                  {loginStage === 'email' ? '歡迎回來~' : welcomeMessage}
                </h1>
                <p className="text-muted subtitle">
                  {loginStage === 'email' 
                    ? '請輸入您的電子郵件以繼續' 
                    : '請輸入您的密碼完成登入'}
                </p>
              </div>
              
              {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
              
              {blockTimeLeft > 0 && (
                <Alert variant="warning" className="elegant-alert mb-4">
                  <div className="d-flex align-items-center">
                    <div className="alert-icon me-3">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div>
                      <strong>基於安全考量，登入暫時受限。</strong>
                      <div className="countdown-timer">
                        請等待 <span className="time-number">{Math.floor(blockTimeLeft / 60)}</span> 分 
                        <span className="time-number">{blockTimeLeft % 60}</span> 秒後再試
                      </div>
                    </div>
                  </div>
                </Alert>
              )}
              
              <Form onSubmit={loginStage === 'password' ? handleLogin : (e) => {e.preventDefault(); handleEmailContinue();}}>
                {loginStage === 'email' ? (
                  <>
                    <Form.Group controlId="formBasicEmail" className="mb-4">
                      <Form.Label className="elegant-label">電子郵件 <span className="text-accent">*</span></Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="請輸入您的電子郵件"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input elegant-input"
                        autoFocus
                      />
                      <Form.Text className="text-muted mt-2">
                        請輸入您註冊時使用的電子郵件地址
                      </Form.Text>
                    </Form.Group>
                    
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 mb-4 elegant-button"
                      disabled={!email || blockTimeLeft > 0}
                    >
                      繼續
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="user-email-display mb-4" onClick={handleBackToEmail}>
                      <div className="d-flex align-items-center">
                        <div className="email-icon">
                          <i className="fas fa-user-circle"></i>
                        </div>
                        <div className="ms-3">
                          <div className="email-text">{email}</div>
                          <Button variant="link" className="edit-button p-0">
                            <small>編輯</small>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Form.Group controlId="formBasicPassword" className="mb-4">
                      <Form.Label className="elegant-label">密碼 <span className="text-accent">*</span></Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={passwordVisible ? 'text' : 'password'}
                          placeholder="請輸入您的密碼"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="form-input elegant-input"
                          autoFocus
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          aria-label="切換密碼顯示"
                          className="elegant-toggle-button"
                        >
                          {passwordVisible ? '隱藏' : '顯示'}
                        </Button>
                      </InputGroup>
                    </Form.Group>
                    
                    <Form.Group controlId="formBasicCheckbox" className="mb-4 d-flex justify-content-between align-items-center">
                      <Form.Check 
                        type="checkbox" 
                        label="記住我" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="elegant-checkbox"
                      />
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none forgot-password"
                        onClick={() => navigator('/forgot')}
                      >
                        忘記密碼？
                      </Button>
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 mb-4 elegant-button"
                      disabled={isLoading || blockTimeLeft > 0}
                    >
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          登入中...
                        </>
                      ) : (
                        '登入'
                      )}
                    </Button>
                  </>
                )}
              </Form>
            </Col>
          </Row>
        </Container>

      </div>
      
      <ToastContainer position="top-center" />
    </>
  );
};

export default Login;