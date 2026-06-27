import React, { useEffect, useRef, useState } from 'react';
import Axios from 'common/Axios';
import { useNavigate } from 'react-router-dom';
import 'css/user/homepage/CategoryDropdown.css';

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
    <div
      ref={dropdownRef}
      className={`dropdown w-full category-dropdown-container ${isOpen ? 'show dropdown-open' : ''}`}
    >
      <button
        type="button"
        id="category-dropdown"
        className="btn w-full py-2 dropdown-toggle-animated"
        style={{ fontSize: '16px', fontWeight: '600' }}
        onClick={toggleDropdown}
      >
        行業別
      </button>

      {isOpen && (
        <div className="dropdown-content w-full dropdown-menu-animated bg-base-100 z-[1000]">
          <div className="categories-container">
            {currentItems.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleOnClick(category.id)}
                className="dropdown-item-animated w-full block py-2 text-center"
              >
                {category.title}
              </button>
            ))}
          </div>

          <div className="pagination-controls flex justify-between items-center px-2 mt-2 pt-2">
            <button
              type="button"
              className={`btn btn-sm ${currentPage === 0 ? 'btn-disabled disabled' : 'btn-outline btn-primary'}`}
              onClick={handlePrevPage}
              disabled={currentPage === 0}
            >
              上一頁
            </button>

            <span className="current-page">
              {currentPage + 1} / {totalPages}
            </span>

            <button
              type="button"
              className={`btn btn-sm ${currentPage === totalPages - 1 ? 'btn-disabled disabled' : 'btn-outline btn-primary'}`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
            >
              下一頁
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryDropdown;
