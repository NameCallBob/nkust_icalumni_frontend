import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
// 變更網站head
import { Helmet } from 'react-helmet';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [error, setError] = useState('');


  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      setError('Please verify that you are not a robot.');
      return;
    }
    // Handle login logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <>
    <Helmet>
    <title>智商系系友會｜登入</title>
    <meta name="description" content="This is the home page of my website." />
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

          <Button variant="link" className="mt-2" onClick={() => console.log('Forgot password clicked')}>
            Forgot Password?
          </Button>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default Login;
