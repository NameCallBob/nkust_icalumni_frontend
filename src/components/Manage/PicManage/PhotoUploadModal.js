import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const PhotoUploadModal = ({ show, onHide, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = () => {
    const photoData = selectedFiles.map(file => ({
      file,
      title,
      description,
    }));
    onUpload(photoData);
    setSelectedFiles([]);
    setTitle('');
    setDescription('');
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setTitle('');
    setDescription('');
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
        <div className="preview-container">
          {selectedFiles.map((file, index) => (
            <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} key={index} className="preview-image" />
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClear}>清除</Button>
        <Button variant="primary" onClick={handleUpload}>上傳</Button>
        <Button variant="danger" onClick={onHide}>取消</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PhotoUploadModal;
