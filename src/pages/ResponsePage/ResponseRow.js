import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';

const ResponseRow = ({ response, index, pagination, downloading, onClick, onDownload }) => {
  return (
    <tr onClick={() => onClick(response)} className="clickable-row">
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
          onClick={(e) => onDownload(response.id, response.full_name, e)}
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
  );
};

export default ResponseRow;