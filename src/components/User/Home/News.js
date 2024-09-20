// components/LatestNews.jsx
import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { motion, AnimatePresence } from 'framer-motion';
import 'css/News.css'; // 确保导入了自定义样式

function News() {
  // data/newsData.js
   const newsData = [
  { date: '2023-10-01', event: '年度大会召开年度大会召开年度大会召开', link: '/news/1' },
  { date: '2023-10-15', event: '新产品发布', link: '/news/2' },
  { date: '2023-10-01', event: '年度大会召开', link: '/news/1' },
  { date: '2023-10-15', event: '新产品发布', link: '/news/2' },
  { date: '2023-10-01', event: '年度大会召开', link: '/news/1' },
  { date: '2023-10-15', event: '新产品发布', link: '/news/2' },
  { date: '2023-10-01', event: '年度大会召开', link: '/news/1' },
  { date: '2023-10-15', event: '新产品发布', link: '/news/2' },
  { date: '2023-10-01', event: '年度大会召开', link: '/news/1' },
  { date: '2023-10-15', event: '新产品发布', link: '/news/2' },
  { date: '2023-10-01', event: '年度大会召开', link: '/news/1' },
  { date: '2023-10-15', event: '新产品发布', link: '/news/2' },
  { date: '2023-10-01', event: '年度大会召开', link: '/news/1' },
  { date: '2023-10-15', event: '新产品发布', link: '/news/2' },

  // 添加更多数据...
];

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // 每页显示的项目数

  const pageCount = Math.ceil(newsData.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = newsData.slice(offset, offset + itemsPerPage);

  return (
    <div className="latest-news">
      <h2>最新消息</h2>
    <div className="table-container">
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentPage}
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          exit={{ x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <Table hover>
            <thead>
              <tr>
                <th>日期</th>
                <th>事件</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => navigate(item.link)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{item.date}</td>
                  <td>{item.event}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </motion.div>
      </AnimatePresence>
    </div>

    <div className="pagination-container">
      <ReactPaginate
        previousLabel={'上一页'}
        nextLabel={'下一页'}
        breakLabel={'...'}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={'pagination justify-content-center'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        activeClassName={'active'}
        previousClassName={'page-item'}
        nextClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextLinkClassName={'page-link'}
      />
    </div>
  </div>
  );
}

export default News;
