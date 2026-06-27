import React, { useState, useRef, useCallback } from 'react';
import { Modal, Button, Form, Alert, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Axios from 'common/Axios';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from 'components/LoadingSpinner';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

const PhotoUploadModal = ({ show, onHide, onUpload, type }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [base64Files, setBase64Files] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

  const validateFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('只允許上傳 JPG、PNG 或 GIF 格式的圖片');
        return false;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        setError(`檔案 ${file.name} 太大，請上傳小於 5MB 的圖片`);
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    if (validateFiles(files)) {
      setSelectedFiles(files);
      convertFilesToBase64(files);
    }
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

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      if (validateFiles(files)) {
        setSelectedFiles(files);
        convertFilesToBase64(files);
      }
    }
  }, []);

  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    const newBase64Files = [...base64Files];
    newBase64Files.splice(index, 1);
    setBase64Files(newBase64Files);
  };

  const handleUpload = async () => {
    let apiname;
    
    if (!title.trim()) {
      setError("請填寫照片標題");
      return;
    }
    
    if (!base64Files.length) {
      setError("請選擇要上傳的照片");
      return;
    }
    
    if (type === "自身照片") {
      apiname = "/picture/self-images/new/";
    } else if (type === "公司照片") {
      apiname = "/picture/company-images/new/";
    }
    
    setLoading(true);
    setUploadProgress(0);
    setError('');
    
    try {
      const total = base64Files.length;
      let completed = 0;
      
      const uploadPromises = base64Files.map((base64, index) => {
        const photoData = {
          image: base64,
          title,
          description,
          "active": true,
        };
        
        return Axios().post(apiname, photoData)
          .then(response => {
            completed++;
            setUploadProgress(Math.round((completed / total) * 100));
            return response;
          });
      });

      await Promise.all(uploadPromises);
      toast.success("照片上傳成功！");
      onUpload();
      handleClear();
      onHide();
    } catch (error) {
      toast.error("照片上傳失敗，請稍後再試");
      setError("上傳過程中發生錯誤，請檢查網路連線並重試");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setTitle('');
    setDescription('');
    setBase64Files([]);
    setError('');
    setUploadProgress(0);
  };

  return (
    <Modal show={show} onHide={loading ? null : onHide} size="lg">
      <Modal.Header closeButton={!loading}>
        <Modal.Title>{type === "自身照片" ? "上傳個人照片" : "上傳公司照片"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form.Group controlId="formTitle" className="mb-3">
          <Form.Label>標題 <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="text"
            placeholder="請輸入照片標題"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
          />
        </Form.Group>
        
        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>描述</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="請輸入照片描述（選填）"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </Form.Group>
        
        <div 
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={openFileSelector}
          style={uploadAreaStyle(dragActive)}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/gif"
            style={{ display: 'none' }}
            disabled={loading}
          />
          
          <FiUpload size={32} color="#6c757d" />
          <p className="mt-3">拖曳照片至此處或點擊上傳</p>
          <small className="text-muted">
            支援 JPG、PNG、GIF 格式，單檔大小不超過 5MB
          </small>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <p className="mb-2">已選擇 {selectedFiles.length} 張照片：</p>
            
            {loading && uploadProgress > 0 && (
              <ProgressBar 
                now={uploadProgress} 
                label={`${uploadProgress}%`} 
                className="mb-3" 
                variant="info" 
              />
            )}
            
            <div style={previewContainerStyle}>
              {selectedFiles.map((file, index) => (
                <div key={index} style={previewItemStyle}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    style={previewImageStyle}
                  />
                  <div style={previewOverlayStyle}>
                    <p style={fileNameStyle}>{file.name}</p>
                    {!loading && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        style={removeButtonStyle}
                        title="移除此照片"
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClear} disabled={loading}>
          清除
        </Button>
        <Button variant="primary" onClick={handleUpload} disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner />
              <span className="ms-2">上傳中...</span>
            </>
          ) : (
            "上傳"
          )}
        </Button>
        <Button variant="danger" onClick={onHide} disabled={loading}>
          取消
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// 上傳區域樣式
const uploadAreaStyle = (dragActive) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  border: `2px dashed ${dragActive ? '#2684FF' : '#ced4da'}`,
  borderRadius: '0.5rem',
  backgroundColor: dragActive ? 'rgba(38, 132, 255, 0.05)' : '#f8f9fa',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  minHeight: '200px',
});

// 預覽容器樣式
const previewContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  justifyContent: 'flex-start',
};

// 預覽項目樣式
const previewItemStyle = {
  position: 'relative',
  width: '150px',
  height: '150px',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
};

// 預覽圖片樣式
const previewImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

// 預覽覆蓋層樣式
const previewOverlayStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '8px',
  backgroundColor: 'rgba(0,0,0,0.6)',
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

// 檔案名稱樣式
const fileNameStyle = {
  margin: 0,
  fontSize: '0.75rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '80%',
};

// 移除按鈕樣式
const removeButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default PhotoUploadModal;
