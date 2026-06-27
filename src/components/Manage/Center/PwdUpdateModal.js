import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import Axios from 'common/Axios';
import { toast } from 'react-toastify';

const PwdUpdateModal = ({ show, handleClose, onSuccess }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    length: false
  });

  // 密碼規則定義
  const passwordRules = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    length: password => password.length >= 8
  };

  // 檢查密碼是否符合所有規則
  const isPasswordValid = () => {
    return Object.values(validationErrors).every(error => !error);
  };

  // 計算密碼強度 (0-100)
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // 基本分數：長度
    strength += Math.min(password.length * 5, 40);
    
    // 加分項：字符多樣性
    if (passwordRules.uppercase.test(password)) strength += 20;
    if (passwordRules.lowercase.test(password)) strength += 20;
    if (passwordRules.number.test(password)) strength += 20;
    
    return Math.min(strength, 100);
  };

  // 取得密碼強度等級文字與顏色
  const getStrengthLevel = () => {
    if (passwordStrength === 0) return { text: '', variant: 'secondary' };
    if (passwordStrength < 40) return { text: '弱', variant: 'danger' };
    if (passwordStrength < 70) return { text: '中等', variant: 'warning' };
    return { text: '強', variant: 'success' };
  };

  // 密碼變更時，驗證規則並更新強度
  useEffect(() => {
    if (newPassword) {
      const errors = {
        uppercase: !passwordRules.uppercase.test(newPassword),
        lowercase: !passwordRules.lowercase.test(newPassword),
        number: !passwordRules.number.test(newPassword),
        length: !passwordRules.length(newPassword)
      };
      
      setValidationErrors(errors);
      setPasswordStrength(calculatePasswordStrength(newPassword));
    } else {
      setValidationErrors({
        uppercase: false,
        lowercase: false,
        number: false,
        length: false
      });
      setPasswordStrength(0);
    }
  }, [newPassword]);

  // 密碼更新處理函數
  const handlePasswordUpdate = async () => {
    // 檢查新密碼是否符合所有規則
    if (!isPasswordValid()) {
      setError('新密碼不符合密碼規則要求');
      return;
    }

    // 檢查新密碼與確認密碼是否一致
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

  // 重置表單
  const resetForm = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setError('');
    setPasswordStrength(0);
  };

  // 關閉模態框時重置表單
  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  const strengthLevel = getStrengthLevel();

  return (
    <Modal show={show} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>修改密碼</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <div className="mb-4">
          <h6 className="mb-2">密碼規則：</h6>
          <ul className="password-rules">
            <li className={validationErrors.uppercase ? "text-danger" : "text-success"}>
              {validationErrors.uppercase ? "❌" : "✅"} 至少包含一個大寫英文字母
            </li>
            <li className={validationErrors.lowercase ? "text-danger" : "text-success"}>
              {validationErrors.lowercase ? "❌" : "✅"} 至少包含一個小寫英文字母
            </li>
            <li className={validationErrors.number ? "text-danger" : "text-success"}>
              {validationErrors.number ? "❌" : "✅"} 至少包含一個數字
            </li>
            <li className={validationErrors.length ? "text-danger" : "text-success"}>
              {validationErrors.length ? "❌" : "✅"} 長度至少 8 位
            </li>
          </ul>
        </div>

        <Form>
          <Form.Group controlId="oldPassword" className="mb-3">
            <Form.Label>舊密碼</Form.Label>
            <Form.Control
              type="password"
              placeholder="請輸入目前使用的密碼"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
          
          <Form.Group controlId="newPassword" className="mb-3">
            <Form.Label>新密碼</Form.Label>
            <Form.Control
              type="password"
              placeholder="輸入符合規則的新密碼"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              isInvalid={newPassword && !isPasswordValid()}
            />
            {newPassword && (
              <div className="mt-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small>密碼強度：</small>
                  <small className={`text-${strengthLevel.variant}`}>
                    {strengthLevel.text}
                  </small>
                </div>
                <ProgressBar 
                  variant={strengthLevel.variant} 
                  now={passwordStrength} 
                  className="password-strength-meter" 
                />
              </div>
            )}
          </Form.Group>
          
          <Form.Group controlId="confirmNewPassword" className="mb-3">
            <Form.Label>確認新密碼</Form.Label>
            <Form.Control
              type="password"
              placeholder="再次輸入新密碼"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              disabled={loading}
              isInvalid={confirmNewPassword && confirmNewPassword !== newPassword}
              isValid={confirmNewPassword && confirmNewPassword === newPassword}
            />
            {confirmNewPassword && confirmNewPassword !== newPassword && (
              <Form.Text className="text-danger">
                確認密碼與新密碼不符
              </Form.Text>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose} disabled={loading}>
          取消
        </Button>
        <Button
          variant="primary"
          onClick={handlePasswordUpdate}
          disabled={
            loading || 
            !oldPassword || 
            !newPassword || 
            !confirmNewPassword || 
            !isPasswordValid() || 
            newPassword !== confirmNewPassword
          }
        >
          {loading ? <Spinner animation="border" size="sm" /> : '更新密碼'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PwdUpdateModal;