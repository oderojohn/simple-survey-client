import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";  // Import Swal
import { fetchAllResponses, downloadCertificate } from "../../services/apiservice";
import ResponseModal from './ResponseModal';
import FilterBar from './FilterBar';
import ResponseTable from './ResponseTable';
import PaginationControls from './PaginationControls';
import { LoadingState, ErrorState, EmptyState } from './StateIndicators';

const ResponsePage = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5, total: 0 });
  const [emailInput, setEmailInput] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
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
        setPagination(prev => ({ ...prev, total: data.count || 0 }));
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
    setEmailInput(emailFilter);
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

      // SweetAlert for success
      Swal.fire({
        title: 'Success!',
        text: 'Your certificate has been downloaded successfully.',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    } catch (err) {
      Swal.fire({
        title: 'Success!',
        text: 'Your certificate has been downloaded successfully.',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    } finally {
      setDownloading(prev => ({ ...prev, [responseId]: false }));
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <div className="response-container">
      {selectedResponse && (
        <ResponseModal
          response={selectedResponse}
          onClose={() => setSelectedResponse(null)}
          onDownloadCertificate={handleDownloadCertificate}
        />
      )}

      <div className="response-header">
        <h1>Survey Responses</h1>
        <p className="subtitle">View all submitted survey responses</p>
      </div>

      <FilterBar
        emailInput={emailFilter}
        onFilterChange={(e) => setEmailFilter(e.target.value)}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className="response-content">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : pagination.total > 0 ? (
          <>
            <ResponseTable
              responses={responses}
              pagination={pagination}
              downloading={downloading}
              onRowClick={setSelectedResponse}
              onDownload={handleDownloadCertificate}
            />
            <PaginationControls
              pagination={pagination}
              totalPages={totalPages}
              onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
              onPageSizeChange={(newSize) => setPagination(prev => ({ ...prev, pageSize: newSize, page: 1 }))}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default ResponsePage;
