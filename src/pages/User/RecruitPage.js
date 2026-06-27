import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as SwiperPagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import AppModal from 'components/common/AppModal';
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';
// 預防 XSS 攻擊
import DOMPurify from 'dompurify';
import SEO from 'SEO';
import { handleImageError, getImageSrc } from '../../utils/imageDefaults';
import { BsCalendar, BsCalendarX, BsBuilding, BsEnvelope, BsTelephone, BsPerson } from 'react-icons/bs';
import { Card, Button, Badge, EmptyState, ModalSection, ModalGrid, InfoItem } from 'components/common/ui';
import { Briefcase, Table2, LayoutGrid, ArrowRight, AlertTriangle } from 'lucide-react';

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
        // 合併列表已有欄位（如 company_name）作為後備，避免詳情回傳缺欄位時顯示空白
        setSelectedJob({ ...job, ...res.data });
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
      <div className="flex justify-center mt-8">
        <div className="join shadow-sm">{items}</div>
      </div>
    );
  };

  // 表格視圖
  const renderTableView = () => (
    <div className="overflow-x-auto rounded-2xl border border-base-300/70 bg-base-100 shadow-sm">
      <table className="table">
        <thead>
          <tr className="bg-base-200/60 text-base-content/60 text-xs uppercase tracking-wider">
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
              className="hover cursor-pointer transition-colors"
            >
              <td className="hidden md:table-cell text-base-content/50">{(currentPage - 1) * jobsPerPage + index + 1}</td>
              <td>
                <span className="font-semibold text-base-content">{job.title}</span>
                {isDeadlineSoon(job.deadline) && (
                  <Badge variant="warning" className="ml-2 align-middle">即將截止</Badge>
                )}
              </td>
              <td>
                <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                  <BsBuilding className="shrink-0" />
                  {job.company_name}
                </span>
              </td>
              <td className="hidden md:table-cell text-sm text-base-content/60">
                <span className="inline-flex items-center gap-1.5">
                  <BsCalendar className="shrink-0" />
                  {job.release_date}
                </span>
              </td>
              <td className="text-sm text-base-content/60">
                <span className="inline-flex items-center gap-1.5">
                  <BsCalendarX className="shrink-0" />
                  {job.deadline}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // 卡片視圖（適合行動裝置）
  const renderCardView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {jobs.map((job, index) => (
        <Card
          key={job.id}
          hover
          padding="none"
          onClick={() => handleShow(job)}
          className="group flex h-full cursor-pointer flex-col overflow-hidden"
        >
          <div className="flex-1 p-5 sm:p-6">
            <div className="mb-3 flex items-start justify-between gap-2">
              <h3 className="font-serif text-lg font-bold leading-snug text-base-content break-words">
                {job.title}
              </h3>
              {isDeadlineSoon(job.deadline) && (
                <Badge variant="warning" className="shrink-0">即將截止</Badge>
              )}
            </div>

            <div className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              <BsBuilding className="shrink-0" />
              <span className="break-words">{job.company_name}</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-base-content/60">
              <span className="inline-flex items-center gap-1.5">
                <BsCalendar className="shrink-0" />
                發布: {job.release_date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BsCalendarX className="shrink-0" />
                截止: {job.deadline}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 border-t border-base-200 bg-base-200/40 px-5 py-3 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
            查看詳情
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200/40">
      <SEO
        main={false}
        title="招募查詢"
        description="了解智慧商務系友會中系友們的招募需求與最新機會，加入我們，共創未來。"
        keywords={["智慧商務", "招募", "招聘", "加入系友會"]}
      />

      {/* Page Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px), radial-gradient(circle at 70% 60%, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            <Briefcase className="h-4 w-4" />
            Careers
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-wide text-white sm:text-4xl">
            系友企業職缺
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/70 sm:text-base">
            探索系友企業徵才機會，共創職涯未來
          </p>
          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-secondary to-primary" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* View Toggle */}
        <div className="mb-6 flex items-center justify-end">
          <div
            className="inline-flex rounded-xl border border-base-300/70 bg-base-100 p-1 shadow-sm"
            role="group"
            aria-label="切換視圖"
          >
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`hidden items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors md:inline-flex ${
                viewMode === 'table'
                  ? 'bg-primary text-primary-content shadow-sm'
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              <Table2 className="h-4 w-4" />
              表格視圖
            </button>
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'card'
                  ? 'bg-primary text-primary-content shadow-sm'
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              {window.innerWidth >= 768 ? '卡片視圖' : '視圖'}
            </button>
          </div>
        </div>

        {/* 載入中狀態 */}
        {loading && (
          <div className="my-16 text-center">
            <LoadingSpinner />
            <p className="mt-3 text-sm text-base-content/60">載入徵才資訊中...</p>
          </div>
        )}

        {/* 錯誤訊息 */}
        {error && !loading && (
          <div
            className="flex items-center justify-center gap-2 rounded-2xl border border-error/30 bg-error/5 px-4 py-4 text-center font-medium text-error"
            role="alert"
          >
            <AlertTriangle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {/* 無職位訊息 */}
        {!loading && !error && jobs.length === 0 && (
          <Card padding="none" className="overflow-hidden">
            <EmptyState
              icon={<Briefcase className="h-8 w-8" />}
              title="暫無招募"
              description="目前沒有可用的招募資訊，請稍後再來查看。"
            />
          </Card>
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
          title={selectedJob.title}
          icon={<Briefcase size={18} />}
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                關閉
              </Button>
              {!detailLoading && selectedJob.contact && selectedJob.contact.email && (
                <a
                  href={`mailto:${selectedJob.contact.email}?subject=應徵${selectedJob.title}職位`}
                  className="btn btn-primary btn-sm"
                >
                  立即應徵
                </a>
              )}
            </>
          }
        >
          {detailLoading ? (
            <div className="py-12 text-center">
              <LoadingSpinner />
              <p className="mt-3 text-sm text-base-content/60">載入職位資訊中...</p>
            </div>
          ) : (
            <>
              <ModalGrid cols={2} className="gap-y-6">
                <ModalSection title="基本資訊">
                  <InfoItem icon={<BsBuilding />} label="公司名稱">
                    <span className="text-primary">{selectedJob.company_name || '—'}</span>
                  </InfoItem>
                  <InfoItem icon={<BsCalendar />} label="發布時間">{selectedJob.release_date}</InfoItem>
                  <InfoItem icon={<BsCalendarX />} label="截止時間">{selectedJob.deadline}</InfoItem>
                </ModalSection>

                <ModalSection title="聯絡方式">
                  <InfoItem icon={<BsPerson />} label="聯絡人">
                    {selectedJob.contact && selectedJob.contact.name ? selectedJob.contact.name : '未提供'}
                  </InfoItem>
                  <InfoItem icon={<BsEnvelope />} label="Email" className="break-all">
                    {selectedJob.contact && selectedJob.contact.email
                      ? <a href={`mailto:${selectedJob.contact.email}`} className="text-primary hover:underline">{selectedJob.contact.email}</a>
                      : '未提供'}
                  </InfoItem>
                  <InfoItem icon={<BsTelephone />} label="電話">
                    {selectedJob.contact && selectedJob.contact.phone ? selectedJob.contact.phone : '未提供'}
                  </InfoItem>
                </ModalSection>
              </ModalGrid>

              <ModalSection title="職位詳細資訊">
                <div
                  className="prose prose-sm max-w-none text-base-content/80 break-words"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(selectedJob.intro),
                  }}
                />
              </ModalSection>

              {/* 照片幻燈片展示 */}
              {selectedJob.images && selectedJob.images.length > 0 && (
                <ModalSection title="公司環境照片">
                  <Swiper
                    className="overflow-hidden rounded-2xl"
                    modules={[SwiperPagination, Navigation]}
                    pagination={selectedJob.images.length > 1 ? { clickable: true } : false}
                    navigation={selectedJob.images.length > 1}
                  >
                    {selectedJob.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div className="aspect-video w-full overflow-hidden bg-base-200">
                          <img
                            className="h-full w-full object-cover"
                            src={getImageSrc(process.env.REACT_APP_BASE_URL + image.image, 'company')}
                            alt={`${selectedJob.company_name} 環境照片 ${index + 1}`}
                            onError={(e) => handleImageError(e, 'company')}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </ModalSection>
              )}
            </>
          )}
        </AppModal>
      </div>
    </div>
  );
}

export default RecruitPage;
