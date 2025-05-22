import React, { useEffect, useState, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Axios from 'common/Axios';

// 公司卡片組件
const CompanyCard = ({ company, onClick, isActive, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredProductIndex, setHoveredProductIndex] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  
  // 最大顯示產品數
  const MAX_VISIBLE_PRODUCTS = 3;
  
  // 確保 company 存在，但在調用 hooks 之後再進行檢查
  if (!company) {
    return null;
  }
  
  // 安全地獲取 photo URL，確保它存在
  const photoUrl = company && company.photo 
    ? `${process.env.REACT_APP_BASE_URL}${company.photo}`
    : 'https://via.placeholder.com/400x300?text=無圖片';
    
  // 卡片樣式生成函數
  const getCardStyles = (isHovered, isActive) => {
    // 卡片樣式 - 增加卡片尺寸
    const cardStyle = {
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      opacity: isActive ? 1 : 0.7,
      transform: `${isActive ? 'scale(1)' : 'scale(0.95)'} ${isHovered ? 'translateY(-15px)' : 'translateY(0)'}`,
      // 增加較大的卡片尺寸
      maxWidth: '100%',
      margin: '0 auto',
    };

    // 圖片容器樣式 - 增加高度
    const imageContainerStyle = {
      overflow: 'hidden',
      position: 'relative',
      height: '280px', // 較大的圖片容器
    };

    // 圖片樣式 - 優化過渡效果
    const imageStyle = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      transform: isHovered ? 'scale(1.1) rotate(1deg)' : 'scale(1)',
    };

    // 內容區域樣式 - 增加間距，文字對齊
    const contentStyle = {
      padding: '2rem',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), white)',
      overflow: 'hidden',
    };

    // 公司名稱樣式 - 文字置中
    const nameStyle = {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#222',
      marginBottom: '1.2rem',
      textAlign: 'center',
      letterSpacing: '0.5px',
    };

    // 資訊項目樣式 - 文字對齊
    const infoItemStyle = {
      display: 'flex',
      marginBottom: '0.8rem',
      fontSize: '1rem',
      color: '#555',
      lineHeight: '1.6',
    };

    // 資訊標籤樣式
    const labelStyle = {
      fontWeight: '600',
      minWidth: '4rem',
      color: '#444',
      textAlign: 'left',
    };

    // 資訊值樣式 - 文字對齊
    const valueStyle = {
      flexGrow: 1,
      textAlign: 'left',
      paddingLeft: '0.5rem',
    };

    // 產品容器樣式 - 限制產品區域最大高度
    const productsContainerStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      maxHeight: '120px',
      overflow: 'auto',
      marginTop: '0.5rem',
      scrollbarWidth: 'thin',
      scrollbarColor: '#e0e0e0 transparent',
    };

    // 產品標籤樣式 - 更具視覺吸引力
    const productStyle = {
      display: 'inline-block',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
      borderRadius: '30px',
      padding: '0.35rem 0.8rem',
      margin: '0.3rem 0.2rem',
      fontSize: '0.9rem',
      color: '#0066cc',
      boxShadow: '0 2px 8px rgba(0, 102, 204, 0.15)',
      transition: 'all 0.3s ease',
      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      maxWidth: '140px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      position: 'relative',
    };

    // 產品tooltip樣式 - 顯示完整內容
    const tooltipStyle = {
      position: 'absolute',
      bottom: 'calc(100% + 10px)',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '0.85rem',
      zIndex: 100,
      whiteSpace: 'normal',
      maxWidth: '200px',
      width: 'auto',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
      opacity: 0,
      visibility: 'hidden',
      transition: 'all 0.3s ease',
      pointerEvents: 'none',
    };

    // tooltip箭頭樣式
    const tooltipArrowStyle = {
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      borderWidth: '5px',
      borderStyle: 'solid',
      borderColor: 'rgba(0, 0, 0, 0.8) transparent transparent transparent',
    };

    // 裝飾元素動畫 - 更華麗的裝飾
    const decorationStyle = {
      position: 'absolute',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #6c63ff 0%, #3b82f6 100%)',
      top: isHovered ? '-15px' : '-30px',
      right: isHovered ? '-15px' : '-30px',
      opacity: isHovered ? 0.8 : 0,
      transition: 'all 0.5s ease',
      zIndex: 1,
    };

    // 添加遮罩效果 - 增強滑動感
    const overlayStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)',
      opacity: isHovered ? 0.5 : 0,
      transition: 'opacity 0.5s ease',
      pointerEvents: 'none',
      zIndex: 2,
    };

    // 新增卡片邊框光暈效果
    const glowEffectStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: '16px',
      boxShadow: isHovered ? '0 0 30px rgba(107, 99, 255, 0.3)' : 'none',
      transition: 'box-shadow 0.5s ease',
      pointerEvents: 'none',
      zIndex: 0,
    };
    
    return {
      cardStyle,
      imageContainerStyle,
      imageStyle,
      contentStyle,
      nameStyle,
      infoItemStyle,
      labelStyle,
      valueStyle,
      productStyle,
      decorationStyle,
      overlayStyle,
      glowEffectStyle,
      tooltipStyle,
      tooltipArrowStyle,
      productsContainerStyle
    };
  };


  // 取得所有樣式對象
  const { 
    cardStyle, 
    imageContainerStyle, 
    imageStyle, 
    contentStyle, 
    nameStyle, 
    infoItemStyle, 
    labelStyle, 
    valueStyle, 
    productStyle, 
    decorationStyle, 
    overlayStyle, 
    glowEffectStyle,
    tooltipStyle,
    tooltipArrowStyle,
    productsContainerStyle
  } = getCardStyles(isHovered, isActive);
  
  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`company-card ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
    >
      <div style={glowEffectStyle}></div>
      <div style={decorationStyle}></div>
      <div style={imageContainerStyle}>
        <div style={overlayStyle}></div>
        <img
          src={photoUrl}
          alt={company.name || '公司'}
          style={imageStyle}
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
                          {hoveredProductIndex === idx && (
                            <div style={{
                              ...tooltipStyle,
                              opacity: 1,
                              visibility: 'visible'
                            }}>
                              {product}
                              <div style={tooltipArrowStyle}></div>
                            </div>
                          )}
                        </span>
                      ))}
                      
                      {!showAllProducts && productList.length > MAX_VISIBLE_PRODUCTS && (
                        <span 
                          style={{
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, #eef6ff 0%, #dae7f7 100%)',
                            borderRadius: '30px',
                            padding: '0.35rem 0.8rem',
                            margin: '0.3rem 0.2rem',
                            fontSize: '0.9rem',
                            color: '#3a75c4',
                            boxShadow: '0 2px 8px rgba(0, 102, 204, 0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
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
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, #eef6ff 0%, #dae7f7 100%)',
                            borderRadius: '30px',
                            padding: '0.35rem 0.8rem',
                            margin: '0.3rem 0.2rem',
                            fontSize: '0.9rem',
                            color: '#3a75c4',
                            boxShadow: '0 2px 8px rgba(0, 102, 204, 0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef(null);
  const navigate = useNavigate();
  
  const apilist = {
    "最多點閱": "company/data/mostView/",
    "最新上架": "company/data/newUpload/"
  };

  const handleItemClick = (id) => {
    navigate(`/alumni/${id}`);
  };

  useEffect(() => {
    Axios().get(apilist[title])
      .then((res) => {
        setCompanies(res.data || []);
      })
      .catch(error => {
        console.error("Error fetching companies:", error);
        setCompanies([]);
      });
  }, [title]);

  // 自動播放功能
  useEffect(() => {
    const play = () => {
      if (isAutoPlay && companies.length > 0) {
        setIsTransitioning(true);
        setActiveIndex((prevIndex) => (prevIndex + 1) % (Math.ceil(companies.length / 2) * 2));
        setTimeout(() => setIsTransitioning(false), 500);
      }
    };

    autoPlayRef.current = play;
  }, [isAutoPlay, companies.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoPlayRef.current) {
        autoPlayRef.current();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 暫停/恢復自動播放
  const pauseAutoPlay = () => setIsAutoPlay(false);
  const resumeAutoPlay = () => setIsAutoPlay(true);

  // 手動切換到下一個或上一個
  const nextSlide = () => {
    setIsTransitioning(true);
    setActiveIndex((prevIndex) => (prevIndex + 2) % (Math.ceil(companies.length / 2) * 2));
    setTimeout(() => setIsTransitioning(false), 500);
    pauseAutoPlay();
    setTimeout(resumeAutoPlay, 8000);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setActiveIndex((prevIndex) => (prevIndex - 2 + companies.length) % (Math.ceil(companies.length / 2) * 2));
    setTimeout(() => setIsTransitioning(false), 500);
    pauseAutoPlay();
    setTimeout(resumeAutoPlay, 8000);
  };

  // 標題樣式
  const titleStyle = {
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: '#333',
    position: 'relative',
    display: 'inline-block',
  };

  // 標題裝飾線
  const titleDecorationStyle = {
    content: '""',
    position: 'absolute',
    width: '60%',
    height: '3px',
    bottom: '-8px',
    left: '0',
    background: 'linear-gradient(90deg, #6c63ff, #3b82f6)',
    borderRadius: '2px',
  };

  // 卡片容器樣式 - 增加間距
  const carouselContainerStyle = {
    position: 'relative',
    // padding: '2rem 3.5rem',
    // margin: '2rem 0 3rem',
    overflow: 'hidden',
  };

  // 輪播控制器樣式 - 更大的控制按鈕
  const controlStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    transition: 'all 0.3s ease',
    zIndex: 10,
    border: '1px solid #f0f0f0',
  };

  // 進度指示器樣式
  const indicatorsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1.5rem',
  };

  const indicatorStyle = (index) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: Math.floor(activeIndex / 2) === index ? '#3b82f6' : '#e0e0e0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    transform: Math.floor(activeIndex / 2) === index ? 'scale(1.3)' : 'scale(1)',
  });

  // 計算總頁數
  const totalPages = Math.ceil(companies.length / 2);

  // 根據當前活動索引獲取顯示的公司
  const getPageContent = (index) => {
    // 確保 companies 有數據
    if (!companies || companies.length === 0) {
      return [];
    }
    
    const adjustedIndex = index % companies.length;
    const nextIndex = (index + 1) % companies.length;
    
    return [
      companies[adjustedIndex],
      companies.length > 1 ? companies[nextIndex] : null,
    ].filter(Boolean); // 過濾掉 null 或 undefined 值
  };

  // 只有當 companies 有數據時才獲取當前公司
  const currentCompanies = companies.length > 0 ? getPageContent(activeIndex) : [];

  return (
    <div className="vertical-carousel">
      <Row>
        <Col>
          <h4 style={titleStyle}>
            {title}
            <div style={titleDecorationStyle}></div>
          </h4>
        </Col>
      </Row>

      <div style={carouselContainerStyle} 
        onMouseEnter={pauseAutoPlay} 
        onMouseLeave={resumeAutoPlay}
        className={isTransitioning ? 'transitioning' : ''}
      >
        {/* 左箭頭 */}
        <div 
          style={{ ...controlStyle, left: '0' }} 
          onClick={prevSlide}
          className="carousel-control prev"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* 右箭頭 */}
        <div 
          style={{ ...controlStyle, right: '0' }} 
          onClick={nextSlide}
          className="carousel-control next"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6L15 12L9 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* 桌面版雙欄顯示 */}
        <Row className="d-none d-md-flex justify-content-center">
          {currentCompanies.length > 0 ? (
            currentCompanies.map((company, index) => (
              <Col md={6} key={index} className="p-3">
                {company && (
                  <CompanyCard 
                    company={company} 
                    onClick={() => handleItemClick(company.member)}
                    isActive={true}
                    index={index}
                  />
                )}
              </Col>
            ))
          ) : (
            <Col md={12}>
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                正在載入資料...
              </div>
            </Col>
          )}
        </Row>

        {/* 行動裝置單欄顯示 */}
        <Row className="d-flex d-md-none">
          {companies.length > 0 && activeIndex < companies.length ? (
            <Col xs={12} className="p-3">
              {companies[activeIndex % companies.length] && (
                <CompanyCard 
                  company={companies[activeIndex % companies.length]} 
                  onClick={() => handleItemClick(companies[activeIndex % companies.length].member)}
                  isActive={true}
                  index={0}
                />
              )}
            </Col>
          ) : (
            <Col xs={12}>
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                正在載入資料...
              </div>
            </Col>
          )}
        </Row>

        {/* 進度指示器 */}
        <div style={indicatorsStyle}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <div 
              key={index} 
              style={indicatorStyle(index)}
              onClick={() => {
                setIsTransitioning(true);
                setActiveIndex(index * 2);
                setTimeout(() => setIsTransitioning(false), 500);
                pauseAutoPlay();
                setTimeout(resumeAutoPlay, 8000);
              }}
            />
          ))}
        </div>
      </div>

      {/* 添加樣式 */}
      <style jsx="true">{`
        .vertical-carousel {
          padding: 1rem;
          overflow: hidden;
        }

        .carousel-control {
          opacity: 0.8;
          transform: translateY(-50%) scale(0.9);
        }

        .carousel-control:hover {
          opacity: 1;
          transform: translateY(-50%) scale(1.05);
        }

        .transitioning .company-card {
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                      opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .company-card {
          animation: fadeIn 0.8s ease forwards;
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                      opacity 0.6s ease,
                      box-shadow 0.6s ease;
        }

        .company-card.active.hovered {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        /* 自定義滾動條樣式 */
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }

        .fade-enter {
          opacity: 0;
          transform: scale(0.9) translateY(20px);
        }
        .fade-enter-active {
          opacity: 1;
          transform: scale(1) translateY(0);
          transition: opacity 600ms, transform 600ms;
        }
        .fade-exit {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        .fade-exit-active {
          opacity: 0;
          transform: scale(0.9) translateY(-20px);
          transition: opacity 600ms, transform 600ms;
        }

        /* 增加滑動特效 */
        .slide-left-enter {
          transform: translateX(100%);
          opacity: 0;
        }
        .slide-left-enter-active {
          transform: translateX(0);
          opacity: 1;
          transition: all 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .slide-left-exit {
          transform: translateX(0);
          opacity: 1;
        }
        .slide-left-exit-active {
          transform: translateX(-100%);
          opacity: 0;
          transition: all 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .slide-right-enter {
          transform: translateX(-100%);
          opacity: 0;
        }
        .slide-right-enter-active {
          transform: translateX(0);
          opacity: 1;
          transition: all 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .slide-right-exit {
          transform: translateX(0);
          opacity: 1;
        }
        .slide-right-exit-active {
          transform: translateX(100%);
          opacity: 0;
          transition: all 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @media (max-width: 768px) {
          .carousel-control {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default VerticalCarousel;