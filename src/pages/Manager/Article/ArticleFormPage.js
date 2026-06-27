import React, { useState, useEffect } from "react";
import AppModal from "components/common/AppModal";
import { Button, Field, Spinner, PageHeader, Card, Badge } from "components/common/ui";
import Axios from "common/Axios";
import ReactQuill from "react-quill";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useRWD from 'hooks/useRWD';
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import { FileText, ArrowLeft, Save, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import LoadingSpinner from "components/LoadingSpinner";

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

  const totalImages = imageFiles.length + newImages.length;

  return (
    <div className="min-h-screen bg-base-200/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title={id ? "編輯文章" : "新增文章"}
          subtitle="填寫文章資訊並保存"
          icon={<FileText size={20} />}
          actions={
            <>
              <Button
                variant="outline"
                onClick={() => navigate("/alumni/manage/article/")}
              >
                <ArrowLeft size={16} className="mr-1.5" /> 返回
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={loading || !title || !content}
              >
                {loading ? (
                  <Spinner size="sm" />
                ) : (
                  <Save size={16} className="mr-1.5" />
                )}
                保存
              </Button>
            </>
          }
        />

        {loading ? (
          <Card padding="lg">
            <LoadingSpinner />
          </Card>
        ) : (
          <form className="space-y-6">
            {/* 基本資訊 */}
            <Card padding="lg">
              <h3 className="mb-5 font-serif text-base font-bold text-base-content">
                基本資訊
              </h3>

              <Field
                label="標題"
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="輸入文章標題"
              />

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* 是否公開 切換開關 */}
                <div className="form-control w-full">
                  <label className="label pb-1">
                    <span className="label-text font-medium text-base-content">是否公開</span>
                  </label>
                  <label className="flex h-12 items-center gap-3 rounded-xl border border-base-300/70 bg-base-100 px-4 cursor-pointer">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                    />
                    <span className="label-text">{active ? "公開" : "不公開"}</span>
                  </label>
                </div>
                <Field
                  label="發布時間"
                  type="datetime-local"
                  value={publishAt}
                  onChange={(e) => setPublishAt(e.target.value)}
                />
                <Field
                  label="截止時間"
                  type="datetime-local"
                  value={expireAt}
                  onChange={(e) => setExpireAt(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <Field
                  label="文章連結（選填）"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="輸入外部連結（如有）"
                />
              </div>
            </Card>

            {/* 內容 */}
            <Card padding="lg">
              <div className="form-control w-full">
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
                  className="rounded-xl bg-base-100"
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
            </Card>

            {/* 圖片管理 */}
            <Card padding="lg">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-base-content">圖片管理</h3>
                  <p className="mt-1 text-sm text-base-content/60">
                    已加入 {totalImages} 張圖片
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowImageModal(true)}
                  className={rwd.isMobile ? "w-full" : ""}
                >
                  <Upload size={16} className="mr-1.5" /> 上傳圖片
                </Button>
              </div>

              {totalImages === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-base-300 bg-base-200/40 py-10 text-base-content/50">
                  <ImageIcon size={32} className="mb-2" />
                  <span className="text-sm">尚未加入任何圖片</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {imageFiles.map((image, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-xl border border-base-300/70 bg-base-100"
                    >
                      <img
                        src={image.url}
                        alt={`original-${index}`}
                        className="aspect-square w-full object-cover"
                      />
                      <div className="absolute left-2 top-2">
                        <Badge variant="info" soft={false}>
                          {image.pic_type === "small" ? "小圖" : "大圖"}
                        </Badge>
                      </div>
                      <Button
                        variant="error"
                        size="sm"
                        className="absolute right-2 top-2 px-2"
                        onClick={() => handleRemoveImage(index, true)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                  {newImages.map((image, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-xl border border-primary/40 bg-base-100"
                    >
                      <img
                        src={image.url}
                        alt={`new-${index}`}
                        className="aspect-square w-full object-cover"
                      />
                      <div className="absolute left-2 top-2 flex gap-1">
                        <Badge variant="info" soft={false}>
                          {image.pic_type === "small" ? "小圖" : "大圖"}
                        </Badge>
                        <Badge variant="primary" soft={false}>新增</Badge>
                      </div>
                      <Button
                        variant="error"
                        size="sm"
                        className="absolute right-2 top-2 px-2"
                        onClick={() => handleRemoveImage(index, false)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
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
    </div>
  );
};

export default ArticleForm;
