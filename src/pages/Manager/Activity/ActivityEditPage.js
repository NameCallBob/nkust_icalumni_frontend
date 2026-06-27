import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill'; // 安裝 react-quill
import 'react-quill/dist/quill.snow.css';
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
      <h2 style={{ marginBottom: rwd.isMobile ? '20px' : '30px' }}>編輯活動</h2>
      <Form style={{
        padding: rwd.isMobile ? '15px' : '0',
        display: 'flex',
        flexDirection: 'column',
        gap: rwd.isMobile ? '15px' : '20px'
      }}>
        <Form.Group controlId="formTitle" style={{
          marginBottom: rwd.isMobile ? '10px' : '15px'
        }}>
          <Form.Label>活動標題</Form.Label>
          <Form.Control
            type="text"
            placeholder="輸入標題"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              fontSize: rwd.isMobile ? '14px' : '16px',
              padding: rwd.isMobile ? '8px 12px' : '10px 15px'
            }}
          />
        </Form.Group>

        <Form.Group controlId="formType" style={{
          marginBottom: rwd.isMobile ? '10px' : '15px'
        }}>
          <Form.Label>活動類型</Form.Label>
          <Form.Control
            type="text"
            placeholder="輸入類型"
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              fontSize: rwd.isMobile ? '14px' : '16px',
              padding: rwd.isMobile ? '8px 12px' : '10px 15px'
            }}
          />
        </Form.Group>

        <Form.Group controlId="formDate" style={{
          marginBottom: rwd.isMobile ? '10px' : '15px'
        }}>
          <Form.Label>活動時間</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              fontSize: rwd.isMobile ? '14px' : '16px',
              padding: rwd.isMobile ? '8px 12px' : '10px 15px'
            }}
          />
        </Form.Group>

        <Form.Group controlId="formContent" style={{
          marginBottom: rwd.isMobile ? '15px' : '20px'
        }}>
          <Form.Label>活動內容</Form.Label>
          <div style={{
            minHeight: rwd.isMobile ? '200px' : '300px'
          }}>
            <ReactQuill
              value={content}
              onChange={setContent}
              style={{
                height: rwd.isMobile ? '150px' : '250px'
              }}
            />
          </div>
        </Form.Group>

        <div style={{
          display: 'flex',
          flexDirection: rwd.isMobile ? 'column' : 'row',
          gap: rwd.isMobile ? '10px' : '15px',
          marginTop: rwd.isMobile ? '20px' : '30px',
          justifyContent: rwd.isMobile ? 'center' : 'flex-start'
        }}>
          <Button
            variant="secondary"
            onClick={handleSaveDraft}
            style={{
              ...rwd.getButtonStyle(),
              width: rwd.isMobile ? '100%' : 'auto'
            }}
          >
            保存草稿
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            style={{
              ...rwd.getButtonStyle(),
              width: rwd.isMobile ? '100%' : 'auto'
            }}
          >
            送出
          </Button>
          <Button
            variant="light"
            onClick={handleBack}
            style={{
              ...rwd.getButtonStyle(),
              width: rwd.isMobile ? '100%' : 'auto'
            }}
          >
            回上一頁
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ActivityEdit;
