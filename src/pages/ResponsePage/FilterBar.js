import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const FilterBar = ({ emailInput, onFilterChange, onSearchSubmit }) => {
  return (
    <div className="response-filters">
      <div className="filter-group">
        <div className="filter-input-container">
          <FontAwesomeIcon icon={faEnvelope} className="filter-icon" />
          <input
            type="text"
            id="email"
            name="email"
            value={emailInput}
            onChange={onFilterChange}
            placeholder="Filter by email address"
            className="filter-input"
            onKeyPress={(e) => e.key === 'Enter' && onSearchSubmit()}
          />
          <button className="search-button" onClick={onSearchSubmit}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;