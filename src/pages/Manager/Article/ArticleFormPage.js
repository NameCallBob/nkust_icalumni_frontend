import React, { useState, useEffect } from "react";
import { Button, Form, Container, Spinner, Row, Col, Modal } from "react-bootstrap";
import Axios from "common/Axios";
import ReactQuill from "react-quill";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // 引入 Toastify
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css"; // 引入 Toastify 的樣式
import 'css/manage/article/form.css'; // 引入自訂CSS

const ArticleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [active, setActive] = useState(false);
    const [publishAt, setPublishAt] = useState(""); // 預設為空，稍後設置
    const [expireAt, setExpireAt] = useState(""); // 預設為空，稍後設置
    const [link, setLink] = useState("");
    const [imageFiles, setImageFiles] = useState([]); // 已上傳的圖片
    const [showImageModal, setShowImageModal] = useState(false); // 控制Modal顯示
    const [imageSize, setImageSize] = useState("small");
    const [newImages, setNewImages] = useState([]); // 新增圖片

    useEffect(() => {
        // 使用台灣時間設置發布時間
        const now = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Taipei" }).slice(0, 16);
        setPublishAt(now);
        setExpireAt("2099-12-31T12:00");

        if (id) {
            fetchArticleById(id);
        }
    }, [id]);

    const fetchArticleById = async (articleId) => {
        setLoading(true);
        try {
            const response = await Axios().get(`/article/${articleId}/`);
            const article = response.data;
            setNewTitle(article.title);
            setNewContent(article.content);
            setActive(article.active);
            setPublishAt(article.publish_at);
            setExpireAt(article.expire_at);
            setLink(article.link);
            setImageFiles(article.images || []);
        } catch (error) {
            console.error("載入文章失敗:", error);
            toast.error("文章載入失敗");
        } finally {
            setLoading(false);
        }
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
            images: imageFiles.concat(newImages),
        };

        try {
            if (id) {
                let tmp_article = articleData
                tmp_article['id'] = id
                await Axios().put(`/article/all/change/`, tmp_article);
                toast.success("文章保存成功");
            } else {
                await Axios().post("/article/new/", articleData);
                toast.success("文章新增成功");
            }
            navigate("/");
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

    const handleRemoveImage = (index) => {
        setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
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

                    {/* 排列：是否公開、發布時間、截止時間 */}
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

                    {/* 內容編輯器 - 調整尺寸及字體大小 */}
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>內容</Form.Label>
                                <ReactQuill
                                    value={newContent}
                                    onChange={setNewContent}
                                    style={{ height: "300px", fontSize: "16px", marginBottom: "20px" }} // 調整編輯框的高度和文字大小
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* 圖片上傳按鈕 */}
                    <Row className="mb-3">
                        <Col md={12}>
                            <Button
                                variant="info"
                                onClick={() => setShowImageModal(true)}
                                style={{ marginBottom: "20px" }} // 增加按鈕和下方元素的間距
                            >
                                上傳圖片
                            </Button>
                        </Col>
                    </Row>

                    {/* 已上傳圖片顯示區 */}
                    <Row>
                        <Col md={12}>
                            <div className="image-preview-container">
                                {newImages.map((image, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={image.url} alt={`uploaded-${index}`} />
                                        <p>{image.size === "small" ? "小圖" : "大圖"}</p>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemoveImage(index)}
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
                                style={{ marginTop: "20px" }} // 增加儲存按鈕與其他元素的間距
                            >
                                {loading ? "保存中..." : "儲存"}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            )}

            {/* Toastify 用於顯示通知 */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            {/* 圖片上傳 Modal */}
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
