import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import Axios from 'common/Axios';
const ForgotPassword = ({ onNext }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('請輸入您的電子郵件');
    } else {
      setError('');
      onNext(email); // 移動到下一步，並傳遞電子郵件
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center my-5">
        <Col md={6}>
          <h2 className="mb-4">忘記密碼</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>電子郵件</Form.Label>
              <Form.Control
                type="email"
                placeholder="輸入您的電子郵件"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              下一步
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
