import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill'; // 安裝 react-quill
import 'react-quill/dist/quill.snow.css';

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
    <div className="container mt-5">
      <h2>編輯活動</h2>
      <Form>
        <Form.Group controlId="formTitle">
          <Form.Label>活動標題</Form.Label>
          <Form.Control
            type="text"
            placeholder="輸入標題"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formType">
          <Form.Label>活動類型</Form.Label>
          <Form.Control
            type="text"
            placeholder="輸入類型"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formDate">
          <Form.Label>活動時間</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formContent">
          <Form.Label>活動內容</Form.Label>
          <ReactQuill value={content} onChange={setContent} />
        </Form.Group>

        <Button variant="secondary" onClick={handleSaveDraft} className="mr-2">
          保存草稿
        </Button>
        <Button variant="primary" onClick={handleSubmit} className="mr-2">
          送出
        </Button>
        <Button variant="light" onClick={handleBack}>
          回上一頁
        </Button>
      </Form>
    </div>
  );
};

export default ActivityEdit;
