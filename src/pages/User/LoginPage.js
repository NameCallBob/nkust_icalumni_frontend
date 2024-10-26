import Axios from 'common/Axios';
import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [error, setError] = useState('');
  const navigator = useNavigate();

  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    Axios()
      .post("/basic/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        window.localStorage.setItem("jwt", res.data.token);
        toast.success("登入成功，將自動跳轉！");
        setTimeout(() => {
          navigator("/alumni/manage/");
        }, 1500);  // 1.5 秒後自動跳轉
      })
      .catch(() => {
        toast.error("帳號密碼不匹配");
      });
  };

  useEffect(() => {
    if (window.localStorage.getItem('jwt') !== "None") {
      Axios().post("api/token/verify/", {
        token: window.localStorage.getItem('jwt'),
      })
      .then(() => {
        toast.info("已登入，將自動跳轉！");
        setTimeout(() => {
          navigator("/alumni/manage/");
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, [navigator]);

  return (
    <>
      <Helmet>
        <title>智商系系友會｜登入</title>
        <meta name="description" content="歡迎尊榮智慧商務系系友登入本系統" />
      </Helmet>
      <Container className='my-5'>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h2 className="text-center">登入</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>電子郵件</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="請輸入您的電子郵件"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <br />
              <Form.Group controlId="formBasicPassword">
                <Form.Label>密碼</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="請輸入您的密碼"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <br />
              <ReCAPTCHA
                sitekey={"6LeMb2kqAAAAAPnRT3S6K_GKgPQi7hrqx2OzTGav"}
                onChange={handleCaptchaChange}
              />
              <Button variant="primary" type="submit" className="mt-3">
                登入
              </Button>
            </Form>
            <Button variant="link" className="mt-2" onClick={() => navigator("/forgot")}>
              忘記密碼
            </Button>
          </Col>
        </Row>
      </Container>
      <ToastContainer /> {/* ToastContainer 用來顯示通知 */}
    </>
  );
};

export default Login;
