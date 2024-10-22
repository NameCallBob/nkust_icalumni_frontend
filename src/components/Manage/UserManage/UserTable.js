import React, { useState } from 'react';
import { Table, Button, Container, Dropdown, Pagination, Alert } from 'react-bootstrap';

function UserTable({ users, handleShowModal, handleEdit, handlePaymentStatus, handleToggleActive, handleDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // 每頁顯示的筆數
  const totalPages = Math.ceil(users.length / itemsPerPage); // 總頁數

  // 計算當前頁面的顯示資料
  const currentUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 換頁功能
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 每頁顯示數量調整
  const handleItemsPerPageChange = (eventKey) => {
    setItemsPerPage(Number(eventKey));
    setCurrentPage(1); // 調整筆數後回到第一頁
  };

  return (
    <Container>
      {/* 每頁顯示筆數調整 */}
      <Dropdown onSelect={handleItemsPerPageChange} className="mb-3">
        <Dropdown.Toggle variant="secondary">每頁顯示 {itemsPerPage} 筆</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item eventKey="5">5</Dropdown.Item>
          <Dropdown.Item eventKey="10">10</Dropdown.Item>
          <Dropdown.Item eventKey="20">20</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* 資料表格 */}
      {users.length === 0 ? (
        <Alert variant="warning">目前無資料</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive className="d-none d-md-table">
            <thead>
              <tr>
                <th>級別</th>
                <th>職位</th>
                <th>姓名</th>
                <th>Email</th>
                <th>功能</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.graduate.grade}</td>
                  <td>{user.position.title}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleEdit(user.id)} // 處理編輯資料事件
                      className="me-2"
                    >
                      編輯資料
                    </Button>
                    <Button
                      variant={user.is_paid ? 'warning' : 'success'}
                      size="sm"
                      className="me-2"
                      onClick={() => handlePaymentStatus(user.id, user.is_paid)} // 處理繳費狀態切換
                    >
                      改{user.is_paid ? '未繳費' : '已繳費'}
                    </Button>
                    <Button
                      variant={user.isActive ? 'danger' : 'success'}
                      size="sm"
                      className="me-2"
                      onClick={() => handleToggleActive(user.id, user.is_active)} // 處理啟用/停用帳號
                    >
                      {user.isActive ? '停用' : '啟用'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user.id)} // 處理刪除帳號
                    >
                      刪除帳號
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* 行動裝置版本的表格 */}
          <Table striped bordered hover responsive className="d-md-none">
            <thead>
              <tr>
                <th>職位</th>
                <th>姓名</th>
                <th>功能</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.position.title}</td>
                  <td>{user.name}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleEdit(user.id)} // 處理編輯資料事件
                      className="me-2"
                    >
                      編輯
                    </Button>
                    <Button
                      variant={user.is_paid ? 'warning' : 'success'}
                      size="sm"
                      className="me-2"
                      onClick={() => handlePaymentStatus(user.id, user.is_paid)} // 處理繳費狀態切換
                    >
                      改{user.is_paid ? '未繳' : '已繳'}
                    </Button>
                    <Button
                      variant={user.isActive ? 'danger' : 'success'}
                      size="sm"
                      className="me-2"
                      onClick={() => handleToggleActive(user.id, user.isActive)} // 處理啟用/停用帳號
                    >
                      {user.isActive ? '停用' : '啟用'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* 分頁功能 */}
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
    </Container>
  );
}

export default UserTable;
