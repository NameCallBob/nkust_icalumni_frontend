import React , {useEffect, useState} from 'react';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import 'css/user/homepage/CategoryDropdown.css'; // 這裡引入 CSS 來定義動畫樣式
import Axios from 'common/Axios';

  
  function CategoryDropdown() {
    const [currentPage, setCurrentPage] = useState(0);
    const [categories,setCategories] = useState([]);
    const itemsPerPage = 11;
    
    const totalPages = Math.ceil(categories.length / itemsPerPage);
  
    const handleNextPage = () => {
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const handlePrevPage = () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    const currentItems = categories.slice(
      currentPage * itemsPerPage, 
      (currentPage + 1) * itemsPerPage
    );
    useEffect(() => {
      Axios().get('')
      .then((res) => {
        setCategories(res.data)
      })
    })
    return (
      <Dropdown as={ButtonGroup} className="w-100">
        <Dropdown.Toggle
          variant="success"
          id="category-dropdown"
          className="w-100 py-3 dropdown-toggle-animated"
          style={{ fontSize: '18px', fontWeight: 'bold' }}
        >
          行業別
        </Dropdown.Toggle>
  
        <Dropdown.Menu className="w-100 text-center dropdown-menu-animated">
          {currentItems.map((category, index) => (
            <Dropdown.Item
              key={index}
              href={`#${category}`}
              className="py-2 dropdown-item-animated"
            >
              {category}
            </Dropdown.Item>
          ))}
  
          <div className="pagination-controls d-flex justify-content-between">
            <Dropdown.Item 
              as="button" 
              className={`py-2 ${currentPage === 0 ? 'disabled' : ''}`} 
              onClick={handlePrevPage}
            >
              上一頁
            </Dropdown.Item>
            <Dropdown.Item 
              as="button" 
              className={`py-2 ${currentPage === totalPages - 1 ? 'disabled' : ''}`} 
              onClick={handleNextPage}
            >
              下一頁
            </Dropdown.Item>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  
  export default CategoryDropdown;