import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, GraduationCap, User, Package } from 'lucide-react';
import { handleImageError, getImageSrc } from '../../../utils/imageDefaults';
import { Badge, EmptyState } from '../../common/ui';

// 公司卡片子組件
const CompanyCard = ({ company, onCardClick }) => {
  return (
    <div
      onClick={() => onCardClick(company.member)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >
      {/* 圖片區 */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={getImageSrc(company.photo, 'company')}
          alt={company.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => handleImageError(e, 'company')}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f172a]/30 via-transparent to-transparent" />
      </div>

      {/* 內容區 */}
      <div className="flex flex-grow flex-col justify-between p-5">
        <div>
          <h3 className="mb-3 text-center font-serif text-lg font-bold text-[#0f172a] line-clamp-2">
            {company.name}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <GraduationCap className="h-4 w-4 shrink-0 text-[#a0781c]" />
              <span className="shrink-0 font-medium text-slate-500">系級</span>
              <span className="truncate text-slate-700">{company.graduate_grade}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User className="h-4 w-4 shrink-0 text-[#a0781c]" />
              <span className="shrink-0 font-medium text-slate-500">系友</span>
              <span className="truncate text-slate-700">{company.member_name}</span>
            </div>
          </div>
        </div>

        {/* 產品標籤 */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Package className="h-3.5 w-3.5 text-[#a0781c]" />
            <span>主要產品</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {company.products.split(',').map((product, idx) => (
              <Badge key={idx} variant="primary">
                {product.trim()}
              </Badge>
            ))}
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

  const renderPagination = (totalPages) => {
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    const numBtnBase =
      'inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-200';
    const numBtn = `${numBtnBase} bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-[#1e3a8a]`;
    const numBtnActive = `${numBtnBase} bg-[#1e3a8a] text-white shadow-md shadow-blue-900/25`;
    const ctrlBtn =
      'inline-flex h-10 items-center justify-center gap-1 rounded-full px-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-[#1e3a8a] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-600';

    return (
      <div className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
        <button
          onClick={() => handlePageChange(1)}
          className={ctrlBtn}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="hidden sm:inline">首頁</span>
        </button>
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          className={ctrlBtn}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">上一頁</span>
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={currentPage === 1 ? numBtnActive : numBtn}
            >
              1
            </button>
            {startPage > 2 && <span className="px-1 text-slate-400">…</span>}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? numBtnActive : numBtn}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1 text-slate-400">…</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={currentPage === totalPages ? numBtnActive : numBtn}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          className={ctrlBtn}
          disabled={currentPage === totalPages}
        >
          <span className="hidden sm:inline">下一頁</span>
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          className={ctrlBtn}
          disabled={currentPage === totalPages}
        >
          <span className="hidden sm:inline">末頁</span>
          <ChevronsRight className="h-4 w-4" />
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

  return (
    <div className="w-full">
      {totalItems === 0 ? (
        <EmptyState
          title="沒有找到此類別的公司資料。"
          description="請嘗試切換其他類別，或稍後再回來查看。"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <TransitionGroup component={null}>
              {currentCompanies.map((company, index) => (
                <CSSTransition key={index} timeout={500} classNames="fade">
                  <div className="h-full">
                    <CompanyCard company={company} onCardClick={handleItemClick} />
                  </div>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>

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
    </div>
  );
};

export default CompanyListWithPagination;
