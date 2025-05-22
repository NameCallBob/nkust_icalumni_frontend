import React, { useState, useEffect } from "react";
import { Container, Pagination } from "react-bootstrap";
import Axios from "common/Axios";
import { useNavigate } from "react-router-dom";
import "css/user/homepage/News.css";

/**
 * 單個文章項目組件，顯示完整年月日
 */
const NewsItem = ({ time, title, onClick, index }) => {
  // 處理日期格式
  const formattedDate = time.split("T")[0]; // 取 "T" 前面的部分
  const dateParts = formattedDate.split("-");
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  
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
        border-radius: 12px;
        margin-bottom: 16px;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
        display: flex;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.5s forwards;
      }
      
      /* 日期區塊 - 改為年/日/月完整顯示 */
      .date-box {
        width: 100px;
        padding: 12px 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #4a6fa5, #3d8bd9);
        color: white;
        font-weight: bold;
      }
      
      .date-year {
        font-size: 14px;
        line-height: 1;
        margin-bottom: 4px;
        opacity: 0.9;
      }
      
      .date-day {
        font-size: 28px;
        line-height: 1;
        margin-bottom: 4px;
      }
      
      .date-month {
        font-size: 15px;
        opacity: 0.9;
      }
      
      /* 內容區塊 */
      .content-box {
        flex: 1;
        padding: 18px 20px;
        display: flex;
        align-items: center;
      }
      
      .article-title {
        font-size: 17px;
        font-weight: 500;
        color: #445668;
        transition: color 0.3s ease;
        line-height: 1.4;
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
        transform: translateY(-3px);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
      }
      
      .news-card:hover .date-box {
        background: linear-gradient(135deg, #3d8bd9, #5a9de0);
      }
      
      .news-card:hover .article-title {
        color: #3d8bd9;
      }
      
      /* 點擊效果 */
      .news-card:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      /* 標題樣式 */
      .news-title {
        font-size: 26px;
        margin-bottom: 24px;
        color: #2c3e50;
        position: relative;
        padding-bottom: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }
      
      .news-title::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 70px;
        height: 4px;
        background: linear-gradient(90deg, #4a6fa5, #3d8bd9);
        border-radius: 2px;
      }
      
      /* 分頁樣式增強 */
      .pagination {
        margin-top: 32px;
      }
      
      .pagination .page-item.active .page-link {
        background-color: #4a6fa5;
        border-color: #4a6fa5;
        color: white;
        font-weight: 500;
      }
      
      .pagination .page-link {
        color: #4a6fa5;
        padding: 8px 14px;
        font-size: 15px;
      }
      
      .pagination .page-link:hover {
        color: #3d8bd9;
        background-color: #f0f5fa;
      }
      
      /* 媒體查詢 - 確保在較小屏幕上的良好顯示 */
      @media (max-width: 768px) {
        .news-card {
          flex-direction: column;
        }
        
        .date-box {
          width: 100%;
          padding: 10px;
          flex-direction: row;
          justify-content: center;
          gap: 10px;
        }
        
        .date-year, .date-day, .date-month {
          font-size: 16px;
          margin-bottom: 0;
        }
        
        .content-box {
          padding: 15px;
        }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <Container className="my-4">
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
      
      <Pagination>
        <Pagination.First 
          onClick={() => handlePageChange(1)} 
          disabled={currentPage === 1} 
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </Container>
  );
}

export default News;