import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill'; // 安裝 react-quill
import 'react-quill/dist/quill.snow.css';
import { Button, Field } from 'components/common/ui';
import useRWD from 'hooks/useRWD';

const ActivityEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const rwd = useRWD();

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
    <div style={rwd.getContainerStyle()}>
      <h2
        className="text-2xl font-bold text-base-content"
        style={{ marginBottom: rwd.isMobile ? '20px' : '30px' }}
      >
        編輯活動
      </h2>
      <form
        className="flex flex-col"
        style={{
          padding: rwd.isMobile ? '15px' : '0',
          gap: rwd.isMobile ? '15px' : '20px',
        }}
      >
        {/* 活動標題 */}
        <Field
          as="input"
          type="text"
          label="活動標題"
          placeholder="輸入標題"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

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

        {/* 活動內容 */}
        <div className="form-control w-full mb-4">
          <label className="label pb-1">
            <span className="label-text font-medium text-base-content">活動內容</span>
          </label>
          <div
            style={{
              minHeight: rwd.isMobile ? '200px' : '300px',
            }}
          >
            <ReactQuill
              value={content}
              onChange={setContent}
              style={{
                height: rwd.isMobile ? '150px' : '250px',
              }}
            />
          </div>
        </div>

        <div
          className="flex"
          style={{
            flexDirection: rwd.isMobile ? 'column' : 'row',
            gap: rwd.isMobile ? '10px' : '15px',
            marginTop: rwd.isMobile ? '20px' : '30px',
            justifyContent: rwd.isMobile ? 'center' : 'flex-start',
          }}
        >
          <Button
            variant="secondary"
            onClick={handleSaveDraft}
            className={rwd.isMobile ? 'w-full' : ''}
          >
            保存草稿
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className={rwd.isMobile ? 'w-full' : ''}
          >
            送出
          </Button>
          <Button
            variant="ghost"
            onClick={handleBack}
            className={rwd.isMobile ? 'w-full' : ''}
          >
            回上一頁
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ActivityEdit;
