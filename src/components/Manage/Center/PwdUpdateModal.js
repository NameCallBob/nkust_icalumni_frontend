import React, { useState } from 'react';
import { Modal, Button, Form, Alert , Spinner} from 'react-bootstrap';
import Axios from 'common/Axios';
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
      const response = await Axios().post('/member/logined/update_password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });

      if (response.status === 200) {
        toast.success('密碼更改成功');
        if (onSuccess) onSuccess(response.data);
        handleClose();
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) {
          setError('新密碼與舊密碼相同');
        } else if (status === 403) {
          setError(
            '舊密碼錯誤，若忘記密碼，請登出後去登入介面的忘記密碼'
          );
        } else {
          setError(data?.message || '密碼更新失敗，請稍後再試');
        }
      } else {
        setError('網路錯誤，請稍後再試');
      }
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
              disabled={loading}
            />
          </Form.Group>
          <Form.Group controlId="newPassword">
            <Form.Label>新密碼</Form.Label>
            <Form.Control
              type="password"
              placeholder="輸入新密碼"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
          <Form.Group controlId="confirmNewPassword">
            <Form.Label>確認新密碼</Form.Label>
            <Form.Control
              type="password"
              placeholder="再次輸入新密碼"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          取消
        </Button>
        <Button
          variant="primary"
          onClick={handlePasswordUpdate}
          disabled={loading || !oldPassword || !newPassword || !confirmNewPassword}
        >
          {loading ? <Spinner animation="border" size="sm" /> : '更新密碼'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PwdUpdateModal;
