import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'components/common/ui';
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
    <div className="admin-container container mx-auto px-4 mt-5" style={rwd.getContainerStyle()}>
      <h2 className="text-2xl font-bold mb-3">活動列表</h2>
      {rwd.renderForDevice({
        desktop: (
          <table className="table table-zebra w-full" style={rwd.getTableStyle()}>
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
                    <Button variant="error" size="sm">
                      刪除
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ),
        mobile: (
          <div style={{ ...rwd.getTableStyle(), padding: '10px' }}>
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="card card-bordered bg-base-200 mb-3"
              >
                <div className="card-body p-4">
                  <div className="mb-2">
                    <strong>標題:</strong> {activity.title}
                  </div>
                  <div className="mb-2">
                    <strong>類型:</strong> {activity.type}
                  </div>
                  <div className="mb-4">
                    <strong>時間:</strong> {activity.date}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEdit(activity.id)}
                    >
                      編輯
                    </Button>
                    <Button variant="error" size="sm">
                      刪除
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  );
};

export default ActivityList;
