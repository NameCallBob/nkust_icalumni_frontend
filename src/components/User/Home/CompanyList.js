import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination, Alert } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import { handleImageError, getImageSrc } from '../../../utils/imageDefaults';

// 公司卡片子組件
const CompanyCard = ({ 
  company, 
  onCardClick,
  cardStyle,
  cardHoverStyle,
  imageContainerStyle,
  imageStyle,
  imageHoverStyle,
  cardContentStyle,
  companyNameStyle,
  infoItemStyle,
  infoLabelStyle,
  infoValueStyle,
  productTagStyle
}) => {
  // 將 hover 狀態移到子組件中
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      style={{
        ...cardStyle,
        ...(isHovered ? cardHoverStyle : {})
      }} 
      onClick={() => onCardClick(company.member)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={imageContainerStyle}>
        <img
          src={getImageSrc(company.photo, 'company')}
          alt={company.name}
          style={{
            ...imageStyle,
            ...(isHovered ? imageHoverStyle : {})
          }}
          onError={(e) => handleImageError(e, 'company')}
        />
      </div>
      <div style={cardContentStyle}>
        <div>
          <h3 style={companyNameStyle}>{company.name}</h3>
          <div style={infoItemStyle}>
            <span style={infoLabelStyle}>系級：</span>
            <span style={infoValueStyle}>{company.graduate_grade}</span>
          </div>
          <div style={infoItemStyle}>
            <span style={infoLabelStyle}>系友：</span>
            <span style={infoValueStyle}>{company.member_name}</span>
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <div style={{ ...infoItemStyle, alignItems: 'flex-start' }}>
            <span style={infoLabelStyle}>產品：</span>
            <div style={infoValueStyle}>
              {company.products.split(',').map((product, idx) => (
                <span key={idx} style={productTagStyle}>
                  {product.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompanyListWithPagination = ({ companies }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // 處理視窗大小變化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 滾動到頁面頂部以提升用戶體驗
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 定義分頁樣式
  const paginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
    marginBottom: '2rem',
  };
  
  const paginationItemStyle = {
    margin: '0 0.25rem',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    border: 'none',
    background: '#f8f9fa',
    color: '#495057',
  };
  
  const paginationActiveStyle = {
    ...paginationItemStyle,
    background: '#1e3a8a',
    color: 'white',
    boxShadow: '0 2px 8px rgba(30, 58, 138, 0.25)',
  };
  
  const paginationControlStyle = {
    ...paginationItemStyle,
    width: 'auto',
    padding: '0 10px',
    borderRadius: '20px',
  };

  const renderPagination = (totalPages) => {
    const pageItems = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);
    
    return (
      <div style={paginationStyle}>
        <button 
          onClick={() => handlePageChange(1)} 
          style={paginationControlStyle}
          disabled={currentPage === 1}
        >
          首頁
        </button>
        <button 
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
          style={paginationControlStyle}
          disabled={currentPage === 1}
        >
          上一頁
        </button>
        
        {startPage > 1 && (
          <>
            <button 
              onClick={() => handlePageChange(1)} 
              style={currentPage === 1 ? paginationActiveStyle : paginationItemStyle}
            >
              1
            </button>
            {startPage > 2 && <span style={{ margin: '0 0.5rem' }}>...</span>}
          </>
        )}
        
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
          <button 
            key={page} 
            onClick={() => handlePageChange(page)} 
            style={currentPage === page ? paginationActiveStyle : paginationItemStyle}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span style={{ margin: '0 0.5rem' }}>...</span>}
            <button 
              onClick={() => handlePageChange(totalPages)} 
              style={currentPage === totalPages ? paginationActiveStyle : paginationItemStyle}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button 
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} 
          style={paginationControlStyle}
          disabled={currentPage === totalPages}
        >
          下一頁
        </button>
        <button 
          onClick={() => handlePageChange(totalPages)} 
          style={paginationControlStyle}
          disabled={currentPage === totalPages}
        >
          末頁
        </button>
      </div>
    );
  };
  
  // 設定每頁顯示數量
  const ITEMS_PER_PAGE_DESKTOP = 8;
  const ITEMS_PER_PAGE_MOBILE = 1;
  const itemsPerPage = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP;
  const totalItems = companies.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentCompanies = companies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleItemClick = (id) => {
    navigate(`/alumni/${id}`);
  };
  
  // 卡片容器的樣式
  const cardContainerStyle = {
    padding: '1.5rem',
    marginBottom: '2rem',
  };
  
  // 卡片的主樣式
  const cardStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    background: 'white',
    border: '1px solid #e2e8f0',
  };

  // 卡片 hover 效果
  const cardHoverStyle = {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    borderColor: '#bfdbfe',
  };
  
  // 圖片容器樣式
  const imageContainerStyle = {
    position: 'relative',
    overflow: 'hidden',
    height: '220px',
  };
  
  // 圖片樣式
  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  };
  
  // 圖片 hover 效果
  const imageHoverStyle = {
    transform: 'scale(1.05)',
  };
  
  // 卡片內容樣式
  const cardContentStyle = {
    padding: '1.5rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };
  
  // 公司名稱樣式
  const companyNameStyle = {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#333',
    textAlign: 'center',
  };
  
  // 資訊項目樣式
  const infoItemStyle = {
    display: 'flex',
    marginBottom: '0.5rem',
    fontSize: '0.95rem',
    color: '#666',
  };
  
  // 資訊標籤樣式
  const infoLabelStyle = {
    fontWeight: '600',
    minWidth: '4rem',
    color: '#555',
  };
  
  // 資訊值樣式
  const infoValueStyle = {
    flexGrow: 1,
  };
  
  // 產品標籤樣式
  const productTagStyle = {
    display: 'inline-block',
    background: '#eff6ff',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    margin: '0.2rem',
    color: '#1e3a8a',
    border: '1px solid #bfdbfe',
  };
  
  return (
    <Container fluid style={{ padding: '0 2rem' }}>
      {totalItems === 0 ? (
        <Alert 
          variant="warning" 
          style={{
            marginTop: '2rem',
            borderRadius: '8px',
            padding: '1rem 1.5rem',
            fontSize: '1rem',
            textAlign: 'center',
          }}
        >
          沒有找到此類別的公司資料。
        </Alert>
      ) : (
        <>
          <Row style={{ marginTop: '2rem' }}>
            <TransitionGroup component={null}>
              {currentCompanies.map((company, index) => (
                <CSSTransition key={index} timeout={500} classNames="fade">
                  <Col 
                    xs={12} 
                    md={isMobile ? 12 : 6} 
                    lg={3} 
                    style={cardContainerStyle}
                  >
                    <CompanyCard 
                      company={company}
                      onCardClick={handleItemClick}
                      cardStyle={cardStyle}
                      cardHoverStyle={cardHoverStyle}
                      imageContainerStyle={imageContainerStyle}
                      imageStyle={imageStyle}
                      imageHoverStyle={imageHoverStyle}
                      cardContentStyle={cardContentStyle}
                      companyNameStyle={companyNameStyle}
                      infoItemStyle={infoItemStyle}
                      infoLabelStyle={infoLabelStyle}
                      infoValueStyle={infoValueStyle}
                      productTagStyle={productTagStyle}
                    />
                  </Col>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </Row>
          
          {/* 分頁控制 */}
          {totalPages > 1 && renderPagination(totalPages)}
        </>
      )}
      
      {/* 添加淡入淡出動畫的 CSS */}
      <style jsx="true">{`
        .fade-enter {
          opacity: 0;
          transform: translateY(20px);
        }
        .fade-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 500ms, transform 500ms;
        }
        .fade-exit {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-exit-active {
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 500ms, transform 500ms;
        }
      `}</style>
    </Container>
  );
};

export default CompanyListWithPagination;