import React, { useEffect, useState } from 'react';
import { Form, Button, Spinner, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import Axios from 'common/Axios';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'css/user/login.css';

const BLOCK_TIME_SECONDS = 300; // 封鎖持續時間：半天（12 小時）

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);

  const navigator = useNavigate();

  useEffect(() => {
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (isLoading || blockTimeLeft > 0) return;

    setError('');
    setIsLoading(true);

    Axios()
      .post('/basic/login', { email, password })
      .then((res) => {
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lastAttemptTime');
        window.localStorage.setItem('jwt', res.data.token);
        window.localStorage.setItem('super', res.data.is_super);

        const issuedAt = Math.floor(Date.now() / 1000);
        const validityDuration = 14400;
        const expiry = issuedAt + validityDuration;

        localStorage.setItem('issuedAt', issuedAt);
        localStorage.setItem('expiry', expiry);

        toast.success('登入成功，將自動跳轉！');
        setTimeout(() => {
          navigator('/alumni/manage/');
        }, 1500);
      })
      .catch(() => {
        setIsLoading(false);
        toast.error('帳號密碼不匹配，請再試一次。');

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
      <Helmet>
        <title>智商系系友會｜登入</title>
        <meta name="description" content="歡迎尊榮智慧商務系系友登入本系統" />
      </Helmet>
      <div>
        <Container className="login-container my-5 p-4 rounded shadow">
          <Row className="justify-content-md-center">
            <Col md={6}>
              <h2 className="text-center mb-4">歡迎回來！</h2>
              <p className="text-muted text-center">請輸入您的帳號和密碼以登入</p>
              {error && <Alert variant="danger">{error}</Alert>}
              {blockTimeLeft > 0 && (
                <Alert variant="warning">
                  登入失敗次數過多，請稍後再試。剩餘時間：{Math.floor(blockTimeLeft / 60)} 分
                  {blockTimeLeft % 60} 秒
                </Alert>
              )}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formBasicEmail" className="mb-3">
                  <Form.Label>電子郵件 <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="請輸入您的電子郵件"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                  />
                  <Form.Text className="text-muted">
                    請輸入您註冊時使用的電子郵件地址。
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicPassword" className="mb-3">
                  <Form.Label>密碼 <span className="text-danger">*</span></Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={passwordVisible ? 'text' : 'password'}
                      placeholder="請輸入您的密碼"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="form-input"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      aria-label="切換密碼顯示"
                    >
                      {passwordVisible ? '隱藏' : '顯示'}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={isLoading || blockTimeLeft > 0}
                >
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      載入中...
                    </>
                  ) : (
                    '登入'
                  )}
                </Button>
              </Form>
              <Button
                variant="link"
                className="w-100 text-center"
                onClick={() => navigator('/forgot')}
              >
                忘記密碼？
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
