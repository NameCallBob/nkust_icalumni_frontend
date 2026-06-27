import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "common/Axios";
import {
  handleImageError,
  getImageSrc,
  DEFAULT_IMAGES,
} from "../../../utils/imageDefaults";

// 簡單卡片組件
const SimpleCard = ({ company, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!company) return null;

  const photoUrl =
    company && company.photo
      ? `${process.env.REACT_APP_BASE_URL}${company.photo}`
      : DEFAULT_IMAGES.company;

  return (
    <div className="simple-card" onClick={onClick}>
      <div className="simple-card-image">
        <img
          loading="lazy"
          src={getImageSrc(photoUrl, "company")}
          alt={company.name || "公司"}
          onError={(e) => handleImageError(e, "company")}
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
      </div>
      <div className="simple-card-content">
        <h6 className="simple-card-title">{company.name || "未命名公司"}</h6>
        <p className="simple-card-info">
          <span className="info-label">系友：</span>
          {company.member_name || "未提供"}
        </p>
        <p className="simple-card-info">
          <span className="info-label">系級：</span>
          {company.graduate_grade || "未提供"}
        </p>
      </div>
    </div>
  );
};

const SimpleAutoCarousel = ({ title }) => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const apilist = {
    最多點閱: "company/data/mostView/",
    最新上架: "company/data/newUpload/",
  };

  const handleItemClick = (id) => {
    navigate(`/alumni/${id}`);
  };

  // 自動輪播邏輯 - 每3秒切換一次
  useEffect(() => {
    if (companies.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % companies.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [companies.length]);

  // 獲取數據
  useEffect(() => {
    setIsLoading(true);
    Axios()
      .get(apilist[title])
      .then((res) => {
        setCompanies(res.data || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
        setCompanies([]);
        setIsLoading(false);
      });
  }, [title]);

  // 計算顯示的卡片（顯示3張，中間的為主要）
  const getVisibleCards = () => {
    if (companies.length === 0) return [];
    if (companies.length === 1) return [companies[0]];
    if (companies.length === 2) return companies;

    const visibleCards = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + companies.length) % companies.length;
      visibleCards.push({ ...companies[index], position: i });
    }
    return visibleCards;
  };

  const visibleCards = getVisibleCards();

  return (
    <div className="simple-auto-carousel">
      {/* 標題 */}
      <div className="carousel-header">
        <h4 className="carousel-title">{title}</h4>
        <div className="auto-indicator">
          <div className="auto-dot"></div>
          <span>自動輪播</span>
        </div>
      </div>

      {/* 內容區域 */}
      <div className="carousel-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>載入中...</p>
          </div>
        ) : companies.length > 0 ? (
          <div className="cards-container">
            {visibleCards.map((company, idx) => (
              <div
                key={`${company.member}-${currentIndex}-${idx}`}
                className={`card-wrapper ${
                  company.position === 0
                    ? "center"
                    : company.position === -1
                      ? "left"
                      : "right"
                }`}
              >
                <SimpleCard
                  company={company}
                  onClick={() => handleItemClick(company.member)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>暫無{title}資料</p>
          </div>
        )}
      </div>

      {/* 進度指示器 */}
      {companies.length > 1 && (
        <div className="progress-indicators">
          {companies.map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${index === currentIndex ? "active" : ""}`}
            />
          ))}
        </div>
      )}

      {/* CSS 樣式 */}
      <style jsx="true">{`
        .simple-auto-carousel {
          background: #ffffff;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          position: relative;
        }

        .carousel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e2e8f0;
        }

        .carousel-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          position: relative;
        }

        .carousel-title::after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 36px;
          height: 3px;
          background: #1e3a8a;
          border-radius: 2px;
        }

        .auto-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 0.875rem;
        }

        .auto-dot {
          width: 8px;
          height: 8px;
          background: #1e3a8a;
          border-radius: 50%;
          opacity: 0.7;
        }

        .carousel-content {
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cards-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          min-height: 180px;
          position: relative;
        }

        .card-wrapper {
          position: absolute;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          width: 280px;
        }

        .card-wrapper.center {
          transform: translateX(0) scale(1);
          z-index: 3;
          opacity: 1;
        }

        .card-wrapper.left {
          transform: translateX(-200px) scale(0.8);
          z-index: 1;
          opacity: 0.6;
        }

        .card-wrapper.right {
          transform: translateX(200px) scale(0.8);
          z-index: 1;
          opacity: 0.6;
        }

        .simple-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid #f1f5f9;
        }

        .simple-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .simple-card-image {
          width: 100%;
          height: 120px;
          overflow: hidden;
          position: relative;
          background: #f8fafc;
        }

        .simple-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.3s ease;
        }

        .simple-card:hover .simple-card-image img {
          transform: scale(1.05);
        }

        .simple-card-content {
          padding: 16px;
        }

        .simple-card-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .simple-card-info {
          font-size: 0.875rem;
          color: #64748b;
          margin: 4px 0;
          display: flex;
          align-items: center;
        }

        .info-label {
          font-weight: 500;
          color: #475569;
          margin-right: 8px;
          min-width: 40px;
        }

        .progress-indicators {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
        }

        .progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #cbd5e1;
          transition: all 0.3s ease;
        }

        .progress-dot.active {
          background: #1e3a8a;
          transform: scale(1.2);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: #64748b;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #1e3a8a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .empty-state {
          text-align: center;
          color: #64748b;
          padding: 40px;
          font-size: 0.875rem;
        }

        /* 響應式設計 */
        @media (max-width: 768px) {
          .simple-auto-carousel {
            padding: 16px;
            margin-bottom: 16px;
          }

          .carousel-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .auto-indicator {
            align-self: flex-end;
          }

          .cards-container {
            min-height: 160px;
          }

          .card-wrapper {
            width: 240px;
          }

          .card-wrapper.left {
            transform: translateX(-150px) scale(0.7);
          }

          .card-wrapper.right {
            transform: translateX(150px) scale(0.7);
          }

          .simple-card-image {
            height: 100px;
          }

          .simple-card-content {
            padding: 12px;
          }
        }

        @media (max-width: 480px) {
          .card-wrapper.left,
          .card-wrapper.right {
            display: none;
          }

          .simple-card-content {
            display: none;
          }

          .card-wrapper {
            width: 100%;
            position: relative !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SimpleAutoCarousel;
