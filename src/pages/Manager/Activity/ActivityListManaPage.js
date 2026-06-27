import React, { useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useRWD from 'hooks/useRWD';

const ActivityList = () => {
  const [activities] = useState([
    { id: 1, title: '活動A', type: '類型1', date: '2024-09-01' },
    { id: 2, title: '活動B', type: '類型2', date: '2024-09-05' },
  ]);
  const navigate = useNavigate();
  const rwd = useRWD();

  const handleEdit = (id) => {
    navigate(`/alumni/manage/activity/edit/${id}`);
  };

  return (
    <Container className="admin-container mt-5" style={rwd.getContainerStyle()}>
      <h2>活動列表</h2>
      {rwd.renderForDevice({
        desktop: (
          <Table striped bordered hover style={rwd.getTableStyle()}>
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
        ),
        mobile: (
          <div style={{ ...rwd.getTableStyle(), padding: '10px' }}>
            {activities.map((activity) => (
              <div key={activity.id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: '#f9f9f9'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>標題:</strong> {activity.title}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>類型:</strong> {activity.type}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>時間:</strong> {activity.date}
                </div>
                <div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEdit(activity.id)}
                    style={{ marginRight: '10px', marginBottom: '5px' }}
                  >
                    編輯
                  </Button>
                  <Button variant="danger" size="sm">
                    刪除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </Container>
  );
};

export default ActivityList;
