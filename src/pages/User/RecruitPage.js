import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Modal, 
  Button, 
  Container, 
  Carousel, 
  Card, 
  Badge, 
  Row, 
  Col, 
  Spinner,
  Pagination
} from 'react-bootstrap';
import 'css/recruit.css';
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';
// 預防 XSS 攻擊
import DOMPurify from 'dompurify';
import SEO from 'SEO';

function RecruitPage() {
  const [show, setShow] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState({});
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' 或 'card'

  const jobsPerPage = 10;

  const handleClose = () => setShow(false);

  const handleShow = (job) => {
    setShow(true);
    setDetailLoading(true);
    Axios()
      .get('/recruit/data/getOne/', {
        params: { id: job.id },
      })
      .then((res) => {
        setSelectedJob(res.data);
      })
      .catch((err) => {
        setError('載入職位詳情時發生錯誤，請稍後再試');
      })
      .finally(() => {
        setDetailLoading(false);
      });
  };

  const fetchJobs = (page = 1) => {
    setLoading(true);
    setError(null);
    
    Axios()
      .get('/recruit/data/tableOutput/', {
        params: {
          page: page,
          page_size: jobsPerPage
        }
      })
      .then((res) => {
        setJobs(res.data.results);
        // 假設後端回傳 count 和 total_pages
        setTotalPages(Math.ceil(res.data.count / jobsPerPage) || 1);
      })
      .catch((err) => {
        setError('伺服器異常，請稍後再試');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 計算職位是否接近截止日期（7天內）
  const isDeadlineSoon = (deadlineStr) => {
    const deadline = new Date(deadlineStr);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
  };

  // 分頁控制元件
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    let items = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // 調整 startPage 確保顯示足夠頁數
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // 添加首頁按鈕
    if (startPage > 1) {
      items.push(
        <Pagination.First key="first" onClick={() => handlePageChange(1)} />
      );
    }

    // 添加上一頁按鈕
    if (currentPage > 1) {
      items.push(
        <Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} />
      );
    }

    // 添加頁碼
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    // 添加下一頁按鈕
    if (currentPage < totalPages) {
      items.push(
        <Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} />
      );
    }

    // 添加末頁按鈕
    if (endPage < totalPages) {
      items.push(
        <Pagination.Last key="last" onClick={() => handlePageChange(totalPages)} />
      );
    }

    return <Pagination className="justify-content-center mt-4">{items}</Pagination>;
  };

  // 表格視圖
  const renderTableView = () => (
    <div className="table-responsive">
      <Table hover className="job-table">
        <thead className="table-primary">
          <tr>
            <th className="d-none d-md-table-cell">編號</th>
            <th>職位</th>
            <th>公司</th>
            <th className="d-none d-md-table-cell">發布時間</th>
            <th>截止時間</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr
              key={job.id}
              onClick={() => handleShow(job)}
              className="job-row"
              style={{ cursor: 'pointer' }}
            >
              <td className="d-none d-md-table-cell">{(currentPage - 1) * jobsPerPage + index + 1}</td>
              <td>
                {job.title}
                {isDeadlineSoon(job.deadline) && (
                  <Badge pill bg="danger" className="ms-2">即將截止</Badge>
                )}
              </td>
              <td>{job.company_name}</td>
              <td className="d-none d-md-table-cell">{job.release_date}</td>
              <td>{job.deadline}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  // 卡片視圖（適合行動裝置）
  const renderCardView = () => (
    <Row className="g-4">
      {jobs.map((job, index) => (
        <Col key={job.id} xs={12} md={6} lg={4}>
          <Card 
            className="h-100 job-card" 
            onClick={() => handleShow(job)}
            style={{ cursor: 'pointer' }}
          >
            <Card.Body>
              <Card.Title>
                {job.title}
                {isDeadlineSoon(job.deadline) && (
                  <Badge pill bg="danger" className="ms-2">即將截止</Badge>
                )}
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{job.company_name}</Card.Subtitle>
              <div className="d-flex justify-content-between mt-3">
                <small className="text-muted">發布: {job.release_date}</small>
                <small className="text-muted">截止: {job.deadline}</small>
              </div>
            </Card.Body>
            <Card.Footer className="text-center bg-white border-0">
              <small className="text-primary">點擊查看詳情</small>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <Container className="mt-5 pb-5 recruit-page">
      <SEO
        main={false}
        title="招募查詢"
        description="了解智慧商務系友會中系友們的招募需求與最新機會，加入我們，共創未來。"
        keywords={["智慧商務", "招募", "招聘", "加入系友會"]}
      />
      
      <h1 className="mb-4 text-center">系友公司徵才資訊</h1>
      
      {/* 視圖切換和搜尋欄 */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="btn-group" role="group" aria-label="切換視圖">
          <Button 
            variant={viewMode === 'table' ? 'primary' : 'outline-primary'} 
            onClick={() => setViewMode('table')}
            className="d-none d-md-inline"
          >
            表格視圖
          </Button>
          <Button 
            variant={viewMode === 'card' ? 'primary' : 'outline-primary'} 
            onClick={() => setViewMode('card')}
          >
            {window.innerWidth >= 768 ? '卡片視圖' : '視圖'}
          </Button>
        </div>
      </div>

      {/* 載入中狀態 */}
      {loading && (
        <div className="text-center my-5">
          <LoadingSpinner />
          <p className="mt-2">載入徵才資訊中...</p>
        </div>
      )}

      {/* 錯誤訊息 */}
      {error && !loading && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {/* 無職位訊息 */}
      {!loading && !error && jobs.length === 0 && (
        <div className="no-job text-center py-5 my-4 bg-light rounded">
          <h2>暫無招募</h2>
          <p>目前沒有可用的招募資訊，請稍後再來查看。</p>
        </div>
      )}

      {/* 職位列表 - 根據視圖模式顯示 */}
      {!loading && !error && jobs.length > 0 && (
        <>
          {viewMode === 'table' && window.innerWidth >= 768 ? renderTableView() : renderCardView()}
          {renderPagination()}
        </>
      )}

      {/* 職位詳情模態框 */}
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>{selectedJob.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailLoading ? (
            <div className="text-center py-5">
              <LoadingSpinner />
              <p className="mt-2">載入職位資訊中...</p>
            </div>
          ) : (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <div className="detail-card p-3 bg-light rounded mb-3">
                    <h5 className="border-bottom pb-2 mb-3">基本資訊</h5>
                    <p><strong>公司名稱：</strong> {selectedJob.company_name}</p>
                    <p><strong>發布時間：</strong> {selectedJob.release_date}</p>
                    <p><strong>截止時間：</strong> {selectedJob.deadline}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-card p-3 bg-light rounded">
                    <h5 className="border-bottom pb-2 mb-3">聯絡方式</h5>
                    <p>
                      <strong>聯絡人：</strong> 
                      {selectedJob.contact && selectedJob.contact.name
                        ? selectedJob.contact.name
                        : '未提供'}
                    </p>
                    <p>
                      <strong>Email：</strong> 
                      {selectedJob.contact && selectedJob.contact.email
                        ? <a href={`mailto:${selectedJob.contact.email}`}>{selectedJob.contact.email}</a>
                        : '未提供'}
                    </p>
                    <p>
                      <strong>電話：</strong> 
                      {selectedJob.contact && selectedJob.contact.phone
                        ? selectedJob.contact.phone
                        : '未提供'}
                    </p>
                  </div>
                </Col>
              </Row>

              <div className="job-description mt-4">
                <h5 className="border-bottom pb-2 mb-3">職位詳細資訊</h5>
                <div
                  className="job-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(selectedJob.intro),
                  }}
                />
              </div>

              {/* 照片幻燈片展示 */}
              {selectedJob.images && selectedJob.images.length > 0 && (
                <div className="photos-section mt-4">
                  <h5 className="border-bottom pb-2 mb-3">公司環境照片</h5>
                  <Carousel 
                    className="job-carousel" 
                    indicators={selectedJob.images.length > 1}
                    controls={selectedJob.images.length > 1}
                  >
                    {selectedJob.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <div className="carousel-img-container">
                          <img
                            className="d-block w-100 rounded"
                            src={process.env.REACT_APP_BASE_URL + image.image}
                            alt={`${selectedJob.company_name} 環境照片 ${index + 1}`}
                          />
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!detailLoading && selectedJob.contact && selectedJob.contact.email && (
            <Button 
              variant="primary" 
              href={`mailto:${selectedJob.contact.email}?subject=應徵${selectedJob.title}職位`}
            >
              立即應徵
            </Button>
          )}
          <Button variant="secondary" onClick={handleClose}>
            關閉
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default RecruitPage;