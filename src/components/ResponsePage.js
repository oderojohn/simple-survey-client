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
  faChevronRight, 
  faTimes,
  faVenusMars,
  faFileAlt,
  faCode,
  faCertificate
} from '@fortawesome/free-solid-svg-icons';
const ResponsePage = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState({});
  const [pagination, setPagination] = useState({ 
    page: 1, 
    pageSize: 5, 
    total: 0 
  });
  const [emailInput, setEmailInput] = useState("");
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllResponses({
          page: pagination.page,
          pageSize: pagination.pageSize,
          email: emailInput,
        });
        setResponses(data.results?.question_responses || []);
        setPagination(prev => ({
          ...prev,
          total: data.count || 0
        }));
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch responses");
        setResponses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.page, pagination.pageSize, emailInput]);

  const handleSearchSubmit = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRowClick = (response) => {
    setSelectedResponse(response);
  };

  const handleDownloadCertificate = async (responseId, fullName, e) => {
    e.stopPropagation();
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
    setEmailInput(e.target.value);
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <div className="response-container">
    
{selectedResponse && (
  <div className="response-modal">
    <div className="modal-overlay" onClick={() => setSelectedResponse(null)} />
    <div className="modal-card">
      <div className="modal-header">
        <h2 className="modal-title">
          <span className="user-icon">👤</span>
          {selectedResponse.full_name}'s Details
        </h2>
        <button 
          className="close-button"
          onClick={() => setSelectedResponse(null)}
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <div className="modal-body">
        <div className="detail-grid">
          <div className="detail-item">
            <label className="detail-label">
              <FontAwesomeIcon icon={faEnvelope} className="detail-icon" />
              Email
            </label>
            <p className="detail-value">
              <a 
                href={`mailto:${selectedResponse.email_address}`}
                className="email-link"
              >
                {selectedResponse.email_address}
              </a>
            </p>
          </div>

          <div className="detail-item">
            <label className="detail-label">
              <FontAwesomeIcon icon={faVenusMars} className="detail-icon" />
              Gender
            </label>
            <p className="detail-value">{selectedResponse.gender}</p>
          </div>

          <div className="detail-item full-width">
            <label className="detail-label">
              <FontAwesomeIcon icon={faFileAlt} className="detail-icon" />
              Description
            </label>
            <p className="detail-value description-text">
              {selectedResponse.description || "No description provided"}
            </p>
          </div>

          <div className="detail-item full-width">
            <label className="detail-label">
              <FontAwesomeIcon icon={faCode} className="detail-icon" />
              Programming Stack
            </label>
            <div className="tech-stack">
              {Array.isArray(selectedResponse.programming_stack) ? (
                selectedResponse.programming_stack.map((tech, index) => (
                  <span key={index} className="tech-badge">
                    {tech}
                  </span>
                ))
              ) : (
                <span className="tech-badge">
                  {selectedResponse.programming_stack}
                </span>
              )}
            </div>
          </div>

          {selectedResponse.certificates?.length > 0 && (
            <div className="detail-item full-width">
              <label className="detail-label">
                <FontAwesomeIcon icon={faCertificate} className="detail-icon" />
                Certificates
              </label>
              <div className="certificate-list">
                {selectedResponse.certificates.map((cert, index) => (
                  <div key={index} className="certificate-item">
                    <span className="cert-name">{cert.file.name}</span>
                    <button 
                      className="download-link"
                      onClick={(e) => handleDownloadCertificate(selectedResponse.id, selectedResponse.full_name, e)}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
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
              value={emailInput}
              onChange={handleFilterChange}
              placeholder="Filter by email address"
              className="filter-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
            />
            <button 
              className="search-button"
              onClick={handleSearchSubmit}
            >
              Search
            </button>
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
                  {responses.map((response, index) => (
                    <tr 
                      key={response.id || index}
                      onClick={() => handleRowClick(response)}
                      className="clickable-row"
                    >
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
                          onClick={(e) => handleDownloadCertificate(response.id, response.full_name, e)}
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
                    disabled={pagination.page === totalPages}
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