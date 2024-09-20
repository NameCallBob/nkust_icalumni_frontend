import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';

const ResetPassword = ({ email }) => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code || !newPassword || !confirmPassword) {
      setError('所有欄位都需要填寫');
    } else if (newPassword !== confirmPassword) {
      setError('新密碼與確認密碼不一致');
    } else {
      setError('');
      // 在這裡可以進行密碼重置請求的處理
      console.log('密碼已重置');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center my-5">
        <Col md={6}>
          <h2 className="mb-4">重設密碼</h2>
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group controlId="formCode">
              <Form.Label>驗證碼</Form.Label>
              <Form.Control
                type="text"
                placeholder="輸入驗證碼"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword" className="mt-3">
              <Form.Label>新密碼</Form.Label>
              <Form.Control
                type="password"
                placeholder="輸入新密碼"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword" className="mt-3">
              <Form.Label>確認新密碼</Form.Label>
              <Form.Control
                type="password"
                placeholder="再次輸入新密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              重設密碼
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;