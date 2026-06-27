import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import AppModal from 'components/common/AppModal';
import { Button } from 'components/common/ui';

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
    >
      {errorMessage && (
        <div className="alert alert-error mb-3">{errorMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-control w-full mb-3">
          <label className="label pb-1" htmlFor="formNewPassword">
            <span className="label-text font-medium text-base-content">新密碼</span>
          </label>
          <input
            id="formNewPassword"
            type="password"
            className="input input-bordered w-full"
            placeholder="輸入新密碼"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="form-control w-full mb-3">
          <label className="label pb-1" htmlFor="formConfirmPassword">
            <span className="label-text font-medium text-base-content">重複新密碼</span>
          </label>
          <input
            id="formConfirmPassword"
            type="password"
            className="input input-bordered w-full"
            placeholder="再次輸入新密碼"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button variant="primary" type="submit" loading={loading} disabled={loading}>
          修改密碼
        </Button>
      </form>
    </AppModal>
  );
}

export default ChangePasswordModal;
