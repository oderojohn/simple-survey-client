import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Survey from './pages/Survey/SurveyContainer';
import ResponsePage from './pages/ResponsePage/ResponsePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Survey />} />
      <Route path="/response" element={<ResponsePage />} />
    </Routes>
  );
}

export default App;
