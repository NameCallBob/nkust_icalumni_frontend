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
  Spinner,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import "bootstrap-icons/font/bootstrap-icons.css"; // 確保引入 Bootstrap Icons

const ArticleEditor = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("publish_at");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, [statusFilter, startDate, endDate, sortOrder, searchTerm]);

  const buildQueryParams = () => {
    let params = {};
    if (searchTerm) params.search = searchTerm;
    if (statusFilter) params.status = statusFilter;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    params.sort_order = sortOrder;
    return params;
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await Axios().get("/article/all/all/", {
        params: buildQueryParams(),
      });
      setArticles(response.data);
      setFilteredArticles(response.data);
    } catch (error) {
      console.error("獲取文章失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article) => {
    navigate(`/alumni/manage/article/edit/${article.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("確定要刪除這篇文章嗎？")) {
      try {
        await Axios().delete(`/article/all/delete/`, { data: { id } });
        setArticles(articles.filter((article) => article.id !== id));
        setFilteredArticles(filteredArticles.filter((article) => article.id !== id));
        toast.success("文章刪除成功");
      } catch (error) {
        console.error("刪除文章失敗:", error);
        toast.error("文章不存在");
      }
    }
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="fw-bold">文章管理-管理已發布與未發布的文章</h2>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => navigate("/alumni/manage/article/new/")}
            className="rounded-pill px-4"
          >
            <i className="bi bi-plus-lg me-2"></i>新增文章
          </Button>
        </Col>
      </Row>

      {/* 搜尋與篩選區域 */}
      <Row className="mb-4 p-4 bg-light rounded shadow-sm">
        <Col md={4} className="mb-3 mb-md-0">
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="搜尋文章標題..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={2}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">所有狀態</option>
            <option value="true">已發布</option>
            <option value="false">未發布</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="開始日期"
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="結束日期"
          />
        </Col>
        <Col md={2}>
          <Form.Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="publish_at">發布時間</option>
            <option value="view_count">觀看數</option>
          </Form.Select>
        </Col>
      </Row>

      {/* 文章表格 */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">載入中...</p>
        </div>
      ) : (
        <>
          <Table hover responsive className="shadow-sm">
            <thead className="bg-light">
              <tr>
                <th>標題</th>
                <th>發布日期</th>
                <th>結束日期</th>
                <th>狀態</th>
                <th className="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {currentArticles.map((article) => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>{moment(article.publish_at).format("YYYY-MM-DD HH:mm")}</td>
                  <td>{moment(article.expire_at).format("YYYY-MM-DD HH:mm")}</td>
                  <td>
                    <Badge bg={article.active ? "success" : "secondary"}>
                      {article.active ? "已發布" : "未發布"}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(article)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* 分頁 */}
          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
              <Pagination.Prev
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default ArticleEditor;