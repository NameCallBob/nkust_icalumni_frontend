import React from 'react';
import { Table, Image, Button } from 'react-bootstrap';

function MemberTable({ members, togglePaymentStatus, onEditMember }) {
  return (
    <Table striped bordered hover responsive className="text-center">
      <thead>
        <tr>
          <th>照片</th>
          <th>姓名</th>
          <th>職位</th>
          <th>畢業學校</th>
          <th>繳費狀態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            <td>
              <Image src={member.photo} rounded fluid style={{ width: '50px', height: '50px' }} />
            </td>
            <td>{member.name}</td>
            <td>{member.position.title}</td>
            <td>
              {member.graduate.school} - {member.graduate.grade}
            </td>
            <td>{member.is_paid ? '已繳費' : '未繳費'}</td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => togglePaymentStatus(member.id)}
              >
                {member.is_paid ? '標記為未繳費' : '標記為已繳費'}
              </Button>
              <Button
                variant="outline-success"
                size="sm"
                className="ms-2"
                onClick={() => onEditMember(member)}
              >
                編輯
              </Button>
              <Button variant="outline-danger" size="sm" className="ms-2">
                刪除
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default MemberTable;
