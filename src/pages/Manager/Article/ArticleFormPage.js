import React, { useState, useEffect } from "react";
import AppModal from "components/common/AppModal";
import { Button, Field, Spinner } from "components/common/ui";
import Axios from "common/Axios";
import ReactQuill from "react-quill";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useRWD from 'hooks/useRWD';
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import LoadingSpinner from "components/LoadingSpinner";
import "css/manage/article/form.css"; // 自訂樣式文件

const ArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const rwd = useRWD();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [active, setActive] = useState(false);
  const [publishAt, setPublishAt] = useState("");
  const [expireAt, setExpireAt] = useState("");
  const [link, setLink] = useState("");
  const [imageFiles, setImageFiles] = useState([]); // 原始圖片
  const [newImages, setNewImages] = useState([]); // 新增圖片
  const [removedImages, setRemovedImages] = useState([]); // 被移除的圖片
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageSize, setImageSize] = useState("small");
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    setPublishAt(getTaipeiTime());
    setExpireAt("2099-12-31T12:00");
    if (id) fetchArticleById(id);
  }, [id]);

  const getTaipeiTime = () => {
    const now = new Date();
    const offset = 8 * 60; // 台北時區 UTC+8
    const localTime = new Date(now.getTime() + offset * 60 * 1000);
    return localTime.toISOString().slice(0, 16);
  };

  const fetchArticleById = async (articleId) => {
    setLoading(true);
    try {
      const response = await Axios().get(`/article/all/get_one/`, {
        params: { id: articleId },
      });
      const article = response.data;
      setTitle(article.title);
      setContent(article.content);
      setActive(article.active);
      setPublishAt(article.publish_at.slice(0, 16));
      setExpireAt(article.expire_at.slice(0, 16));
      setLink(article.link || "");
      setImageFiles(
        article.images.map((img) => ({
          id: img.id,
          url: `${process.env.REACT_APP_BASE_URL}${img.image}`,
          pic_type: img.pic_type,
        }))
      );
      setOriginalData(article);
    } catch (error) {
      console.error("載入文章失敗:", error);
      toast.error("文章載入失敗");
    } finally {
      setLoading(false);
    }
  };

  const getChangedFields = (original, newData) => {
    const changedFields = {};
    Object.keys(newData).forEach((key) => {
      if (key !== "images" && newData[key] !== original[key]) {
        changedFields[key] = newData[key];
      }
    });
    if (newImages.length > 0 || removedImages.length > 0) {
      changedFields.images = [
        ...imageFiles
          .filter((img) => !removedImages.some((r) => r.id === img.id))
          .map((img) => ({ id: img.id, pic_type: img.pic_type })),
        ...newImages.map((img) => ({ image: img.file, pic_type: img.pic_type })),
      ];
    }
    return changedFields;
  };

  const handleSave = async () => {
    if (!title || !content) {
      toast.error("標題與內容為必填項");
      return;
    }
    setLoading(true);
    try {
      const articleData = {
        title,
        content,
        active,
        publish_at: publishAt,
        expire_at: expireAt,
        link,
        images: [
          ...imageFiles
            .filter((img) => !removedImages.some((r) => r.id === img.id))
            .map((img) => ({ id: img.id, pic_type: img.pic_type })),
          ...newImages.map((img) => ({ image: img.file, pic_type: img.pic_type })),
        ],
      };

      if (id) {
        const changedFields = getChangedFields(originalData, articleData);
        if (Object.keys(changedFields).length > 0) {
          changedFields.id = id;
          await Axios().patch(`/article/all/change/`, changedFields);
          toast.success("文章更新成功");
        } else {
          toast.info("無變更內容");
        }
      } else {
        await Axios().post("/article/all/new/", articleData);
        toast.success("文章新增成功");
      }
      setTimeout(() => navigate("/alumni/manage/article/"), 1000);
    } catch (error) {
      console.error("保存失敗:", error);
      toast.error("保存失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const readFiles = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({ url: reader.result, file: reader.result, pic_type: imageSize });
        reader.readAsDataURL(file);
      });
    });
    const uploadedImages = await Promise.all(readFiles);
    setNewImages((prev) => [...prev, ...uploadedImages]);
    setShowImageModal(false); // 關閉 modal
  };

  const handleRemoveImage = (index, isOriginal = false) => {
    if (isOriginal) {
      const removed = imageFiles[index];
      setRemovedImages((prev) => [...prev, removed]);
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="admin-container container mx-auto px-4 py-4" style={rwd.getContainerStyle()}>
      {/* 頁首：標題與操作按鈕 */}
      <div className="flex flex-wrap items-center mb-4">
        <div className="flex-1">
          <h2 className="font-bold text-2xl">{id ? "編輯文章" : "新增文章"}</h2>
          <p className="text-base-content/60">填寫文章資訊並保存</p>
        </div>
        <div className={rwd.isMobile ? "text-start mt-2 w-full" : "text-end"}>
          <Button
            variant="secondary"
            onClick={() => navigate("/alumni/manage/article/")}
            className={`btn-outline ${rwd.isMobile ? "mb-2 w-full" : "mr-2"}`}
            style={rwd.getButtonStyle()}
          >
            <i className="bi bi-arrow-left"></i> 返回
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={loading || !title || !content}
            className={rwd.isMobile ? "w-full" : ""}
            style={rwd.getButtonStyle()}
          >
            {loading ? <Spinner size="sm" /> : <i className="bi bi-save"></i>} 保存
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <form className="bg-base-200 rounded-lg shadow-sm" style={{ padding: rwd.isMobile ? '1rem' : '2rem' }}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <Field
                label="標題"
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="輸入文章標題"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className={rwd.isMobile ? "col-span-12" : "col-span-12 md:col-span-4"}>
              {/* 是否公開 切換開關 */}
              <div className="form-control w-full mb-4">
                <label className="label pb-1">
                  <span className="label-text font-medium text-base-content">是否公開</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                  />
                  <span className="label-text">{active ? "公開" : "不公開"}</span>
                </label>
              </div>
            </div>
            <div className={rwd.isMobile ? "col-span-12" : "col-span-12 md:col-span-4"}>
              <Field
                label="發布時間"
                type="datetime-local"
                value={publishAt}
                onChange={(e) => setPublishAt(e.target.value)}
              />
            </div>
            <div className={rwd.isMobile ? "col-span-12" : "col-span-12 md:col-span-4"}>
              <Field
                label="截止時間"
                type="datetime-local"
                value={expireAt}
                onChange={(e) => setExpireAt(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <Field
                label="文章連結（選填）"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="輸入外部連結（如有）"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <div className="form-control w-full mb-4">
                <label className="label pb-1">
                  <span className="label-text font-medium text-base-content">
                    內容 <span className="text-error">*</span>
                  </span>
                </label>
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  theme="snow"
                  placeholder="輸入文章內容..."
                  style={{
                    height: rwd.isMobile ? '200px' : '300px',
                    marginBottom: rwd.isMobile ? '50px' : '30px'
                  }}
                  modules={{
                    toolbar: rwd.isMobile ? [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"],
                    ] : [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <div className="form-control w-full mb-4">
                <label className="label pb-1">
                  <span className="label-text font-medium text-base-content">圖片管理</span>
                </label>
                <Button
                  variant="outline"
                  onClick={() => setShowImageModal(true)}
                  className={rwd.isMobile ? "mb-3 w-full" : "mb-3"}
                  style={rwd.getButtonStyle()}
                >
                  <i className="bi bi-upload"></i> 上傳圖片
                </Button>
                <div className="image-preview-container" style={{
                  display: 'grid',
                  gridTemplateColumns: rwd.isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '1rem'
                }}>
                  {imageFiles.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={image.url} alt={`original-${index}`} />
                      <span className="badge badge-info mt-1">
                        {image.pic_type === "small" ? "小圖" : "大圖"}
                      </span>
                      <Button
                        variant="error"
                        size="sm"
                        className="btn-outline"
                        onClick={() => handleRemoveImage(index, true)}
                        style={rwd.getButtonStyle()}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  ))}
                  {newImages.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={image.url} alt={`new-${index}`} />
                      <span className="badge badge-info mt-1">
                        {image.pic_type === "small" ? "小圖" : "大圖"}
                      </span>
                      <Button
                        variant="error"
                        size="sm"
                        className="btn-outline"
                        onClick={() => handleRemoveImage(index, false)}
                        style={rwd.getButtonStyle()}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <AppModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        title="上傳圖片"
        size="sm"
        footer={
          <Button
            variant="secondary"
            onClick={() => setShowImageModal(false)}
            style={rwd.getButtonStyle()}
          >
            關閉
          </Button>
        }
      >
        <Field
          as="select"
          label="圖片大小"
          value={imageSize}
          onChange={(e) => setImageSize(e.target.value)}
        >
          <option value="small">小圖</option>
          <option value="large">大圖</option>
        </Field>
        <div className="form-control w-full mb-4">
          <label className="label pb-1">
            <span className="label-text font-medium text-base-content">選擇圖片</span>
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={handleImageUpload}
          />
        </div>
      </AppModal>
    </div>
  );
};

export default ArticleForm;
