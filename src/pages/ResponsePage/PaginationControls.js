import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const PaginationControls = ({ pagination, totalPages, onPageChange, onPageSizeChange }) => {
  return (
    <div className="pagination-footer">
      <div className="pagination-controls">
        <div className="pagination-buttons">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="pagination-button"
          >
            <FontAwesomeIcon icon={faChevronLeft} /> Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === totalPages}
            className="pagination-button"
          >
            Next <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        <div className="pagination-extra">
          <span className="total-responses">{pagination.total} total responses</span>
          <select
            value={pagination.pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="page-size-select"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;