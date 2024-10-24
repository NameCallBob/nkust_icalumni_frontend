import Axios from "common/Axios";
import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Table,
    Form,
    Pagination
} from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // 使用 useNavigate

const ArticleEditor = () => {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 5;
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate(); // 初始化 useNavigate

    useEffect(() => {
        fetchArticles();
    }, []);

    // 用 Axios 獲取文章列表
    const fetchArticles = async () => {
        try {
            const response = await Axios().get("/article/all/all/"); // 獲取文章API路徑
            setArticles(response.data);
            setFilteredArticles(response.data);
        } catch (error) {
            console.error("獲取文章失敗:", error);
        }
    };

    // 處理搜尋文章
    const handleSearch = (e) => {
        const searchValue = e.target.value;
        setSearchTerm(searchValue);
        const filtered = articles.filter((article) =>
            article.title.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredArticles(filtered);
    };

    const handleEdit = (article) => {
        navigate(`/alumni/manage/article/edit/${article.id}`); // 跳轉到編輯頁面
    };

    const handleDelete = async (id) => {
        try {
            await Axios().delete(`/article/all/delete/`);
            setArticles(articles.filter((article) => article.id !== id));
            setFilteredArticles(filteredArticles.filter((article) => article.id !== id));
        } catch (error) {
            console.error("刪除文章失敗:", error);
        }
    };

    // 計算當前頁面的文章
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    // 換頁功能
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container>
            <Row>
                <Col md={8}>
                    <h2>已發布文章</h2>
                    <Button
                        variant="success"
                        onClick={() => navigate('/alumni/manage/article/new/')} // 跳轉到新增頁面
                    >
                        新增文章
                    </Button>
                    <Form.Control
                        type="text"
                        placeholder="搜尋文章標題"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="mt-3"
                    />
                    <Table striped bordered hover className="mt-3">
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
        </Container>
    );
};

export default ArticleEditor;
