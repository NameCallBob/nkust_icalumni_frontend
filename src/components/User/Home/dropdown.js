import React, { useEffect, useState } from 'react';
import { Dropdown, ButtonGroup, Badge } from 'react-bootstrap';
import Axios from 'common/Axios';
import { useNavigate } from 'react-router-dom';
import 'css/user/homepage/CategoryDropdown.css';

function CategoryDropdown() {
  const [currentPage, setCurrentPage] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigator = useNavigate();
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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Dropdown as={ButtonGroup} className="w-100 category-dropdown-container" show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
      <Dropdown.Toggle
        variant="primary"
        id="category-dropdown"
        className="w-100 py-2 dropdown-toggle-animated"
        style={{ fontSize: '16px', fontWeight: '600' }}
        onClick={toggleDropdown}
      >
        行業別
      </Dropdown.Toggle>

      <Dropdown.Menu className="w-100 dropdown-menu-animated">
        <div className="categories-container">
          {currentItems.map((category) => (
            <Dropdown.Item
              key={category.id}
              onClick={() => handleOnClick(category.id)}
              className="py-2 dropdown-item-animated text-center"
            >
              {category.title}
            </Dropdown.Item>
          ))}
        </div>

        <div className="pagination-controls d-flex justify-content-between align-items-center px-2 mt-2 border-top pt-2">
          <button
            className={`btn btn-sm ${currentPage === 0 ? 'btn-light disabled' : 'btn-outline-primary'}`}
            onClick={handlePrevPage}
            disabled={currentPage === 0}
          >
            上一頁
          </button>
          
          <span className="current-page">
            {currentPage + 1} / {totalPages}
          </span>
          
          <button
            className={`btn btn-sm ${currentPage === totalPages - 1 ? 'btn-light disabled' : 'btn-outline-primary'}`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            下一頁
          </button>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default CategoryDropdown;