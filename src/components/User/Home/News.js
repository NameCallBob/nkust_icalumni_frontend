import React, { useState, useEffect } from "react";
import Axios from "common/Axios";
import { useNavigate } from "react-router-dom";
import "css/user/homepage/News.css";

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
  
  // 動畫延遲
  const animationDelay = {
    animationDelay: `${0.08 * index}s`,
  };
  
  return (
    <div 
      className="news-card animate" 
      onClick={onClick}
      style={animationDelay}
    >
      <div className="date-box">
        <span className="date-year">{year}</span>
        <span className="date-day">{day}</span>
        <span className="date-month">{monthName}</span>
      </div>
      <div className="content-box">
        <span className="article-title">{title}</span>
      </div>
    </div>
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

  // 添加全局CSS樣式用於顏色搭配、字體大小與動畫效果
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      /* 基本樣式 */
      .news-card {
        background: white;
        border-radius: 6px;
        margin-bottom: 0;
        border: 1px solid #e2e8f0;
        border-bottom: none;
        display: flex;
        overflow: hidden;
        cursor: pointer;
        transition: background 0.2s ease;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.5s forwards;
      }

      .news-card:last-of-type {
        border-bottom: 1px solid #e2e8f0;
        border-radius: 0 0 6px 6px;
        margin-bottom: 16px;
      }

      .news-card:first-of-type {
        border-radius: 6px 6px 0 0;
      }
      
      /* 日期區塊 - 簡潔企業風格 */
      .date-box {
        width: 90px;
        padding: 12px 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #f8fafc;
        border-right: 1px solid #e2e8f0;
        flex-shrink: 0;
      }

      .date-year {
        font-size: 12px;
        line-height: 1;
        margin-bottom: 4px;
        color: #475569;
        font-weight: 500;
      }

      .date-day {
        font-size: 24px;
        line-height: 1;
        margin-bottom: 4px;
        color: #1e3a8a;
        font-weight: 700;
      }

      .date-month {
        font-size: 13px;
        color: #475569;
        font-weight: 500;
      }
      
      /* 內容區塊 */
      .content-box {
        flex: 1;
        padding: 18px 20px;
        display: flex;
        align-items: center;
      }
      
      .article-title {
        font-size: 15px;
        font-weight: 500;
        color: #0f172a;
        transition: color 0.2s ease;
        line-height: 1.5;
      }
      
      /* 動畫定義 */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* 懸停效果 */
      .news-card:hover {
        background: #f8fafc;
        transform: none;
        box-shadow: none;
      }

      .news-card:hover .date-box {
        background: #f1f5f9;
      }

      .news-card:hover .article-title {
        color: #2563eb;
      }

      /* 點擊效果 */
      .news-card:active {
        background: #f1f5f9;
      }
      
      /* 標題樣式 */
      .news-title {
        font-size: 22px;
        margin-bottom: 20px;
        color: #1e3a8a;
        position: relative;
        padding-bottom: 12px;
        font-weight: 700;
        letter-spacing: 0.02em;
      }

      .news-title::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 48px;
        height: 3px;
        background: #1e3a8a;
        border-radius: 2px;
      }
      
      /* 分頁樣式增強 */
      .pagination {
        margin-top: 24px;
      }

      .pagination .page-item.active .page-link {
        background-color: #1e3a8a;
        border-color: #1e3a8a;
        color: white;
        font-weight: 600;
      }

      .pagination .page-link {
        color: #1e3a8a;
        padding: 6px 12px;
        font-size: 14px;
        border-color: #e2e8f0;
      }

      .pagination .page-link:hover {
        color: #2563eb;
        background-color: #eff6ff;
        border-color: #bfdbfe;
      }
      
      /* 媒體查詢 - 確保在較小屏幕上的良好顯示 */
      @media (max-width: 768px) {
        .date-box {
          width: 72px;
          padding: 10px 6px;
        }

        .date-day {
          font-size: 20px;
        }

        .content-box {
          padding: 12px 14px;
        }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 my-4">
      <h3 className="news-title">最新消息</h3>

      {currentData.map((item, index) => (
        <NewsItem
          key={index}
          time={item.publish_at}
          title={item.title}
          onClick={() => handleItemClick(item.id)}
          index={index}
        />
      ))}

      <div className="join mt-6 flex flex-wrap justify-center">
        <button
          type="button"
          className="join-item btn btn-sm"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          «
        </button>
        <button
          type="button"
          className="join-item btn btn-sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            type="button"
            key={i + 1}
            className={`join-item btn btn-sm ${
              i + 1 === currentPage ? "btn-primary" : ""
            }`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          type="button"
          className="join-item btn btn-sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
        <button
          type="button"
          className="join-item btn btn-sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
}

export default News;