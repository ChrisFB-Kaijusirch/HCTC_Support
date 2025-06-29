import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import SubmitTicket from './pages/SubmitTicket';
import TrackTicket from './pages/TrackTicket';
import KnowledgeBase from './pages/KnowledgeBase';
import KnowledgeBaseArticle from './pages/KnowledgeBaseArticle';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ClientManagement from './pages/Admin/ClientManagement';
import AppManagement from './pages/Admin/AppManagement';
import ClientDashboard from './pages/Client/ClientDashboard';
import FeatureRequestsList from './pages/FeatureRequests/FeatureRequestsList';
import LoginForm from './components/Auth/LoginForm';
import QRSetup from './components/Auth/QRSetup';
import './index.css';

function App() {
  const handleLogin = async (emailOrUsername: string, password: string, twoFactorCode?: string) => {
    // Mock login logic - simplified for admin
    console.log('Login attempt:', { emailOrUsername, password, twoFactorCode });
    // In real app, this would authenticate and redirect
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit-ticket" element={<SubmitTicket />} />
          <Route path="/track-ticket" element={<TrackTicket />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/knowledge-base/:id" element={<KnowledgeBaseArticle />} />
          <Route path="/feature-requests" element={<FeatureRequestsList />} />
          
          {/* Auth Routes */}
          <Route 
            path="/admin/login" 
            element={<LoginForm userType="admin" onLogin={handleLogin} />} 
          />
          <Route 
            path="/client/login" 
            element={<LoginForm userType="client" onLogin={handleLogin} />} 
          />
          <Route path="/qr-setup" element={<QRSetup />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/clients" element={<ClientManagement />} />
          <Route path="/admin/apps" element={<AppManagement />} />
          
          {/* Client Routes */}
          <Route path="/client/dashboard" element={<ClientDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;