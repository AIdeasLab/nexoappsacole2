import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AIdeasLab from './components/sections/AIdeasLab';
import Events from './components/sections/Events';
import Architecture from './components/sections/Architecture';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/aideaslab" element={<AIdeasLab />} />
            <Route path="/eventos" element={<Events />} />
            <Route path="/arquitetura" element={<Architecture />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;