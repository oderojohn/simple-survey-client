import React from 'react';
import TextQuestion from './TextQuestion';
import ChoiceQuestion from './ChoiceQuestion';
import FileQuestion from './FileQuestion';

const QuestionRenderer = ({ question, responses, handleChange }) => {
  if (!question) return null;

  switch (question.type) {
    case 'short_text':
    case 'email':
    case 'long_text':
      return <TextQuestion question={question} responses={responses} handleChange={handleChange} />;
    case 'choice':
      return <ChoiceQuestion question={question} responses={responses} handleChange={handleChange} />;
    case 'file':
      return <FileQuestion question={question} responses={responses} handleChange={handleChange} />;
    default:
      return null;
  }
};

export default QuestionRenderer;