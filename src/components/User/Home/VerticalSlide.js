import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Axios from 'common/Axios';
import { handleImageError, getImageSrc, DEFAULT_IMAGES } from '../../../utils/imageDefaults';

// 公司卡片組件
const CompanyCard = ({ company, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredProductIndex, setHoveredProductIndex] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // 最大顯示產品數
  const MAX_VISIBLE_PRODUCTS = 3;

  // 檢測是否為小螢幕
  const isMobile = window.innerWidth <= 768;

  // 確保 company 存在
  if (!company) {
    return null;
  }

  // 安全地獲取 photo URL
  const photoUrl = company && company.photo
    ? `${process.env.REACT_APP_BASE_URL}${company.photo}`
    : DEFAULT_IMAGES.company;

  // 卡片樣式
  const cardStyle = {
    background: 'white',
    borderRadius: isMobile ? '8px' : '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    cursor: 'pointer',
    minHeight: isMobile ? '200px' : '180px',
    height: 'auto',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    position: 'relative',
    transform: isHovered && !isMobile ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
    maxWidth: '100%',
    margin: '0 auto 1.5rem',
    border: '1px solid #f0f0f0',
    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
  };

  // 圖片容器樣式
  const imageContainerStyle = {
    overflow: 'hidden',
    position: 'relative',
    width: isMobile ? '100%' : '250px',
    height: isMobile ? '180px' : '100%',
    flexShrink: 0,
  };

  // 圖片樣式
  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease',
    transform: isHovered && !isMobile ? 'scale(1.08)' : 'scale(1)',
  };

  // 內容區域樣式
  const contentStyle = {
    padding: isMobile ? '1rem' : '1.25rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: isMobile ? 'flex-start' : 'space-between',
    background: 'white',
    overflow: 'visible',
    minHeight: 0,
  };

  // 公司名稱樣式
  const nameStyle = {
    fontSize: isMobile ? '1.1rem' : '1.2rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: isMobile ? '0.5rem' : '0.75rem',
    textAlign: 'left',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  // 資訊項目樣式
  const infoItemStyle = {
    display: 'flex',
    marginBottom: '0.4rem',
    fontSize: isMobile ? '0.85rem' : '0.9rem',
    color: '#666',
    lineHeight: '1.5',
  };

  // 資訊標籤樣式
  const labelStyle = {
    fontWeight: '500',
    minWidth: isMobile ? '3rem' : '3.5rem',
    color: '#888',
    textAlign: 'left',
    fontSize: 'inherit',
  };

  // 資訊值樣式
  const valueStyle = {
    flexGrow: 1,
    textAlign: 'left',
    paddingLeft: '0.5rem',
  };

  // 產品容器樣式
  const productsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    maxHeight: 'none',
    overflow: 'visible',
    marginTop: '0.3rem',
    gap: '0.4rem',
    alignItems: 'flex-start',
    width: '100%',
  };

  // 產品標籤樣式
  const productStyle = {
    display: 'inline-block',
    background: '#f5f5f5',
    borderRadius: '4px',
    padding: '0.2rem 0.4rem',
    margin: '0',
    fontSize: isMobile ? '0.7rem' : '0.75rem',
    color: '#666',
    border: '1px solid #e0e0e0',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    maxWidth: isMobile ? '120px' : '150px',
    lineHeight: 1.3,
    transition: 'all 0.2s ease',
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`company-card ${isHovered ? 'hovered' : ''}`}
    >
      <div style={imageContainerStyle}>
        <img
          src={getImageSrc(photoUrl, 'company')}
          alt={company.name || '公司'}
          style={imageStyle}
          onError={(e) => handleImageError(e, 'company')}
        />
      </div>
      <div style={contentStyle}>
        <div>
          <h5 style={nameStyle}>{company.name || '未命名公司'}</h5>
          <div style={infoItemStyle}>
            <span style={labelStyle}>系級：</span>
            <span style={valueStyle}>{company.graduate_grade || '未提供'}</span>
          </div>
          <div style={infoItemStyle}>
            <span style={labelStyle}>系友：</span>
            <span style={valueStyle}>{company.member_name || '未提供'}</span>
          </div>
        </div>
        <div>
          <div style={{ ...infoItemStyle, alignItems: 'flex-start', marginTop: '1rem' }}>
            <span style={labelStyle}>產品：</span>
            <div style={productsContainerStyle}>
              {company.products ?
                (() => {
                  const productList = company.products.split(',').map(p => p.trim()).filter(p => p);
                  const visibleProducts = showAllProducts ? productList : productList.slice(0, MAX_VISIBLE_PRODUCTS);

                  return (
                    <>
                      {visibleProducts.map((product, idx) => (
                        <span
                          key={idx}
                          style={productStyle}
                          onMouseEnter={() => setHoveredProductIndex(idx)}
                          onMouseLeave={() => setHoveredProductIndex(null)}
                        >
                          {product || '未提供'}
                        </span>
                      ))}

                      {!showAllProducts && productList.length > MAX_VISIBLE_PRODUCTS && (
                        <span
                          style={{
                            ...productStyle,
                            background: '#e8f4fd',
                            color: '#1976d2',
                            border: '1px solid #bbdefb',
                            cursor: 'pointer',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAllProducts(true);
                          }}
                        >
                          +{productList.length - MAX_VISIBLE_PRODUCTS} 更多
                        </span>
                      )}

                      {showAllProducts && productList.length > MAX_VISIBLE_PRODUCTS && (
                        <span
                          style={{
                            ...productStyle,
                            background: '#e8f4fd',
                            color: '#1976d2',
                            border: '1px solid #bbdefb',
                            cursor: 'pointer',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAllProducts(false);
                          }}
                        >
                          收起
                        </span>
                      )}
                    </>
                  );
                })() :
                <span style={productStyle}>未提供產品資訊</span>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VerticalCarousel = ({ title }) => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;
  const itemsPerView = isMobile ? 1 : 2;

  const apilist = {
    "最多點閱": "company/data/mostView/",
    "最新上架": "company/data/newUpload/"
  };

  const handleItemClick = (id) => {
    navigate(`/alumni/${id}`);
  };

  // 自動播放邏輯
  useEffect(() => {
    if (isAutoPlaying && companies.length > itemsPerView) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % (companies.length - itemsPerView + 1));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, companies.length, itemsPerView]);

  // 觸控手勢處理
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < companies.length - itemsPerView) {
      setCurrentIndex(prev => prev + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // 獲取數據
  useEffect(() => {
    setIsLoading(true);
    Axios().get(apilist[title])
      .then((res) => {
        setCompanies(res.data || []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching companies:", error);
        setCompanies([]);
        setIsLoading(false);
      });
  }, [title]);

  // 容器樣式
  const containerStyle = {
    position: 'relative',
    minHeight: isMobile ? '250px' : '300px',
  };

  return (
    <div className="vertical-carousel-v2">
      {/* 標題區域 */}
      <div className="header-section">
        <h4 className="carousel-title">
          {title}
          <div className="title-decoration"></div>
        </h4>

        <div className="header-controls">
          {!isMobile && (
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
                title="卡片視圖"
              >
                ⊞
              </button>
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="列表視圖"
              >
                ☰
              </button>
            </div>
          )}

          <button
            className={`auto-play-btn ${isAutoPlaying ? 'playing' : 'paused'}`}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            title={isAutoPlaying ? '暫停自動播放' : '開始自動播放'}
          >
            {isAutoPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>

      {/* 內容區域 */}
      <div className="carousel-container" style={containerStyle}>
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>正在載入{title}資料...</p>
          </div>
        ) : companies.length > 0 ? (
          <>
            {/* 桌面版輪播 */}
            {!isMobile ? (
              <div className="desktop-carousel">
                <div className="carousel-wrapper">
                  <div
                    className="carousel-track"
                    style={{
                      transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                      width: `${(companies.length / itemsPerView) * 100}%`
                    }}
                  >
                    {companies.map((company, index) => (
                      <div
                        key={index}
                        className={`carousel-item ${viewMode}`}
                        style={{ width: `${100 / companies.length}%` }}
                      >
                        <CompanyCard
                          company={company}
                          onClick={() => handleItemClick(company.member)}
                          index={index}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 桌面版導航 */}
                {companies.length > itemsPerView && (
                  <div className="desktop-nav">
                    <button
                      className="nav-arrow prev"
                      onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                      disabled={currentIndex === 0}
                    >
                      ◀
                    </button>
                    <button
                      className="nav-arrow next"
                      onClick={() => setCurrentIndex(Math.min(companies.length - itemsPerView, currentIndex + 1))}
                      disabled={currentIndex >= companies.length - itemsPerView}
                    >
                      ▶
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* 移動版觸控輪播 */
              <div
                className="mobile-carousel"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="mobile-carousel-wrapper">
                  <div
                    className="mobile-carousel-track"
                    style={{
                      transform: `translateX(-${currentIndex * 100}%)`,
                      width: `${companies.length * 100}%`
                    }}
                  >
                    {companies.map((company, index) => (
                      <div
                        key={index}
                        className="mobile-carousel-item"
                        style={{ width: `${100 / companies.length}%` }}
                      >
                        <CompanyCard
                          company={company}
                          onClick={() => handleItemClick(company.member)}
                          index={index}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 移動版指示器 */}
                {companies.length > 1 && (
                  <div className="mobile-indicators">
                    {companies.map((_, index) => (
                      <button
                        key={index}
                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>暫無{title}資料</p>
          </div>
        )}
      </div>

      {/* 增強版 CSS 樣式 */}
      <style jsx="true">{`
        .vertical-carousel-v2 {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: ${isMobile ? '15px' : '20px'};
          padding: ${isMobile ? '20px' : '30px'};
          margin-bottom: 30px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          position: relative;
          overflow: hidden;
        }

        .vertical-carousel-v2::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #06b6d4, #10b981);
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .carousel-title {
          font-size: ${isMobile ? '1.5rem' : '1.8rem'};
          font-weight: 700;
          color: #1e293b;
          position: relative;
          margin: 0;
          animation: slideInLeft 0.8s ease-out;
        }

        .title-decoration {
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 60%;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #3b82f6);
          border-radius: 2px;
          animation: expandWidth 1s ease-out 0.5s both;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .view-toggle {
          display: flex;
          background: rgba(255,255,255,0.8);
          border-radius: 25px;
          padding: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .toggle-btn {
          background: transparent;
          border: none;
          padding: 8px 12px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
          min-width: 40px;
        }

        .toggle-btn.active {
          background: #3b82f6;
          color: white;
          box-shadow: 0 2px 8px rgba(59,130,246,0.3);
        }

        .auto-play-btn {
          background: rgba(255,255,255,0.9);
          border: none;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .auto-play-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }

        .auto-play-btn.playing {
          background: #10b981;
          color: white;
        }

        .carousel-container {
          position: relative;
        }

        /* 桌面版輪播樣式 */
        .desktop-carousel {
          position: relative;
        }

        .carousel-wrapper {
          overflow: hidden;
          border-radius: 15px;
          position: relative;
        }

        .carousel-track {
          display: flex;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .carousel-item {
          padding: 0 10px;
          box-sizing: border-box;
        }

        .carousel-item.list {
          width: 100% !important;
        }

        .desktop-nav {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          display: flex;
          justify-content: space-between;
          pointer-events: none;
          z-index: 10;
        }

        .nav-arrow {
          background: rgba(255,255,255,0.9);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          cursor: pointer;
          pointer-events: auto;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-arrow:hover:not(:disabled) {
          background: white;
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }

        .nav-arrow:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .nav-arrow.prev {
          margin-left: -25px;
        }

        .nav-arrow.next {
          margin-right: -25px;
        }

        /* 移動版輪播樣式 */
        .mobile-carousel {
          position: relative;
          touch-action: pan-y;
        }

        .mobile-carousel-wrapper {
          overflow: hidden;
          border-radius: 15px;
        }

        .mobile-carousel-track {
          display: flex;
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .mobile-carousel-item {
          padding: 0 5px;
          box-sizing: border-box;
        }

        .mobile-indicators {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: rgba(59,130,246,0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: #3b82f6;
          transform: scale(1.2);
          box-shadow: 0 0 10px rgba(59,130,246,0.4);
        }

        .indicator:hover {
          background: rgba(59,130,246,0.6);
        }

        /* 載入狀態 */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }

        /* 空狀態 */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 15px;
          opacity: 0.6;
        }

        /* 動畫 */
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes expandWidth {
          0% { width: 0%; }
          100% { width: 60%; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* 響應式調整 */
        @media (max-width: 768px) {
          .vertical-carousel-v2 {
            padding: 15px;
            margin-bottom: 20px;
          }

          .header-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .header-controls {
            align-self: flex-end;
          }

          .view-toggle {
            display: none;
          }
        }

        /* 自定義滾動條 */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(226,232,240,0.5);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(148,163,184,0.5);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(100,116,139,0.7);
        }
      `}</style>
    </div>
  );
};

export default VerticalCarousel;