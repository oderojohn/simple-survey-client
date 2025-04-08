import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faEnvelope, 
  faVenusMars, 
  faFileAlt, 
  faCode, 
  faCertificate,
  faDownload
} from '@fortawesome/free-solid-svg-icons';

const ResponseModal = ({ response, onClose, onDownloadCertificate }) => {
  if (!response) return null;

  return (
    <div className="response-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="user-icon">👤</span>
            {response.full_name}'s Details
          </h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
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
                  href={`mailto:${response.email_address}`}
                  className="email-link"
                >
                  {response.email_address}
                </a>
              </p>
            </div>

            <div className="detail-item">
              <label className="detail-label">
                <FontAwesomeIcon icon={faVenusMars} className="detail-icon" />
                Gender
              </label>
              <p className="detail-value">{response.gender}</p>
            </div>

            <div className="detail-item full-width">
              <label className="detail-label">
                <FontAwesomeIcon icon={faFileAlt} className="detail-icon" />
                Description
              </label>
              <p className="detail-value description-text">
                {response.description || "No description provided"}
              </p>
            </div>

            <div className="detail-item full-width">
              <label className="detail-label">
                <FontAwesomeIcon icon={faCode} className="detail-icon" />
                Programming Stack
              </label>
              <div className="tech-stack">
                {Array.isArray(response.programming_stack) ? (
                  response.programming_stack.map((tech, index) => (
                    <span key={index} className="tech-badge">{tech}</span>
                  ))
                ) : (
                  <span className="tech-badge">
                    {response.programming_stack}
                  </span>
                )}
              </div>
            </div>

            {response.certificates?.length > 0 && (
              <div className="detail-item full-width">
                <label className="detail-label">
                  <FontAwesomeIcon icon={faCertificate} className="detail-icon" />
                  Certificates
                </label>
                <div className="certificate-list">
                  {response.certificates.map((cert, index) => (
                    <div key={index} className="certificate-item">
                      <span className="cert-name">{cert.file.name}</span>
                      <button 
                        className="download-link"
                        onClick={(e) => onDownloadCertificate(response.id, response.full_name, e)}
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
  );
};

export default ResponseModal;