import React, { useState } from 'react';
import { FaEdit, FaTrash, FaKey, FaToggleOn, FaToggleOff, FaMoneyBillWave } from 'react-icons/fa';
import AppModal from 'components/common/AppModal';
import { Button } from 'components/common/ui';

function UserTable({ users, handleShowModal, handleEdit, handlePaymentStatus, handleToggleActive, handleDelete, handlePassword }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const currentUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (eventKey) => {
    setItemsPerPage(Number(eventKey));
    setCurrentPage(1);
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      handleDelete(selectedUser.id);
      setShowConfirm(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="w-full px-0">
      <div className="flex justify-between items-center mb-3">
        {/* 每頁顯示筆數下拉選單 */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-secondary btn-sm">
            每頁顯示 {itemsPerPage} 筆
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box z-10 w-32">
            <li><button type="button" onClick={() => handleItemsPerPageChange('5')}>5</button></li>
            <li><button type="button" onClick={() => handleItemsPerPageChange('10')}>10</button></li>
            <li><button type="button" onClick={() => handleItemsPerPageChange('20')}>20</button></li>
          </ul>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="alert alert-warning">目前無資料</div>
      ) : (
        <div className="table-container">
          <div className="overflow-x-auto">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>級別</th>
                  <th>職位</th>
                  <th>姓名</th>
                  <th>Email</th>
                  <th>功能權限</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover">
                    <td>{user.graduate?.grade}</td>
                    <td>{user.position?.title}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          className="btn btn-info btn-sm"
                          onClick={() => handleEdit(user.id)}
                          title="編輯使用者資訊"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${user.is_paid ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => handlePaymentStatus(user.id, user.is_paid)}
                          title={user.is_paid ? '標記為未付款' : '標記為已付款'}
                        >
                          <FaMoneyBillWave />
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${user.isActive ? 'btn-error' : 'btn-success'}`}
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                          title={user.isActive ? '停用使用者' : '啟用使用者'}
                        >
                          {user.isActive ? <FaToggleOff /> : <FaToggleOn />}
                        </button>
                        <button
                          type="button"
                          className="btn btn-warning btn-sm"
                          onClick={() => handlePassword(user.id)}
                          title="重設密碼"
                        >
                          <FaKey />
                        </button>
                        <button
                          type="button"
                          className="btn btn-error btn-sm"
                          onClick={() => confirmDelete(user)}
                          title="刪除使用者"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-3">
          <div className="join">
            <button
              type="button"
              className="join-item btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              «
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                type="button"
                key={index + 1}
                className={`join-item btn ${index + 1 === currentPage ? 'btn-active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              type="button"
              className="join-item btn"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}

      <AppModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        title="確認刪除"
        size="md"
        variant="admin"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>
              取消
            </Button>
            <Button variant="error" onClick={handleConfirmDelete}>
              確認刪除
            </Button>
          </>
        }
      >
        您確定要刪除使用者 <strong>{selectedUser?.name}</strong> 嗎？此操作無法恢復。
      </AppModal>
    </div>
  );
}

export default UserTable;
