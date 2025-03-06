import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Modal,
  Spinner,
  Badge,
} from "react-bootstrap";
import Axios from "common/Axios";
import ReactQuill from "react-quill";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import LoadingSpinner from "components/LoadingSpinner";
import "css/manage/article/form.css"; // 自訂樣式文件

const ArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
          size: img.pic_type,
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
        ...imageFiles.filter((img) => !removedImages.some((r) => r.id === img.id)),
        ...newImages.map((img) => ({ image: img.file, pic_type: img.size })),
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
          ...imageFiles.filter((img) => !removedImages.some((r) => r.id === img.id)),
          ...newImages.map((img) => ({ image: img.file, pic_type: img.size })),
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
          resolve({ url: reader.result, file: reader.result, size: imageSize });
        reader.readAsDataURL(file);
      });
    });
    const uploadedImages = await Promise.all(readFiles);
    setNewImages((prev) => [...prev, ...uploadedImages]);
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
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="fw-bold">{id ? "編輯文章" : "新增文章"}</h2>
          <p className="text-muted">填寫文章資訊並保存</p>
        </Col>
        <Col className="text-end">
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/alumni/manage/article/")}
            className="me-2"
          >
            <i className="bi bi-arrow-left"></i> 返回
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={loading || !title || !content}
          >
            {loading ? <Spinner size="sm" /> : <i className="bi bi-save"></i>} 保存
          </Button>
        </Col>
      </Row>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Form className="bg-light p-4 rounded shadow-sm">
          <Row>
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label>
                  標題 <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="輸入文章標題"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-4">
                <Form.Label>是否公開</Form.Label>
                <Form.Check
                  type="switch"
                  label={active ? "公開" : "不公開"}
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-4">
                <Form.Label>發布時間</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={publishAt}
                  onChange={(e) => setPublishAt(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-4">
                <Form.Label>截止時間</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={expireAt}
                  onChange={(e) => setExpireAt(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label>文章連結（選填）</Form.Label>
                <Form.Control
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="輸入外部連結（如有）"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label>
                  內容 <span className="text-danger">*</span>
                </Form.Label>
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  theme="snow"
                  placeholder="輸入文章內容..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label>圖片管理</Form.Label>
                <Button
                  variant="outline-primary"
                  onClick={() => setShowImageModal(true)}
                  className="mb-3"
                >
                  <i className="bi bi-upload"></i> 上傳圖片
                </Button>
                <div className="image-preview-container">
                  {imageFiles.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={image.url} alt={`original-${index}`} />
                      <Badge bg="info" className="mt-1">
                        {image.size === "small" ? "小圖" : "大圖"}
                      </Badge>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveImage(index, true)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  ))}
                  {newImages.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={image.url} alt={`new-${index}`} />
                      <Badge bg="info" className="mt-1">
                        {image.size === "small" ? "小圖" : "大圖"}
                      </Badge>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveImage(index, false)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>上傳圖片</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>圖片大小</Form.Label>
            <Form.Select
              value={imageSize}
              onChange={(e) => setImageSize(e.target.value)}
            >
              <option value="small">小圖</option>
              <option value="large">大圖</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>選擇圖片</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            關閉
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ArticleForm;