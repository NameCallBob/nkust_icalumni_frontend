import React, { useState, useEffect } from "react";
import Axios from "common/Axios";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpRight, Newspaper } from "lucide-react";
import { Section, EmptyState } from "components/common/ui";

/**
 * 單個文章項目組件，顯示完整年月日
 */
const NewsItem = ({ time, title, onClick, index }) => {
  // 處理日期格式（time 可能為 null）
  const formattedDate = time ? time.split("T")[0] : ""; // 取 "T" 前面的部分
  const dateParts = formattedDate.split("-");
  const year = dateParts[0] || "";
  const month = dateParts[1] || "";
  const day = dateParts[2] || "";

  // 月份名稱映射
  const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  const monthName = monthNames[parseInt(month) - 1];

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-stretch overflow-hidden border-b border-base-200 bg-base-100 text-left transition-colors duration-200 last:border-b-0 hover:bg-primary/[0.03] focus:outline-none focus-visible:bg-primary/[0.05]"
    >
      {/* 日期區塊 */}
      <div className="flex w-20 flex-shrink-0 flex-col items-center justify-center border-r border-base-200 bg-base-200/40 px-2 py-3 transition-colors group-hover:bg-primary/[0.06] sm:w-24">
        <span className="text-[11px] font-medium leading-none text-base-content/50">{year}</span>
        <span className="my-1 font-serif text-2xl font-bold leading-none text-primary sm:text-3xl">{day}</span>
        <span className="text-xs font-medium leading-none text-base-content/60">{monthName}</span>
      </div>

      {/* 內容區塊 */}
      <div className="flex flex-1 items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <span className="line-clamp-2 text-sm font-medium leading-relaxed text-base-content transition-colors group-hover:text-primary sm:text-base">
          {title}
        </span>
        <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-base-content/0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-secondary" />
      </div>
    </button>
  );
};

function News() {
  const [article, setArticle] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 每頁顯示5個項目
  const totalPages = Math.ceil(article.length / itemsPerPage);
  const navigate = useNavigate();

  useEffect(() => {
    // 獲取文章數據，使用原始API端點
    Axios().get("/article/all/tableOutput/")
      .then((res) => {
        setArticle(res.data);
      })
      .catch(error => {
        console.error("獲取文章列表失敗:", error);
      });
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 滾動到頁面頂部，提供更好的用戶體驗
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemClick = (id) => {
    // 使用原始導航邏輯
    navigate(`/activity/${id}`);
  };

  // 分頁數據處理，保留原始邏輯
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = article.slice(startIndex, startIndex + itemsPerPage);

  const pageBtn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-base-300 bg-base-100 px-2.5 text-sm font-medium text-primary transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-base-300 disabled:hover:bg-base-100";

  return (
    <Section title="最新消息" eyebrow="LATEST NEWS" width="default">
      <div className="overflow-hidden rounded-2xl border border-base-300/70 bg-base-100 shadow-sm">
        {currentData.length > 0 ? (
          currentData.map((item, index) => (
            <NewsItem
              key={index}
              time={item.publish_at}
              title={item.title}
              onClick={() => handleItemClick(item.id)}
              index={index}
            />
          ))
        ) : (
          <EmptyState
            icon={<Newspaper className="h-8 w-8" />}
            title="目前沒有最新消息"
            description="請稍後再回來查看系友會的最新動態。"
          />
        )}
      </div>

      {totalPages > 1 && (
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-1.5" aria-label="最新消息分頁">
          <button
            type="button"
            className={pageBtn}
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="第一頁"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={pageBtn}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="上一頁"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              type="button"
              key={i + 1}
              className={
                i + 1 === currentPage
                  ? "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-primary bg-primary px-2.5 text-sm font-semibold text-primary-content shadow-sm"
                  : pageBtn
              }
              onClick={() => handlePageChange(i + 1)}
              aria-current={i + 1 === currentPage ? "page" : undefined}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            className={pageBtn}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="下一頁"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={pageBtn}
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="最後一頁"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </Section>
  );
}

export default News;
