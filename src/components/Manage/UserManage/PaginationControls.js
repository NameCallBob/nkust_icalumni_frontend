import React from 'react';
import { Pagination } from 'react-bootstrap';

function PaginationControls({ currentPage, totalPages, setCurrentPage }) {
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <Pagination className="justify-content-center">
      <Pagination.Prev onClick={handlePrevPage} disabled={currentPage === 1} />
      <Pagination.Item active>{currentPage}</Pagination.Item>
      <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
    </Pagination>
  );
}

export default PaginationControls;
