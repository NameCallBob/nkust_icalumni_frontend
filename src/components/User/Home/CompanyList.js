import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination, Alert } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import 'css/user/homepage/CompanyList.css';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE_DESKTOP = 8; // 桌面每頁顯示 8 個
const ITEMS_PER_PAGE_MOBILE = 1;  // 手機每頁顯示 1 個

const CompanyListWithPagination = ({ companies }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 處理視窗大小變化，確保正確設置 isMobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = (totalPages) => {
    const pageItems = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (startPage > 1) pageItems.push(<Pagination.Ellipsis key="start-ellipsis" />);
    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    if (endPage < totalPages) pageItems.push(<Pagination.Ellipsis key="end-ellipsis" />);

    return (
      <Pagination>
        <Pagination.First onClick={() => handlePageChange(1)} />
        <Pagination.Prev onClick={() => handlePageChange(Math.max(1, currentPage - 1))} />
        {pageItems}
        <Pagination.Next onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
      </Pagination>
    );
  };

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

  return (
    <Container>
      {totalItems === 0 ? (
        <Alert variant="warning" className="mt-3">
          沒有找到此類別的公司資料。
        </Alert>
      ) : (
        <>
          <Row className="mt-3 fixed-height">
            <TransitionGroup component={null}>
              {currentCompanies.map((company, index) => (
                <CSSTransition key={index} timeout={500} classNames="fade">
                  <Col md={isMobile ? 12 : 3} className="mb-4 d-flex">
                    <div
                      className="text-center p-3 border"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleItemClick(company.member)} // 使用正確的 company.id
                    >
                      <img
                        src={company.photo}
                        alt={company.name}
                        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                      />
                      <h4>{company.name}</h4>
                      <p><strong>系友：</strong>{company.member_name}</p>
                      <p><strong>產品：</strong>{company.products}</p>
                    </div>
                  </Col>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </Row>
          {totalPages > 1 && renderPagination(totalPages)}
        </>
      )}
    </Container>
  );
};

export default CompanyListWithPagination;
