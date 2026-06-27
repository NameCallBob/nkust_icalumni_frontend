import React, { useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import Axios from 'common/Axios';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from 'components/LoadingSpinner';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import AppModal from 'components/common/AppModal';
import { Button, Field, ModalSection } from 'components/common/ui';

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
    <AppModal
      show={show}
      onHide={loading ? null : onHide}
      size="lg"
      variant="admin"
      title={type === "自身照片" ? "上傳個人照片" : "上傳公司照片"}
      icon={<FiImage size={18} />}
      hideClose={loading}
      closeOnBackdrop={!loading}
      footer={
        <>
          <Button variant="ghost" onClick={onHide} disabled={loading}>
            取消
          </Button>
          <Button variant="ghost" onClick={handleClear} disabled={loading}>
            清除
          </Button>
          <Button variant="primary" onClick={handleUpload} disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">上傳中...</span>
              </>
            ) : (
              "上傳"
            )}
          </Button>
        </>
      }
    >
      {error && <div className="alert alert-error mb-3">{error}</div>}

      <ModalSection title="照片資訊" icon={<FiImage size={16} />}>
        <Field
          as="input"
          type="text"
          label="標題"
          required
          placeholder="請輸入照片標題"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />

        <Field
          as="textarea"
          rows={3}
          label="描述"
          placeholder="請輸入照片描述（選填）"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </ModalSection>

      <ModalSection title="選擇照片" icon={<FiUpload size={16} />}>
        <div
          className={`flex flex-col items-center justify-center p-8 min-h-[200px] rounded-lg border-2 border-dashed cursor-pointer transition-all duration-300 ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-base-300 bg-base-200'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={openFileSelector}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/gif"
            className="hidden"
            disabled={loading}
          />

          <FiUpload size={32} className="text-base-content/40" />
          <p className="mt-3 text-base-content">拖曳照片至此處或點擊上傳</p>
          <small className="text-base-content/60">
            支援 JPG、PNG、GIF 格式，單檔大小不超過 5MB
          </small>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <p className="mb-2">已選擇 {selectedFiles.length} 張照片：</p>

            {loading && uploadProgress > 0 && (
              <div className="mb-3">
                <progress
                  className="progress progress-info w-full"
                  value={uploadProgress}
                  max="100"
                />
                <div className="text-center text-sm mt-1">{uploadProgress}%</div>
              </div>
            )}

            <div className="flex flex-wrap justify-start gap-3">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative w-28 h-28 sm:w-[150px] sm:h-[150px] rounded-lg overflow-hidden shadow-md"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-1 p-2 bg-black/60 text-white">
                    <p className="m-0 max-w-[80%] truncate text-xs">{file.name}</p>
                    {!loading && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="flex items-center justify-center p-1 rounded-full text-white hover:bg-white/20 transition-colors"
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
      </ModalSection>
    </AppModal>
  );
};

export default PhotoUploadModal;
