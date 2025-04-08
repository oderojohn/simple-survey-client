import React from 'react';
import ResponseRow from './ResponseRow';

const ResponseTable = ({ responses, pagination, downloading, onRowClick, onDownload }) => {
  return (
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
            <ResponseRow
              key={response.id || index}
              response={response}
              index={index}
              pagination={pagination}
              downloading={downloading}
              onClick={onRowClick}
              onDownload={onDownload}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponseTable;