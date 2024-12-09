import Axios from "common/Axios";
import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Table,
    Form,
    Pagination,
    Spinner
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";

const ArticleEditor = () => {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 5;
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState(""); // 狀態篩選
    const [startDate, setStartDate] = useState(""); // 開始日期篩選
    const [endDate, setEndDate] = useState(""); // 結束日期篩選
    const [sortOrder, setSortOrder] = useState("publish_at"); // 排序篩選
    const [loading, setLoading] = useState(false); // 控制 loading 狀態
    const navigate = useNavigate();

    useEffect(() => {
        fetchArticles();
    }, [statusFilter, startDate, endDate, sortOrder, searchTerm]);

    // 清理並構建參數
    const buildQueryParams = () => {
        let params = {};
        if (searchTerm) params.search = searchTerm;
        if (statusFilter) params.status = statusFilter;
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        params.sort_order = sortOrder; // 排序條件必須存在
        return params;
    };

    // 獲取文章數據
    const fetchArticles = async () => {
        setLoading(true); // 開始加載
        try {
            const response = await Axios().get("/article/all/all/", {
                params: buildQueryParams() // 傳入清理過後的參數
            });
            setArticles(response.data);
            setFilteredArticles(response.data);
        } catch (error) {
            console.error("獲取文章失敗:", error);
        } finally {
            setLoading(false); // 結束加載
        }
    };

    // 處理搜尋
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // 處理文章狀態篩選
    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    // 處理日期篩選
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    // 處理排序
    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    // 編輯文章
    const handleEdit = (article) => {
        navigate(`/alumni/manage/article/edit/${article.id}`);
    };

    // 刪除文章
    const handleDelete = async (id) => {
        try {
            await Axios().delete(`/article/all/delete/`,{data:{"id":id}});
            setArticles(articles.filter((article) => article.id !== id));
            setFilteredArticles(filteredArticles.filter((article) => article.id !== id));
            toast.success("文章刪除成功")
        } catch (error) {
            console.error("刪除文章失敗:", error);
            toast.error("文章不存在")
        }
    };

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container>
            <Row>
                <Col md={8}>
                    <h2>已發布文章</h2>
                    <Button
                        variant="success"
                        onClick={() => navigate('/alumni/manage/article/new/')}
                    >
                        新增文章
                    </Button>
                    <Form className="mt-3">
                        {/* 一般搜尋 */}
                        <Form.Control
                            type="text"
                            placeholder="搜尋文章標題"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        
                        {/* 狀態篩選 */}
                        <Form.Select
                            value={statusFilter}
                            onChange={handleStatusChange}
                            className="mt-3"
                        >
                            <option value="">所有狀態</option>
                            <option value="true">已發布</option>
                            <option value="false">未發布</option>
                        </Form.Select>
                        
                        {/* 時間期間篩選 */}
                        <Row className="mt-3">
                            <Col>
                                <Form.Label>開始日期</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                />
                            </Col>
                            <Col>
                                <Form.Label>結束日期</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                />
                            </Col>
                        </Row>

                        {/* 排序條件 */}
                        <Form.Select
                            value={sortOrder}
                            onChange={handleSortChange}
                            className="mt-3"
                        >
                            <option value="publish_at">按發布時間排序</option>
                            <option value="view_count">按觀看數排序</option>
                        </Form.Select>
                    </Form>

                    {loading ? (
                        <div className="text-center mt-3">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <>
                            <Table striped bordered hover className="mt-3">
                                <thead>
                                    <tr>
                                        <th>標題</th>
                                        <th className="d-none d-md-table-cell">發佈日期</th>
                                        <th className="d-none d-md-table-cell">結束日期</th>
                                        <th>發布狀態</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentArticles.map((article) => (
                                        <tr key={article.id}>
                                            <td>{article.title}</td>
                                            <td className="d-none d-md-table-cell">
                                                {moment(article.publish_at).format("YYYY-MM-DD HH:mm")}
                                            </td>
                                            <td className="d-none d-md-table-cell">
                                                {moment(article.expire_at).format("YYYY-MM-DD HH:mm")}
                                            </td>
                                            <td>{article.active ? "已發布" : "未發布"}</td>
                                            <td>
                                                <Button
                                                    variant="warning"
                                                    onClick={() => handleEdit(article)}
                                                    className="me-2"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDelete(article.id)}
                                                >
                                                    <i className="bi bi-trash"></i>
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
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ArticleEditor;
