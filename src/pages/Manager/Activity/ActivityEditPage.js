import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill'; // 安裝 react-quill
import 'react-quill/dist/quill.snow.css';
import { CalendarClock, ArrowLeft, Save, Send } from 'lucide-react';
import { Button, Field, PageHeader, Card, Toolbar } from 'components/common/ui';

const ActivityEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    // 模擬取得活動資料
    if (id) {
      // 假資料，實際應該是從API取得
      const activity = {
        title: '活動A',
        type: '類型1',
        date: '2024-09-01',
        content: '<p>活動內容</p>',
      };
      setTitle(activity.title);
      setType(activity.type);
      setDate(activity.date);
      setContent(activity.content);
    }
  }, [id]);

  const handleSaveDraft = () => {
    // 模擬保存草稿的處理
    console.log('草稿已保存:', { title, type, date, content });
    alert('草稿已保存');
  };

  const handleSubmit = () => {
    // 模擬提交的處理
    console.log('活動已送出:', { title, type, date, content });
    alert('活動已送出');
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title="編輯活動"
        subtitle="填寫活動資訊與內容，可先保存草稿或直接送出。"
        icon={<CalendarClock className="h-5 w-5" />}
        actions={
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            回上一頁
          </Button>
        }
      />

      <form className="flex flex-col gap-6">
        <Card padding="lg">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            {/* 活動標題 */}
            <div className="md:col-span-2">
              <Field
                as="input"
                type="text"
                label="活動標題"
                placeholder="輸入標題"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* 活動類型 */}
            <Field
              as="input"
              type="text"
              label="活動類型"
              placeholder="輸入類型"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />

            {/* 活動時間 */}
            <Field
              as="input"
              type="date"
              label="活動時間"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </Card>

        {/* 活動內容 */}
        <Card padding="lg">
          <label className="mb-2 block text-sm font-medium text-base-content">
            活動內容
          </label>
          <div className="quill-admin">
            <ReactQuill
              value={content}
              onChange={setContent}
              className="bg-base-100 rounded-lg"
              style={{ minHeight: '220px' }}
            />
          </div>
        </Card>

        <Toolbar
          className="mb-0"
          right={
            <>
              <Button variant="ghost" onClick={handleBack}>
                取消
              </Button>
              <Button variant="secondary" onClick={handleSaveDraft}>
                <Save className="h-4 w-4" />
                保存草稿
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                <Send className="h-4 w-4" />
                送出
              </Button>
            </>
          }
        />
      </form>
    </div>
  );
};

export default ActivityEdit;
