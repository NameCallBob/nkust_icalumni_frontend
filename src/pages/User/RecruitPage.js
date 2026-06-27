import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as SwiperPagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import AppModal from 'components/common/AppModal';
import 'css/recruit.css';
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';
// 預防 XSS 攻擊
import DOMPurify from 'dompurify';
import SEO from 'SEO';
import { handleImageError, getImageSrc } from '../../utils/imageDefaults';
import { BsCalendar, BsCalendarX, BsBuilding, BsEnvelope, BsTelephone, BsPerson } from 'react-icons/bs';

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
        <button key="first" type="button" className="join-item btn btn-sm" onClick={() => handlePageChange(1)}>«</button>
      );
    }

    // 添加上一頁按鈕
    if (currentPage > 1) {
      items.push(
        <button key="prev" type="button" className="join-item btn btn-sm" onClick={() => handlePageChange(currentPage - 1)}>‹</button>
      );
    }

    // 添加頁碼
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <button
          key={number}
          type="button"
          className={`join-item btn btn-sm ${number === currentPage ? 'btn-active btn-primary' : ''}`}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </button>
      );
    }

    // 添加下一頁按鈕
    if (currentPage < totalPages) {
      items.push(
        <button key="next" type="button" className="join-item btn btn-sm" onClick={() => handlePageChange(currentPage + 1)}>›</button>
      );
    }

    // 添加末頁按鈕
    if (endPage < totalPages) {
      items.push(
        <button key="last" type="button" className="join-item btn btn-sm" onClick={() => handlePageChange(totalPages)}>»</button>
      );
    }

    return (
      <div className="flex justify-center mt-4">
        <div className="join">{items}</div>
      </div>
    );
  };

  // 表格視圖
  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="table job-table">
        <thead className="table-header-corporate">
          <tr>
            <th className="hidden md:table-cell">編號</th>
            <th>職位</th>
            <th>公司</th>
            <th className="hidden md:table-cell">發布時間</th>
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
              <td className="hidden md:table-cell">{(currentPage - 1) * jobsPerPage + index + 1}</td>
              <td>
                {job.title}
                {isDeadlineSoon(job.deadline) && (
                  <span className="deadline-soon-badge ml-2">即將截止</span>
                )}
              </td>
              <td style={{ color: '#2563eb' }}>{job.company_name}</td>
              <td className="hidden md:table-cell" style={{ color: '#475569', fontSize: '0.875rem' }}>
                <BsCalendar style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {job.release_date}
              </td>
              <td style={{ color: '#475569', fontSize: '0.875rem' }}>
                <BsCalendarX style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {job.deadline}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // 卡片視圖（適合行動裝置）
  const renderCardView = () => (
    <div className="grid grid-cols-12 gap-4">
      {jobs.map((job, index) => (
        <div key={job.id} className="col-span-12 md:col-span-6 lg:col-span-4">
          <div
            className="job-card"
            onClick={() => handleShow(job)}
            style={{ cursor: 'pointer', height: '100%' }}
          >
            <div style={{ padding: '20px', flex: 1 }}>
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <h5
                  style={{
                    margin: 0,
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#0f172a',
                    lineHeight: '1.4',
                  }}
                >
                  {job.title}
                </h5>
                {isDeadlineSoon(job.deadline) && (
                  <span className="deadline-soon-badge" style={{ flexShrink: 0 }}>即將截止</span>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '12px',
                  color: '#2563eb',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                <BsBuilding />
                {job.company_name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BsCalendar />
                  發布: {job.release_date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BsCalendarX />
                  截止: {job.deadline}
                </span>
              </div>
            </div>
            <div
              style={{
                borderTop: '1px solid #e2e8f0',
                padding: '12px 20px',
                background: '#f8fafc',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '0.875rem',
                  color: '#2563eb',
                  fontWeight: '500',
                }}
              >
                查看詳情 →
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <SEO
        main={false}
        title="招募查詢"
        description="了解智慧商務系友會中系友們的招募需求與最新機會，加入我們，共創未來。"
        keywords={["智慧商務", "招募", "招聘", "加入系友會"]}
      />

      {/* Page Header */}
      <div
        style={{
          background: '#1e3a8a',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
        }}
      >
        <h1
          style={{
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '2rem',
            margin: 0,
            letterSpacing: '0.02em',
          }}
        >
          系友企業職缺
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '8px 0 0', fontSize: '1rem' }}>
          探索系友企業徵才機會，共創職涯未來
        </p>
      </div>

      <div className="container mx-auto px-4 recruit-page" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
        {/* View Toggle */}
        <div className="flex justify-between items-center mb-4">
          <div className="btn-group" role="group" aria-label="切換視圖">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className="hidden md:inline-block"
              style={{
                padding: '8px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px 0 0 6px',
                background: viewMode === 'table' ? '#1e3a8a' : '#ffffff',
                color: viewMode === 'table' ? '#ffffff' : '#475569',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              表格視圖
            </button>
            <button
              type="button"
              onClick={() => setViewMode('card')}
              style={{
                padding: '8px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: viewMode === 'table' ? '0 6px 6px 0' : '6px',
                background: viewMode === 'card' ? '#1e3a8a' : '#ffffff',
                color: viewMode === 'card' ? '#ffffff' : '#475569',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              {window.innerWidth >= 768 ? '卡片視圖' : '視圖'}
            </button>
          </div>
        </div>

        {/* 載入中狀態 */}
        {loading && (
          <div className="text-center my-5">
            <LoadingSpinner />
            <p className="mt-2" style={{ color: '#475569' }}>載入徵才資訊中...</p>
          </div>
        )}

        {/* 錯誤訊息 */}
        {error && !loading && (
          <div
            style={{
              padding: '16px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              textAlign: 'center',
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        {/* 無職位訊息 */}
        {!loading && !error && jobs.length === 0 && (
          <div
            className="no-job text-center py-5 my-4"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          >
            <h2 style={{ color: '#94a3b8', fontWeight: '600' }}>暫無招募</h2>
            <p style={{ color: '#475569' }}>目前沒有可用的招募資訊，請稍後再來查看。</p>
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
        <AppModal
          show={show}
          onHide={handleClose}
          size="lg"
          variant="showcase"
          title={selectedJob.title}
          footer={
            <>
              {!detailLoading && selectedJob.contact && selectedJob.contact.email && (
                <a
                  href={`mailto:${selectedJob.contact.email}?subject=應徵${selectedJob.title}職位`}
                  style={{
                    padding: '8px 20px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  立即應徵
                </a>
              )}
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: '8px 20px',
                  background: '#ffffff',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                關閉
              </button>
            </>
          }
        >
          {detailLoading ? (
            <div className="text-center py-5">
              <LoadingSpinner />
              <p className="mt-2" style={{ color: '#475569' }}>載入職位資訊中...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-12 md:col-span-6">
                  <div
                    style={{
                      padding: '16px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      minHeight: '180px',
                    }}
                  >
                    <h5
                      style={{
                        color: '#1e3a8a',
                        fontWeight: '600',
                        paddingBottom: '10px',
                        borderBottom: '1px solid #e2e8f0',
                        marginBottom: '12px',
                      }}
                    >
                      基本資訊
                    </h5>
                    <p style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#0f172a' }}>
                      <strong>公司名稱：</strong>
                      <span style={{ color: '#2563eb' }}>{selectedJob.company_name}</span>
                    </p>
                    <p style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#0f172a' }}>
                      <BsCalendar style={{ marginRight: '6px', verticalAlign: 'middle', color: '#475569' }} />
                      <strong>發布時間：</strong> {selectedJob.release_date}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a' }}>
                      <BsCalendarX style={{ marginRight: '6px', verticalAlign: 'middle', color: '#475569' }} />
                      <strong>截止時間：</strong> {selectedJob.deadline}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <div
                    style={{
                      padding: '16px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      minHeight: '180px',
                    }}
                  >
                    <h5
                      style={{
                        color: '#1e3a8a',
                        fontWeight: '600',
                        paddingBottom: '10px',
                        borderBottom: '1px solid #e2e8f0',
                        marginBottom: '12px',
                      }}
                    >
                      聯絡方式
                    </h5>
                    <p style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#0f172a' }}>
                      <BsPerson style={{ marginRight: '6px', verticalAlign: 'middle', color: '#475569' }} />
                      <strong>聯絡人：</strong>
                      {selectedJob.contact && selectedJob.contact.name
                        ? selectedJob.contact.name
                        : '未提供'}
                    </p>
                    <p style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#0f172a' }}>
                      <BsEnvelope style={{ marginRight: '6px', verticalAlign: 'middle', color: '#475569' }} />
                      <strong>Email：</strong>
                      {selectedJob.contact && selectedJob.contact.email
                        ? <a href={`mailto:${selectedJob.contact.email}`} style={{ color: '#2563eb' }}>{selectedJob.contact.email}</a>
                        : '未提供'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a' }}>
                      <BsTelephone style={{ marginRight: '6px', verticalAlign: 'middle', color: '#475569' }} />
                      <strong>電話：</strong>
                      {selectedJob.contact && selectedJob.contact.phone
                        ? selectedJob.contact.phone
                        : '未提供'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="job-description mt-4">
                <h5
                  style={{
                    color: '#1e3a8a',
                    fontWeight: '600',
                    paddingBottom: '10px',
                    borderBottom: '1px solid #e2e8f0',
                    marginBottom: '16px',
                  }}
                >
                  職位詳細資訊
                </h5>
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
                  <h5
                    style={{
                      color: '#1e3a8a',
                      fontWeight: '600',
                      paddingBottom: '10px',
                      borderBottom: '1px solid #e2e8f0',
                      marginBottom: '16px',
                    }}
                  >
                    公司環境照片
                  </h5>
                  <Swiper
                    className="job-carousel"
                    modules={[SwiperPagination, Navigation]}
                    pagination={selectedJob.images.length > 1 ? { clickable: true } : false}
                    navigation={selectedJob.images.length > 1}
                  >
                    {selectedJob.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div className="carousel-img-container">
                          <img
                            className="block w-full rounded"
                            src={getImageSrc(process.env.REACT_APP_BASE_URL + image.image, 'company')}
                            alt={`${selectedJob.company_name} 環境照片 ${index + 1}`}
                            style={{ backgroundColor: '#f8fafc' }}
                            onError={(e) => handleImageError(e, 'company')}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </>
          )}
        </AppModal>
      </div>
    </div>
  );
}

export default RecruitPage;
