import React, { useState, useEffect } from "react";
import { Button, Form, Container, Spinner, Row, Col, Modal } from "react-bootstrap";
import Axios from "common/Axios";
import ReactQuill from "react-quill";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import 'css/manage/article/form.css';
import LoadingSpinner from "components/LoadingSpinner";

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
        setPublishAt(getTaipeiTime());
        setExpireAt("2099-12-31T12:00");

        if (id) {
            fetchArticleById(id);
        }
    }, [id]);

    // 將當前時間設定為台北時間，並格式化為 YYYY-MM-DDTHH:mm
    const getTaipeiTime = () => {
        const now = new Date(); // 獲取當前時間
        const offset = 8 * 60; // 台北時區 +8 小時，轉換為分鐘
        const localTime = new Date(now.getTime() + offset * 60 * 1000);
        const isoString = localTime.toISOString();
        return isoString.slice(0, 16); // 格式化為 YYYY-MM-DDTHH:mm
    };

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

        // 檢查非圖片字段
        Object.keys(newData).forEach((key) => {
            if (key !== 'images' && newData[key] !== originalData[key]) {
                changedFields[key] = newData[key];
            }
        });

        // 檢查圖片的變更（新增或移除）
        const originalImageIds = originalData.images ? originalData.images.map(img => img.id) : [];
        const newImageIds = newData.images ? newData.images.map(img => img.id) : [];

        if (
            newImageIds.length !== originalImageIds.length ||
            !newImageIds.every((id) => originalImageIds.includes(id))
        ) {
            changedFields.images = newData.images; // 標記圖片為已變更
        }

        return changedFields;
    };


    const handleSave = async () => {
        setLoading(true);
        try {
            // 結合保留的原始圖片和新增的圖片
            const allImages = [
                ...imageFiles.filter((img) => !removedImages.includes(img)), // 移除被標記為刪除的圖片
                ...newImages.map((img) => ({
                    image: img.file, // Base64 格式
                    pic_type: img.size,
                })),
            ];

            const articleData = {
                title: newTitle,
                content: newContent,
                active: active,
                publish_at: publishAt,
                expire_at: expireAt,
                link: link,
                images: allImages, // 全部的圖片（包含保留和新增的）
            };

            if (id) {
                const changedFields = getChangedFields(originalArticleData, articleData);
                if (Object.keys(changedFields).length > 0) {
                    changedFields['id'] = id; // 加上文章 ID
                    await Axios().patch(`/article/all/change/`, changedFields);
                    toast.success("文章保存成功");
                } else {
                    toast.info("沒有變更的內容需要保存");
                }
            } else {
                await Axios().post("/article/all/new/", articleData);
                toast.success("文章新增成功");
            }

            // 添加延遲，確保 toast 訊息彈出
            setTimeout(() => {
                navigate("/alumni/manage/article/");
            }, 1000); // 延遲 0.5 秒
        } catch (error) {
            console.error("保存文章失敗:", error);
            toast.error("保存文章失敗");
        } finally {
            setLoading(false);
        }
    };


    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        const readFilesAsBase64 = files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    resolve({
                        url: reader.result,
                        file: reader.result, // Base64 編碼
                        size: imageSize,
                    });
                };
                reader.onerror = (error) => reject(error);
            });
        });

        try {
            const uploadedImages = await Promise.all(readFilesAsBase64);
            setNewImages((prevImages) => [...prevImages, ...uploadedImages]);
        } catch (error) {
            console.error("圖片加載失敗:", error);
        }
    };

    const handleRemoveImage = (index, isOriginal = false) => {
        if (isOriginal) {
            setRemovedImages([...removedImages, imageFiles[index]]); // 標記原始圖片為已刪除
            setImageFiles(imageFiles.filter((_, i) => i !== index)); // 從顯示列表移除
        } else {
            setNewImages((prevImages) => prevImages.filter((_, i) => i !== index)); // 從新增列表移除
        }
    };


    return (
        <Container>
            <h2>{id ? "編輯文章" : "新增文章"}</h2>
            {loading ? (
                <div className="text-center">
                    <LoadingSpinner></LoadingSpinner>
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
