import React from 'react';

const FileQuestion = ({ question, responses, handleChange }) => {
  const fileProperties = question.file_properties || {};

  return (
    <div className="form-group">
      <label htmlFor={`file-input-${question.name}`}>
        {question.text}
        {question.required === "yes" && <span className="required">*</span>}
      </label>
      {question.description && <p className="description">{question.description}</p>}
      <div className="file-upload-wrapper">
        <input
          id={`file-input-${question.name}`}
          type="file"
          accept=".pdf,application/pdf"
          multiple={fileProperties.multiple === "yes"}
          onChange={(e) => handleChange(question.name, e.target.files)}
          className="file-input"
          aria-required={question.required === "yes"}
        />
        <label 
          htmlFor={`file-input-${question.name}`} 
          className="file-upload-label"
        >
          Choose {fileProperties.multiple === "yes" ? "Files" : "File"}
        </label>
        <div className="file-upload-hint">
          {fileProperties.multiple === "yes" 
            ? "Click to select multiple PDF files"
            : "Click to select a PDF file"}
        </div>
        {responses[question.name] && (
          <div className="selected-files">
            Selected: {Array.from(responses[question.name]).map(f => f.name).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileQuestion;