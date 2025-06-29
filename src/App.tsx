import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home.simple';
import SubmitTicket from './pages/SubmitTicket';
import TrackTicket from './pages/TrackTicket';
import KnowledgeBase from './pages/KnowledgeBase';
import KnowledgeBaseArticle from './pages/KnowledgeBaseArticle';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ClientManagement from './pages/Admin/ClientManagement';
import AppManagement from './pages/Admin/AppManagement';
import ContentManagement from './pages/Admin/ContentManagement';
import InvoiceManagement from './pages/Admin/InvoiceManagement';
import ClientDashboard from './pages/Client/ClientDashboard';
import UserManagement from './pages/Client/UserManagement';
import Billing from './pages/Client/Billing';
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
    <Router basename="/HCTC_Support">
      <Layout>
        <div style={{ background: 'red', padding: '20px', color: 'white', margin: '20px' }}>
          DEBUG: Layout children are rendering - Current URL: {window.location.pathname}
        </div>
        <Home />
      </Layout>
    </Router>
  );
}

export default App;