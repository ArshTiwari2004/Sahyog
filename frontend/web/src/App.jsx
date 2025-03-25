import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/Landingpage';
import Dashboard from './components/Dashboard';
import Incidents from './components/Incidents';
import Resources from './components/Resources';
import ResponseTeams from './components/Responseteam';
import Analytics from './components/Analytics';
import Settings from './components/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/response-teams" element={<ResponseTeams />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        
      </Routes>
    </Router>
  );
}

export default App;
