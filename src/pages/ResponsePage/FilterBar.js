import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const FilterBar = ({ emailInput, onFilterChange, onSearchSubmit }) => {
  const navigate = useNavigate();

  return (
    <div className="response-filters">
      <div className="filter-group">
        <div className="filter-input-container">
          <FontAwesomeIcon icon={faEnvelope}  />
          <input
            type="text"
            id="email"
            name="email"
            value={emailInput}
            onChange={onFilterChange}
            placeholder="Filter by email address"
            className="filter-input"
          />
          <button className="search-button" onClick={onSearchSubmit}>
            Search
          </button>
          <button className="search-button" onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
