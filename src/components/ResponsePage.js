// src/components/ResponsePage.js
import React, { useEffect, useState } from "react";
import { fetchAllResponses, downloadCertificate } from "../services/apiservice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
  faSpinner,
  faExclamationCircle,
  faEnvelope,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

const ResponsePage = () => {
  const [allResponses, setAllResponses] = useState([]);
  const [displayedResponses, setDisplayedResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    email: ""
  });

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const data = await fetchAllResponses();
        setAllResponses(data.results?.question_responses || []);
        setPagination(prev => ({
          ...prev,
          total: data.results?.question_responses?.length || 0
        }));
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch responses");
        setAllResponses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  useEffect(() => {
    let filtered = [...allResponses];
    if (filters.email) {
      filtered = filtered.filter(response =>
        response.email_address.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    setPagination(prev => ({
      ...prev,
      total: filtered.length
    }));
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    setDisplayedResponses(filtered.slice(startIndex, endIndex));
  }, [allResponses, pagination.page, pagination.pageSize, filters.email]);

  const handleDownloadCertificate = async (responseId, fullName) => {
    try {
      setDownloading(prev => ({ ...prev, [responseId]: true }));
      const response = await downloadCertificate(responseId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fullName}_certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading certificate:", err);
      alert("Failed to download certificate. Please try again.");
    } finally {
      setDownloading(prev => ({ ...prev, [responseId]: false }));
    }
  };

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    if (newPage > 0 && newPage <= totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <div className="response-container">
      <div className="response-header">
        <h1>Survey Responses</h1>
        <p className="subtitle">View all submitted survey responses</p>
      </div>

      <div className="response-filters">
        <div className="filter-group">
          <div className="filter-input-container">
            <FontAwesomeIcon icon={faEnvelope} className="filter-icon" />
            <input
              type="text"
              id="email"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
              placeholder="Filter by email address"
              className="filter-input"
            />
          </div>
        </div>
      </div>

      <div className="response-content">
        {loading ? (
          <div className="loading-state">
            <FontAwesomeIcon icon={faSpinner} spin className="spinner" />
            <p>Loading responses...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
            <h3>Error loading responses</h3>
            <p>{error}</p>
            <button className="retry-button" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        ) : pagination.total > 0 ? (
          <>
            <div className="table-container">
              <table className="response-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Description</th>
                    <th>Gender</th>
                    <th>Programming Stack</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedResponses.map((response, index) => (
                    <tr key={response.id || index}>
                      <td>{(pagination.page - 1) * pagination.pageSize + index + 1}</td>
                      <td>{response.full_name}</td>
                      <td>
                        <a href={`mailto:${response.email_address}`} className="email-link">
                          {response.email_address}
                        </a>
                      </td>
                      <td className="description-cell">
                        <div className="description-content">
                          {response.description || "N/A"}
                        </div>
                      </td>
                      <td>{response.gender}</td>
                      <td>
                        {Array.isArray(response.programming_stack) 
                          ? response.programming_stack.join(", ") 
                          : response.programming_stack}
                      </td>
                      <td>
                        <button
                          className={`download-button ${downloading[response.id] ? 'downloading' : ''}`}
                          onClick={() => handleDownloadCertificate(response.id, response.full_name)}
                          disabled={downloading[response.id]}
                        >
                          {downloading[response.id] ? (
                            <>
                              <FontAwesomeIcon icon={faSpinner} spin /> Downloading...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faDownload} /> Download
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-footer">
              <div className="pagination-controls">
                <div className="pagination-buttons">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="pagination-button"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} /> Previous
                  </button>
                  <span className="pagination-info">
                    Page {pagination.page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === totalPages || pagination.total === 0}
                    className="pagination-button"
                  >
                    Next <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
                <div className="pagination-extra">
                  <span className="total-responses">
                    {pagination.total} total responses
                  </span>
                  <select
                    value={pagination.pageSize}
                    onChange={(e) => setPagination(prev => ({
                      ...prev,
                      pageSize: Number(e.target.value),
                      page: 1
                    }))}
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
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No responses found</h3>
            <p>No survey responses match your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsePage;