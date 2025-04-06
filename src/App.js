import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Survey from './components/surveyform';
import ResponsePage from './components/ResponsePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Survey />} />
      <Route path="/response" element={<ResponsePage />} />
    </Routes>
  );
}

export default App;
