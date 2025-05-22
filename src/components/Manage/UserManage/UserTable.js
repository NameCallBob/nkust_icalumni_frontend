import React, { useState } from 'react';
import { Table, Button, Container, Dropdown, Pagination, Alert, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaKey, FaToggleOn, FaToggleOff, FaMoneyBillWave } from 'react-icons/fa';

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
    <Container>
      <Dropdown onSelect={handleItemsPerPageChange} className="mb-3">
        <Dropdown.Toggle variant="secondary">每頁顯示 {itemsPerPage} 筆</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item eventKey="5">5</Dropdown.Item>
          <Dropdown.Item eventKey="10">10</Dropdown.Item>
          <Dropdown.Item eventKey="20">20</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {users.length === 0 ? (
        <Alert variant="warning">目前無資料</Alert>
      ) : (
        <>
          {/* 桌面版表格 */}
          <Table striped bordered hover className="d-none d-md-table">
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
                <tr key={user.id}>
                  <td>{user.graduate?.grade}</td>
                  <td>{user.position?.title}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleEdit(user.id)}
                      className="me-2"
                      title="編輯使用者資訊"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant={user.is_paid ? 'warning' : 'success'}
                      size="sm"
                      className="me-2"
                      onClick={() => handlePaymentStatus(user.id, user.is_paid)}
                      title={user.is_paid ? '標記為未付款' : '標記為已付款'}
                    >
                      <FaMoneyBillWave />
                    </Button>
                    <Button
                      variant={user.isActive ? 'danger' : 'success'}
                      size="sm"
                      className="me-2"
                      onClick={() => handleToggleActive(user.id, user.isActive)}
                      title={user.isActive ? '停用使用者' : '啟用使用者'}
                    >
                      {user.isActive ? <FaToggleOff /> : <FaToggleOn />}
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handlePassword(user.id)}
                      className="me-2"
                      title="重設密碼"
                    >
                      <FaKey />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => confirmDelete(user)}
                      className="me-2"
                      title="刪除使用者"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* 行動版表格 */}
          <div className="table-responsive">
            <Table striped bordered hover responsive className="d-md-none">
              <thead>
                <tr>
                  <th>級別</th>
                  <th>職位</th>
                  <th>姓名</th>
                  <th>功能權限</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.graduate?.grade}</td>
                    <td>{user.position?.title}</td>
                    <td>{user.name}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleEdit(user.id)}
                        className="me-2"
                        title="編輯使用者資訊"
                      >
                        <FaEdit />&nbsp;編輯
                      </Button>
                      <Button
                        variant={user.is_paid ? 'warning' : 'success'}
                        size="sm"
                        className="me-2"
                        onClick={() => handlePaymentStatus(user.id, user.is_paid)}
                        title={user.is_paid ? '標記為未付款' : '標記為已付款'}
                      >
                        <FaMoneyBillWave />
                        &nbsp;付款？
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
      {/* 依照資料進行分頁 */}
      <Pagination>
        {[...Array(totalPages).keys()].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* 刪除確認對話框 */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>確認刪除</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          您確定要刪除使用者 <strong>{selectedUser?.name}</strong> 嗎？ 此操作無法恢復。
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            取消
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            確認刪除
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default UserTable;
