import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';

function ChangePasswordModal({ showModal, handleClose, handleChangePassword }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 處理新密碼和確認密碼輸入
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (newPassword !== confirmPassword) {
      setErrorMessage('新密碼與重複新密碼不一致');
      return;
    }

    setLoading(true);

    // 調用父元件的處理密碼變更函數
    const result = await handleChangePassword(newPassword);

    setLoading(false);

    if (result.success) {
      alert('密碼修改成功');
      handleClose(); // 密碼修改成功後關閉 Modal
    } else {
      setErrorMessage(result.message || '密碼修改失敗');
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>修改密碼</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formNewPassword">
            <Form.Label>新密碼</Form.Label>
            <Form.Control
              type="password"
              placeholder="輸入新密碼"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>重複新密碼</Form.Label>
            <Form.Control
              type="password"
              placeholder="再次輸入新密碼"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : '修改密碼'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ChangePasswordModal;
