import React, { useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ActivityList = () => {
  const [activities] = useState([
    { id: 1, title: '活動A', type: '類型1', date: '2024-09-01' },
    { id: 2, title: '活動B', type: '類型2', date: '2024-09-05' },
  ]);
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/alumni/manage/activity/edit/${id}`);
  };

  return (
    <Container className="mt-5">
      <h2>活動列表</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>標題</th>
            <th>類型</th>
            <th>時間</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td>{activity.title}</td>
              <td>{activity.type}</td>
              <td>{activity.date}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEdit(activity.id)}
                >
                  編輯
                </Button>{' '}
                <Button variant="danger" size="sm">
                  刪除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ActivityList;
