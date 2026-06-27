import Axios from "common/Axios";
import React, { useState, useEffect } from "react";
import { Button, Card, PageHeader, Toolbar, DataTable, Field, Badge } from "components/common/ui";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { FileText, Plus, Search, Pencil, Trash2 } from "lucide-react";

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

  const columns = [
    {
      key: "title",
      header: "標題",
      render: (article) => (
        <span className="font-medium text-base-content">{article.title}</span>
      ),
    },
    {
      key: "publish_at",
      header: "發布日期",
      render: (article) => moment(article.publish_at).format("YYYY-MM-DD HH:mm"),
    },
    {
      key: "expire_at",
      header: "結束日期",
      render: (article) => moment(article.expire_at).format("YYYY-MM-DD HH:mm"),
    },
    {
      key: "active",
      header: "狀態",
      render: (article) => (
        <Badge variant={article.active ? "success" : "info"}>
          {article.active ? "已發布" : "未發布"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "操作",
      className: "text-right",
      render: (article) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(article)}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => handleDelete(article.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="文章管理"
        subtitle="管理已發布與未發布的文章"
        icon={<FileText size={20} />}
        actions={
          <Button
            variant="primary"
            onClick={() => navigate("/alumni/manage/article/new/")}
          >
            <Plus size={18} className="mr-1.5" />新增文章
          </Button>
        }
      />

      {/* 搜尋與篩選區域 */}
      <Card padding="md" className="mb-5">
        <Toolbar
          className="mb-0"
          left={
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="relative lg:col-span-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                />
                <input
                  type="text"
                  className="input input-bordered w-full pl-9"
                  placeholder="搜尋文章標題..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Field
                as="select"
                className="!mb-0"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">所有狀態</option>
                <option value="true">已發布</option>
                <option value="false">未發布</option>
              </Field>
              <Field
                as="input"
                type="date"
                className="!mb-0"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="開始日期"
              />
              <Field
                as="input"
                type="date"
                className="!mb-0"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="結束日期"
              />
              <Field
                as="select"
                className="!mb-0"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="publish_at">發布時間</option>
                <option value="view_count">觀看數</option>
              </Field>
            </div>
          }
        />
      </Card>

      {/* 文章表格 */}
      <DataTable
        columns={columns}
        data={currentArticles}
        rowKey={(article) => article.id}
        loading={loading}
        empty={<div className="py-10 text-center text-base-content/50">目前沒有文章</div>}
      />

      {/* 分頁 */}
      {totalPages > 1 && (
        <div className="join mt-6 flex justify-center">
          <button
            className="join-item btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            «
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`join-item btn ${index + 1 === currentPage ? "btn-active btn-primary" : ""}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="join-item btn"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleEditor;
