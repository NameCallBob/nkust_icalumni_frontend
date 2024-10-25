import React, { useState, useEffect } from "react";
import { Button, Form, Container, Spinner, Row, Col, Modal } from "react-bootstrap";
import Axios from "common/Axios";
import ReactQuill from "react-quill";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; 
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css"; 
import 'css/manage/article/form.css';

const ArticleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [active, setActive] = useState(false);
    const [publishAt, setPublishAt] = useState(""); 
    const [expireAt, setExpireAt] = useState(""); 
    const [link, setLink] = useState("");
    const [imageFiles, setImageFiles] = useState([]); // 原始圖片
    const [newImages, setNewImages] = useState([]); // 新上傳的圖片
    const [removedImages, setRemovedImages] = useState([]); // 被移除的原始圖片
    const [showImageModal, setShowImageModal] = useState(false); 
    const [imageSize, setImageSize] = useState("small");

    // 用來保存從後端獲取的原始文章數據
    const [originalArticleData, setOriginalArticleData] = useState({});

    useEffect(() => {
        const now = new Date().toISOString().slice(0, 16); // 格式化當前時間
        setPublishAt(now);
        setExpireAt("2099-12-31T12:00");

        if (id) {
            fetchArticleById(id);
        }
    }, [id]);

    const fetchArticleById = async (articleId) => {
        setLoading(true);
        try {
            const response = await Axios().get(`/article/all/get_one/`, { params: { id: articleId } });
            const article = response.data;
            setNewTitle(article.title);
            setNewContent(article.content);
            setActive(article.active);
            setPublishAt(article.publish_at);
            setExpireAt(article.expire_at);
            setLink(article.link);

            // 轉換後端返回的圖片URL為完整的可預覽URL
            const processedImages = article.images.map((image) => ({
                id: image.id,
                url: `${process.env.REACT_APP_BASE_URL+image.image}`, // 假設圖片存放在 /static 目錄
                size: image.pic_type
            }));
            setImageFiles(processedImages); // 保存轉換後的圖片預覽數據

            // 保存原始的文章數據
            setOriginalArticleData(article);
        } catch (error) {
            console.error("載入文章失敗:", error);
            toast.error("文章載入失敗");
        } finally {
            setLoading(false);
        }
    };

    // 比對新資料與原資料，返回不同的字段
    const getChangedFields = (originalData, newData) => {
        const changedFields = {};
        Object.keys(newData).forEach((key) => {
            if (key !== 'images' && newData[key] !== originalData[key]) {
                changedFields[key] = newData[key];
            }
        });
        return changedFields;
    };

    const handleSave = async () => {
        setLoading(true);
        const articleData = {
            title: newTitle,
            content: newContent,
            active: active,
            publish_at: publishAt,
            expire_at: expireAt,
            link: link,
            images: imageFiles, // 將原始圖片保留
        };

        try {
            if (id) {
                // 比對非圖片字段的變更
                const changedFields = getChangedFields(originalArticleData, articleData);

                // 檢查是否有圖片變更（新增或移除）
                const newImagesBase64 = newImages.map((img) => ({
                    image: img.file, // 將圖片轉換為 Base64 格式或處理為適合格式
                    pic_type: img.size
                }));

                if (newImagesBase64.length > 0 || removedImages.length > 0) {
                    changedFields['new_images'] = newImagesBase64;
                    changedFields['removed_images'] = removedImages.map(img => img.id); // 只傳遞被移除的圖片 ID
                }

                if (Object.keys(changedFields).length > 0) {
                    changedFields['id'] = id; // 確保包含文章 ID
                    await Axios().patch(`/article/all/change/`, changedFields);
                    toast.success("文章保存成功");
                } else {
                    toast.info("沒有變更的內容需要保存");
                }
            } else {
                await Axios().post("/article/all/new/", {
                    ...articleData,
                    new_images: newImages.map((img) => ({
                        image: img.file,
                        pic_type: img.size
                    }))
                });
                toast.success("文章新增成功");
            }
            navigate("/alumni/manage/article/");
        } catch (error) {
            console.error("保存文章失敗:", error);
            toast.error("保存文章失敗");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const uploadedImages = files.map((file) => ({
            url: URL.createObjectURL(file),
            file,
            size: imageSize,
        }));
        setNewImages([...newImages, ...uploadedImages]);
    };

    const handleRemoveImage = (index, isOriginal = false) => {
        if (isOriginal) {
            const removedImage = imageFiles[index];
            setRemovedImages([...removedImages, removedImage]);
            setImageFiles(imageFiles.filter((_, i) => i !== index)); // 從原始圖片列表中移除
        } else {
            setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
        }
    };

    return (
        <Container>
            <h2>{id ? "編輯文章" : "新增文章"}</h2>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">加載中...</span>
                    </Spinner>
                </div>
            ) : (
                <Form>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>標題</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>是否公開</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="公開"
                                    checked={active}
                                    onChange={(e) => setActive(e.target.checked)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>發布時間</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={publishAt}
                                    onChange={(e) => setPublishAt(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
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
                            <Form.Group className="mb-3">
                                <Form.Label>文章連結</Form.Label>
                                <Form.Control
                                    type="url"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    placeholder="可選，若有外部連結"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>內容</Form.Label>
                                <ReactQuill
                                    value={newContent}
                                    onChange={setNewContent}
                                    className="quill-editor-container"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Button
                                variant="info"
                                onClick={() => setShowImageModal(true)}
                            >
                                上傳圖片
                            </Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <div className="image-preview-container">
                                {imageFiles.map((image, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={image.url} alt={`original-${index}`} />
                                        <p>{image.size === "small" ? "小圖" : "大圖"}</p>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemoveImage(index, true)}
                                        >
                                            刪除
                                        </Button>
                                    </div>
                                ))}
                                {newImages.map((image, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={image.url} alt={`uploaded-${index}`} />
                                        <p>{image.size === "small" ? "小圖" : "大圖"}</p>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemoveImage(index, false)}
                                        >
                                            刪除
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col md={12}>
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                disabled={!newTitle || !newContent}
                            >
                                {loading ? "保存中..." : "儲存"}
                            </Button>
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
                    <Form.Group>
                        <Form.Label>選擇圖片大小</Form.Label>
                        <Form.Select
                            value={imageSize}
                            onChange={(e) => setImageSize(e.target.value)}
                        >
                            <option value="small">小圖</option>
                            <option value="large">大圖</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mt-3">
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
