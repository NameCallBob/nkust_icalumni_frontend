import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  PageHeader,
  Toolbar,
  DataTable,
  Button,
  Field,
  Badge,
} from 'components/common/ui';

const ActivityList = () => {
  const [activities] = useState([
    { id: 1, title: '活動A', type: '類型1', date: '2024-09-01' },
    { id: 2, title: '活動B', type: '類型2', date: '2024-09-05' },
  ]);
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/alumni/manage/activity/edit/${id}`);
  };

  const columns = [
    {
      key: 'title',
      header: '標題',
      render: (row) => (
        <span className="font-medium text-base-content">{row.title}</span>
      ),
    },
    {
      key: 'type',
      header: '類型',
      render: (row) => <Badge variant="info">{row.type}</Badge>,
    },
    {
      key: 'date',
      header: '時間',
      render: (row) => (
        <span className="text-base-content/70">{row.date}</span>
      ),
    },
    {
      key: 'actions',
      header: '操作',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.id)}
          >
            <Pencil size={15} className="mr-1" />
            編輯
          </Button>
          <Button variant="error" size="sm">
            <Trash2 size={15} className="mr-1" />
            刪除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title="活動列表"
        subtitle="管理校友會活動的建立、編輯與發布"
        icon={<CalendarDays />}
        actions={
          <Button variant="primary">
            <Plus size={18} className="mr-1" />
            新增活動
          </Button>
        }
      />

      <Toolbar
        className="mt-4"
        left={
          <Field
            as="input"
            type="text"
            placeholder="搜尋活動標題..."
            className="md:w-72"
          />
        }
      />

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={activities}
          rowKey={(row) => row.id}
          empty="目前尚無活動資料"
        />
      </div>
    </div>
  );
};

export default ActivityList;
