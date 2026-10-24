import React, { useState } from 'react';
import {
  Pencil,
  Trash2,
  KeyRound,
  Power,
  PowerOff,
  Banknote,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
} from 'lucide-react';
import AppModal from 'components/common/AppModal';
import { Button, Toolbar, DataTable, Badge, EmptyState } from 'components/common/ui';

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

  const columns = [
    {
      key: 'grade',
      header: '級別',
      render: (user) => (
        <span className="font-medium text-base-content/80">{user.graduate?.grade || '—'}</span>
      ),
    },
    {
      key: 'position',
      header: '職位',
      render: (user) => user.position?.title || '—',
    },
    {
      key: 'name',
      header: '姓名',
      render: (user) => <span className="font-semibold text-base-content">{user.name}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (user) => <span className="text-base-content/70 break-all">{user.email}</span>,
    },
    {
      key: 'status',
      header: '狀態',
      render: (user) => (
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={user.isActive ? 'success' : 'neutral'}>
            {user.isActive ? '已啟用' : '已停用'}
          </Badge>
          <Badge variant={user.is_paid ? 'primary' : 'warning'}>
            {user.is_paid ? '已付款' : '未付款'}
          </Badge>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '功能權限',
      className: 'text-right',
      render: (user) => (
        <div className="flex flex-wrap gap-1.5 md:justify-end">
          <Button
            size="sm"
            variant="outline"
            className="btn-square"
            onClick={() => handleEdit(user.id)}
            title="編輯使用者資訊"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={user.is_paid ? 'secondary' : 'success'}
            className="btn-square"
            onClick={() => handlePaymentStatus(user.id, user.is_paid)}
            title={user.is_paid ? '標記為未付款' : '標記為已付款'}
          >
            <Banknote className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={user.isActive ? 'secondary' : 'success'}
            className="btn-square"
            onClick={() => handleToggleActive(user.id, user.isActive)}
            title={user.isActive ? '停用使用者' : '啟用使用者'}
          >
            {user.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="btn-square"
            onClick={() => handlePassword(user.id)}
            title="重設密碼"
          >
            <KeyRound className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="error"
            className="btn-square"
            onClick={() => confirmDelete(user)}
            title="刪除使用者"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <Toolbar
        left={
          <span className="text-sm text-base-content/60">
            共 <span className="font-semibold text-base-content">{users.length}</span> 位使用者
          </span>
        }
        right={
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-outline btn-primary btn-sm gap-1 normal-case">
              每頁顯示 {itemsPerPage} 筆
              <ChevronDown className="h-4 w-4" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box z-10 w-32 border border-base-300/70"
            >
              <li><button type="button" onClick={() => handleItemsPerPageChange('5')}>5 筆</button></li>
              <li><button type="button" onClick={() => handleItemsPerPageChange('10')}>10 筆</button></li>
              <li><button type="button" onClick={() => handleItemsPerPageChange('20')}>20 筆</button></li>
            </ul>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={currentUsers}
        rowKey={(user) => user.id}
        empty={
          <EmptyState
            icon={<Users className="h-8 w-8" />}
            title="目前無資料"
            description="尚未有任何使用者資料。"
          />
        }
      />

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join shadow-sm">
            <button
              type="button"
              className="join-item btn btn-sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                type="button"
                key={index + 1}
                className={`join-item btn btn-sm ${index + 1 === currentPage ? 'btn-primary' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              type="button"
              className="join-item btn btn-sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
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
