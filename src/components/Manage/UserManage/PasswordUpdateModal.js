import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import AppModal from 'components/common/AppModal';
import { Button, Field } from 'components/common/ui';

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
    <AppModal
      show={showModal}
      onHide={handleClose}
      title="修改密碼"
      icon={<KeyRound size={20} />}
      size="sm"
      variant="admin"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={handleClose}>
            取消
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="passwordUpdateForm"
            loading={loading}
            disabled={loading}
          >
            修改密碼
          </Button>
        </>
      }
    >
      {errorMessage && (
        <div className="alert alert-error mb-4">{errorMessage}</div>
      )}
      <form id="passwordUpdateForm" onSubmit={handleSubmit}>
        <Field
          as="input"
          id="formNewPassword"
          label="新密碼"
          type="password"
          placeholder="輸入新密碼"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Field
          as="input"
          id="formConfirmPassword"
          label="重複新密碼"
          type="password"
          placeholder="再次輸入新密碼"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </form>
    </AppModal>
  );
}

export default ChangePasswordModal;
