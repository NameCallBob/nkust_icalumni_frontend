import Axios from 'common/Axios';
import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
// 變更網站head
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [error, setError] = useState('');
  const navigator = useNavigate()

  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // recapture
    // if (!captchaVerified) {
    //   setError('Please verify that you are not a robot.');
    //   return;
    // }

    // Handle login logic here
    Axios().post("/basic/login" ,{
      "email":email,
      "password":password
    })
    .then((res)=> {
      window.localStorage.setItem("jwt",res.data.token)
      alert("登入成功")
      navigator("/alumni/manage/")
    } )
    .catch((err) => {
      alert("帳號密碼不匹配")
    })
  };
  useEffect(() => {
    if (window.localStorage.getItem('jwt') != "None"){
      Axios().post("api/token/verify/",{
        "token":window.localStorage.getItem('jwt')
      })
      .then((res) => {
        alert("已登入將自動跳轉！")
        navigator("/alumni/manage/")
      })
      .catch((err) => {
        console.log(err)
      })
    }
  },[])

  return (
    <>
    <Helmet>
    <title>智商系系友會｜登入</title>
    <script src="https://www.google.com/recaptcha/enterprise.js?render=6LdbOi8qAAAAAAsuFDxSve8uJCUxjL-8eY9wVpb8"></script>
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
            <br></br>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>密碼</Form.Label>
              <Form.Control
                type="password"
                placeholder="請輸入您的密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <br></br>

            <ReCAPTCHA
              sitekey="6LdbOi8qAAAAAAsuFDxSve8uJCUxjL-8eY9wVpb8"
              onChange={handleCaptchaChange}
            />

            <Button variant="primary" type="submit" className="mt-3">
              Login
            </Button>
          </Form>

          <Button variant="link" className="mt-2" onClick={() => (navigator("/forgot"))}>
            Forgot Password?
          </Button>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default Login;
