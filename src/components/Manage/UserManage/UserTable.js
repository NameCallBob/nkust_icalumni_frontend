import React from 'react';
import { Table, Button , Container } from 'react-bootstrap';
 
function UserTable({ users, handleShowModal }) {
  return (
    <Container>
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>職位</th>
          <th>姓名</th>
          <th>Gmail</th>
          <th>是否繳費</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.position?.title}</td>
            <td>{user.name}</td>
            <td>{user.gmail}</td>
            <td>{user.is_paid ? '是' : '否'}</td>
            <td>
              <Button
                variant="info"
                size="sm"
                onClick={() => (user)}
                className="me-2"
              >
                修改資料
              </Button>
              <Button variant="danger" size="sm">
                停用帳號
              </Button>
              <Button variant="danger" size="sm">
                // true:改為未繳費，false
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    </Container>
  );
}

export default UserTable;
