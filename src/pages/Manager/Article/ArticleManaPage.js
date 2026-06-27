import Axios from "common/Axios";
import React, { useState, useEffect } from "react";
import { Button, Spinner } from "components/common/ui";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { BsPlusLg, BsSearch, BsThreeDots, BsPencil, BsTrash } from "react-icons/bs";
import useRWD from 'hooks/useRWD';

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
  const rwd = useRWD();

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
    <div className="admin-container container mx-auto px-4 py-4 max-w-full">
      <div className="flex flex-wrap items-center mb-4 gap-3">
        <div className="flex-1">
          <h2 className="font-bold text-2xl text-base-content">文章管理-管理已發布與未發布的文章</h2>
        </div>
        <div className="text-right">
          <Button
            variant="primary"
            onClick={() => navigate("/alumni/manage/article/new/")}
            className="rounded-full px-4"
            style={rwd.getButtonStyle()}
          >
            <BsPlusLg className="mr-2" />新增文章
          </Button>
        </div>
      </div>

      {/* 搜尋與篩選區域 */}
      <div className="grid grid-cols-12 gap-4 mb-4 p-4 bg-base-200 rounded-lg shadow-sm">
        <div className="col-span-12 md:col-span-4">
          <div className="join w-full">
            <span className="join-item flex items-center px-3 bg-base-100 border border-base-300">
              <BsSearch />
            </span>
            <input
              type="text"
              className="join-item input input-bordered w-full"
              placeholder="搜尋文章標題..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-span-12 md:col-span-2">
          <select
            className="select select-bordered w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">所有狀態</option>
            <option value="true">已發布</option>
            <option value="false">未發布</option>
          </select>
        </div>
        <div className="col-span-12 md:col-span-2">
          <input
            type="date"
            className="input input-bordered w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="開始日期"
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <input
            type="date"
            className="input input-bordered w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="結束日期"
          />
        </div>
        <div className="col-span-12 md:col-span-2">
          <select
            className="select select-bordered w-full"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="publish_at">發布時間</option>
            <option value="view_count">觀看數</option>
          </select>
        </div>
      </div>

      {/* 文章表格 */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner center label="載入中..." />
        </div>
      ) : (
        <>
          <div style={rwd.getContainerStyle()}>
            <div className="overflow-x-auto">
              <table className="table table-zebra shadow-sm" style={rwd.getTableStyle()}>
                <thead className="bg-base-200">
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
                        <span className={`badge ${article.active ? "badge-success" : "badge-ghost"}`}>
                          {article.active ? "已發布" : "未發布"}
                        </span>
                      </td>
                      <td className="text-center">
                        {rwd.isMobile ? (
                          <div className="dropdown dropdown-end">
                            <label
                              tabIndex={0}
                              className="btn btn-outline btn-sm"
                              style={rwd.getButtonStyle()}
                            >
                              <BsThreeDots />
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu z-[1] bg-base-100 rounded-box shadow w-32 p-2"
                            >
                              <li>
                                <a onClick={() => handleEdit(article)}>
                                  <BsPencil className="mr-2" />編輯
                                </a>
                              </li>
                              <li>
                                <a
                                  className="text-error"
                                  onClick={() => handleDelete(article.id)}
                                >
                                  <BsTrash className="mr-2" />刪除
                                </a>
                              </li>
                            </ul>
                          </div>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mr-2"
                              onClick={() => handleEdit(article)}
                              style={rwd.getButtonStyle()}
                            >
                              <BsPencil />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="btn-error"
                              onClick={() => handleDelete(article.id)}
                              style={rwd.getButtonStyle()}
                            >
                              <BsTrash />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 分頁 */}
          {totalPages > 1 && (
            <div className="join flex justify-center mt-4">
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
        </>
      )}
    </div>
  );
};

export default ArticleEditor;
