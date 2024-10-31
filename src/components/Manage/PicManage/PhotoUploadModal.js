import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Axios from 'common/Axios';
import 'react-toastify/dist/ReactToastify.css';

const PhotoUploadModal = ({ show, onHide, onUpload, type }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [base64Files, setBase64Files] = useState([]);
  const [loading, setLoading] = useState(false); // 新增 loading 狀態

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    convertFilesToBase64(files);
  };

  const convertFilesToBase64 = (files) => {
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    });

    Promise.all(promises).then((base64Data) => {
      setBase64Files(base64Data);
    });
  };

  const handleUpload = async () => {
    let apiname;
    if (!base64Files.length) {
      toast.error("請選擇要上傳的照片");
      return;
    }
    if (type === "自身照片") {
      apiname = "/picture/self-images/new/";
    } else if (type === "公司照片") {
      apiname = "/picture/company-images/new/";
    }
    setLoading(true); // 開始上傳時設定 loading 為 true
    try {
      const uploadPromises = base64Files.map((base64, index) => {
        const photoData = {
          image: base64,
          title,
          description,
          "active": true,
        };
        return Axios().post(apiname, photoData);
      });

      await Promise.all(uploadPromises);
      toast.success("照片上傳成功！");
      onUpload(); // 呼叫上層的刷新方法
      handleClear(); // 清空欄位
      onHide(); // 關閉 Modal
    } catch (error) {
      toast.error("照片上傳失敗，請稍後再試");
    } finally {
      setLoading(false); // 上傳完成後設定 loading 為 false
    }
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setTitle('');
    setDescription('');
    setBase64Files([]);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>新增照片</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formTitle" className="mb-3">
          <Form.Label>標題</Form.Label>
          <Form.Control
            type="text"
            placeholder="請輸入照片標題"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>描述</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="請輸入照片描述"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formFileMultiple" className="mb-3">
          <Form.Label>拖曳或選擇上傳照片</Form.Label>
          <Form.Control type="file" multiple onChange={handleFileChange} />
        </Form.Group>
        <div style={previewContainerStyle}>
          {selectedFiles.map((file, index) => (
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index}`}
              key={index}
              style={previewImageStyle}
            />
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClear} disabled={loading}>清除</Button>
        <Button variant="primary" onClick={handleUpload} disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              上傳中...
            </>
          ) : (
            "上傳"
          )}
        </Button>
        <Button variant="danger" onClick={onHide} disabled={loading}>取消</Button>
      </Modal.Footer>
    </Modal>
  );
};

// 內嵌的 CSS 樣式
const previewContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  justifyContent: 'center',
};

const previewImageStyle = {
  maxWidth: '100%',   // 限制圖片寬度為容器寬度
  maxHeight: '200px', // 限制圖片高度，避免過高
  objectFit: 'cover', // 保持圖片比例填充
  borderRadius: '8px',
  marginTop: '10px',
};

export default PhotoUploadModal;
