import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Modal,
    Table,
    Form,
    Pagination,
    ToggleButtonGroup,
    ToggleButton,
} from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ArticleEditor = () => {
    const [articles, setArticles] = useState([
        {
            id: 1,
            title: "文章標題 1",
            content: "<p>文章內容 1</p>",
            publishDate: "2024-10-01",
            endDate: "2024-10-31",
            images: [],
        },
        {
            id: 2,
            title: "文章標題 2",
            content: "<p>文章內容 2</p>",
            publishDate: "2024-10-02",
            endDate: "2024-10-30",
            images: [],
        },
        // ...可以添加更多文章
    ]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newPublishDate, setNewPublishDate] = useState("");
    const [newEndDate, setNewEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 5;
    const [editorType, setEditorType] = useState("html");
    const [imageFiles, setImageFiles] = useState([]);

    const handleEdit = (article) => {
        setCurrentArticle(article);
        setNewTitle(article.title);
        setNewContent(article.content);
        setNewPublishDate(article.publishDate);
        setNewEndDate(article.endDate);
        setEditorType("html"); // 預設為 HTML 編輯器
        setImageFiles(article.images);
        setShowEditModal(true);
    };

    const handleDelete = (id) => {
        setArticles(articles.filter((article) => article.id !== id));
    };

    const handleSave = () => {
        const updatedArticles = articles.map((article) =>
            article.id === currentArticle.id
                ? {
                      ...article,
                      title: newTitle,
                      content: newContent,
                      publishDate: newPublishDate,
                      endDate: newEndDate,
                      images: imageFiles,
                  }
                : article
        );
        setArticles(updatedArticles);
        setShowEditModal(false);
    };

    // 計算當前頁面的文章
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

    // 換頁功能
    const totalPages = Math.ceil(articles.length / articlesPerPage);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    // 處理圖片上傳
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => URL.createObjectURL(file));
        setImageFiles((prevImages) => prevImages.concat(newImages));
    };

    // 刪除圖片
    const handleImageRemove = (index) => {
        const newImageFiles = [...imageFiles];
        newImageFiles.splice(index, 1);
        setImageFiles(newImageFiles);
    };

    return (
        <Container>
            <Row>
                <Col md={8}>
                    <h2>已發布文章</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>標題</th>
                                <th>發佈日期</th>
                                <th>結束日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentArticles.map((article) => (
                                <tr key={article.id}>
                                    <td>{article.title}</td>
                                    <td>{article.publishDate}</td>
                                    <td>{article.endDate}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            onClick={() => handleEdit(article)}
                                        >
                                            編輯
                                        </Button>{" "}
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(article.id)}
                                        >
                                            刪除
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {/* 分頁組件 */}
                    <Pagination>
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </Col>
            </Row>

            {/* 編輯文章的彈窗 */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>編輯文章</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>標題</Form.Label>
                            <Form.Control
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>發佈日期</Form.Label>
                            <Form.Control
                                type="date"
                                value={newPublishDate}
                                onChange={(e) => setNewPublishDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>結束日期</Form.Label>
                            <Form.Control
                                type="date"
                                value={newEndDate}
                                onChange={(e) => setNewEndDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>編輯方式</Form.Label>
                            <ToggleButtonGroup
                                type="radio"
                                name="editorType"
                                value={editorType}
                                onChange={setEditorType}
                            >
                                <ToggleButton value="html" variant="outline-primary">
                                    HTML 編輯器
                                </ToggleButton>
                                <ToggleButton value="text" variant="outline-secondary">
                                    純文字
                                </ToggleButton>
                                <ToggleButton value="paste" variant="outline-success">
                                    貼上 HTML
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>內容</Form.Label>
                            {editorType === "html" && (
                                <ReactQuill
                                    value={newContent}
                                    onChange={setNewContent}
                                />
                            )}
                            {editorType === "text" && (
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                />
                            )}
                            {editorType === "paste" && (
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder="請貼上 HTML"
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                />
                            )}
                        </Form.Group>
                        {/* 圖片上傳區 */}
                        <Form.Group>
                            <Form.Label>上傳圖片</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <div className="mt-2">
                                {imageFiles.map((image, index) => (
                                    <div key={index} className="d-flex align-items-center">
                                        <img
                                            src={image}
                                            alt={`uploaded-${index}`}
                                            style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "10px" }}
                                        />
                                        <Button variant="danger" onClick={() => handleImageRemove(index)}>
                                            刪除
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        取消
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        儲存
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ArticleEditor;
