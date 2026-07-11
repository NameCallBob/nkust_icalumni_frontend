import React, { useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Upload, X, ImageIcon } from 'lucide-react';
import Axios from '@/common/Axios';
import {
  Button,
  Field,
  Alert,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

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

  const validateFiles = useCallback((files) => {
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
  }, []);

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
        reader.onerror = (err) => reject(err);
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
  }, [validateFiles]);

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
      setError('請填寫照片標題');
      return;
    }

    if (!base64Files.length) {
      setError('請選擇要上傳的照片');
      return;
    }

    if (type === '自身照片') {
      apiname = '/picture/self-images/new/';
    } else if (type === '公司照片') {
      apiname = '/picture/company-images/new/';
    }

    setLoading(true);
    setUploadProgress(0);
    setError('');

    try {
      const total = base64Files.length;
      let completed = 0;

      const uploadPromises = base64Files.map((base64) => {
        const photoData = {
          image: base64,
          title,
          description,
          active: true,
        };

        return Axios()
          .post(apiname, photoData)
          .then((response) => {
            completed++;
            setUploadProgress(Math.round((completed / total) * 100));
            return response;
          });
      });

      await Promise.all(uploadPromises);
      toast.success('照片上傳成功！');
      onUpload();
      handleClear();
      onHide();
    } catch (err) {
      toast.error('照片上傳失敗，請稍後再試');
      setError('上傳過程中發生錯誤，請檢查網路連線並重試');
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

  const handleDropzoneKeyDown = (e) => {
    if (loading) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFileSelector();
    }
  };

  return (
    <Dialog
      open={show}
      onOpenChange={(v) => {
        if (!v && !loading) onHide();
      }}
    >
      <DialogContent className="max-w-2xl" preventQuickClose hideClose={loading}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            {type === '自身照片' ? '上傳個人照片' : '上傳公司照片'}
          </DialogTitle>
        </DialogHeader>

        {error && <Alert variant="destructive">{error}</Alert>}

        {/* 照片資訊 */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            照片資訊
          </h3>

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
        </section>

        {/* 選擇照片 */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Upload className="h-4 w-4 text-muted-foreground" />
            選擇照片
          </h3>

          <div
            role="button"
            tabIndex={loading ? -1 : 0}
            aria-disabled={loading || undefined}
            aria-label="拖曳照片至此處或點擊上傳"
            className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border bg-muted'
            } ${loading ? 'pointer-events-none opacity-60' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={openFileSelector}
            onKeyDown={handleDropzoneKeyDown}
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

            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-foreground">拖曳照片至此處或點擊上傳</p>
            <small className="text-muted-foreground">
              支援 JPG、PNG、GIF 格式，單檔大小不超過 5MB
            </small>
          </div>

          {selectedFiles.length > 0 && (
            <div>
              <p className="mb-2 text-sm text-foreground">
                已選擇 {selectedFiles.length} 張照片：
              </p>

              {loading && uploadProgress > 0 && (
                <div className="mb-3">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="mt-1 text-center text-sm text-muted-foreground">
                    {uploadProgress}%
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-start gap-3">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative h-28 w-28 overflow-hidden rounded-lg shadow-md sm:h-[150px] sm:w-[150px]"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`預覽 ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-1 bg-black/60 p-2 text-white">
                      <p className="m-0 max-w-[80%] truncate text-xs">{file.name}</p>
                      {!loading && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="flex items-center justify-center rounded-full p-1 text-white transition-colors hover:bg-white/20"
                          aria-label="移除此照片"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <DialogFooter>
          <Button variant="ghost" onClick={onHide} disabled={loading}>
            取消
          </Button>
          <Button variant="ghost" onClick={handleClear} disabled={loading}>
            清除
          </Button>
          <Button variant="default" onClick={handleUpload} loading={loading}>
            {loading ? '上傳中...' : '上傳'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadModal;
