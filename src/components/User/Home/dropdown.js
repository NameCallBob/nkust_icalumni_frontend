import React, { useEffect, useRef, useState } from 'react';
import Axios from 'common/Axios';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';

function CategoryDropdown() {
  const [currentPage, setCurrentPage] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigator = useNavigate();
  const dropdownRef = useRef(null);
  const itemsPerPage = 11;

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handleOnClick = (id) => {
    navigator("/search", {
      state: {
        type_id: id,
        search_text: null
      }
    });
    setIsOpen(false);
  };

  // 防止頁面切換時下拉菜單關閉
  const handleNextPage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentItems = categories.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    Axios().get('company/industry/all/')
      .then((res) => {
        setCategories(res.data);
      })
      .catch(error => {
        console.error('獲取行業別數據失敗:', error);
      });
  }, []);

  // 點擊下拉選單外部時關閉（取代 react-bootstrap 內建的 onToggle 收合行為）
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        id="category-dropdown"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`group flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-base font-semibold shadow-sm transition-all duration-200
          ${isOpen
            ? 'border-[#1e3a8a] bg-[#1e3a8a] text-white shadow-md'
            : 'border-slate-200 bg-white text-[#0f172a] hover:border-[#1e3a8a]/40 hover:shadow-md'}`}
      >
        <span className="flex items-center gap-2">
          <Building2 className={`h-4 w-4 ${isOpen ? 'text-[#a0781c]' : 'text-[#1e3a8a]'}`} />
          行業別
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-[1000] mt-2 origin-top overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl ring-1 ring-[#0f172a]/5">
          <div className="grid max-h-72 grid-cols-1 gap-1 overflow-y-auto p-2 sm:grid-cols-2">
            {currentItems.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleOnClick(category.id)}
                className="w-full truncate rounded-lg px-4 py-2.5 text-center text-sm font-medium text-[#0f172a] transition-colors duration-150 hover:bg-[#1e3a8a]/5 hover:text-[#1e3a8a] focus:bg-[#1e3a8a]/10 focus:outline-none sm:text-left"
              >
                {category.title}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-3 py-2.5">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-[#1e3a8a] shadow-sm transition-colors hover:border-[#1e3a8a]/40 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300 disabled:shadow-none"
            >
              <ChevronLeft className="h-4 w-4" />
              上一頁
            </button>

            <span className="text-xs font-semibold tabular-nums text-slate-500">
              {currentPage + 1} / {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-[#1e3a8a] shadow-sm transition-colors hover:border-[#1e3a8a]/40 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300 disabled:shadow-none"
            >
              下一頁
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryDropdown;
