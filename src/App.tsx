import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/profile/Profile';
import CVGenerator from './pages/cv-generator/CVGenerator';
import Jobs from './pages/jobs/Jobs';
import JobDetails from './pages/jobs/JobDetails';
import CreateJob from './pages/jobs/CreateJob';
import Formations from './pages/formations/Formations';
import FormationDetails from './pages/formations/FormationDetails';
import Forum from './pages/forum/Forum';
import Marketplace from './pages/marketplace/Marketplace';
import Contact from './pages/contact/Contact';
import Legal from './pages/legal/Legal';
import AdminDashboard from './pages/admin/Dashboard';
import NotFound from './pages/404';
import './styles/index.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cv-generator" element={<CVGenerator />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/jobs/create" element={<CreateJob />} />
              <Route path="/formations" element={<Formations />} />
              <Route path="/formations/:id" element={<FormationDetails />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App; 