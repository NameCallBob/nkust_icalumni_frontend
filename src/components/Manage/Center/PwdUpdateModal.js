import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';
import { toast } from 'react-toastify';

const PwdUpdateModal = ({ show, handleClose, onSuccess }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmNewPassword) {
      setError('新密碼與確認密碼不符');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 請根據實際的 API 路徑更新
      const response = await Axios().post('/member/logined/update_password/', {
        "old_password":oldPassword,
        "new_password":newPassword,
      });

      if (response.status === 200) {
        toast.success("密碼更改成功")
        handleClose();
      }
    } catch (err) {
        if (err.response.status === 400){
            toast.error("新密碼與舊密碼相同");
        }
        else if (err.response.status === 403){
            toast.error("舊密碼錯誤，若忘記密碼，請登出後去登入介面的忘記密碼");
        }
    //   setError('密碼更新失敗，請檢查您的舊密碼');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>修改密碼</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group controlId="oldPassword">
            <Form.Label>舊密碼</Form.Label>
            <Form.Control
              type="password"
              placeholder="輸入舊密碼"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="newPassword">
            <Form.Label>新密碼</Form.Label>
            <Form.Control
              type="password"
              placeholder="輸入新密碼"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="confirmNewPassword">
            <Form.Label>確認新密碼</Form.Label>
            <Form.Control
              type="password"
              placeholder="再次輸入新密碼"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          取消
        </Button>
        <Button variant="primary" onClick={handlePasswordUpdate} disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner></LoadingSpinner>
            </>
          ) : (
            '更新密碼'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PwdUpdateModal;
