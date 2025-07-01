import React from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load components for better performance
const Home = React.lazy(() => import('../pages/Home'));
const SubmitTicket = React.lazy(() => import('../pages/SubmitTicket'));
const TrackTicket = React.lazy(() => import('../pages/TrackTicket'));
const KnowledgeBase = React.lazy(() => import('../pages/KnowledgeBase'));
const KnowledgeBaseArticle = React.lazy(() => import('../pages/KnowledgeBaseArticle'));
const FeatureRequestsList = React.lazy(() => import('../pages/FeatureRequests/FeatureRequestsList'));

// Auth components
const LoginForm = React.lazy(() => import('../components/Auth/LoginForm'));
const QRSetup = React.lazy(() => import('../components/Auth/QRSetup'));

// Admin components
const AdminDashboard = React.lazy(() => import('../pages/Admin/AdminDashboard'));
const ClientManagement = React.lazy(() => import('../pages/Admin/ClientManagement'));
const AppManagement = React.lazy(() => import('../pages/Admin/AppManagement'));
const ContentManagement = React.lazy(() => import('../pages/Admin/ContentManagement'));
const InvoiceManagement = React.lazy(() => import('../pages/Admin/InvoiceManagement'));
const AdminSettings = React.lazy(() => import('../pages/Admin/AdminSettings'));
const UserAccessControl = React.lazy(() => import('../pages/Admin/UserAccessControl'));

// Client components
const ClientDashboard = React.lazy(() => import('../pages/Client/ClientDashboard'));
const UserManagement = React.lazy(() => import('../pages/Client/UserManagement'));
const Billing = React.lazy(() => import('../pages/Client/Billing'));

export interface RouteConfig extends RouteObject {
  requiresAuth?: boolean;
  role?: 'admin' | 'client';
}

export const publicRoutes: RouteConfig[] = [
  { path: '/', element: <Home /> },
  { path: '/submit-ticket', element: <SubmitTicket /> },
  { path: '/track-ticket', element: <TrackTicket /> },
  { path: '/knowledge-base', element: <KnowledgeBase /> },
  { path: '/knowledge-base/:id', element: <KnowledgeBaseArticle /> },
  { path: '/feature-requests', element: <FeatureRequestsList /> },
];

export const authRoutes: RouteConfig[] = [
  { 
    path: '/admin/login', 
    element: <LoginForm userType="admin" onLogin={async () => {}} />
  },
  { 
    path: '/client/login', 
    element: <LoginForm userType="client" onLogin={async () => {}} />
  },
  { path: '/qr-setup', element: <QRSetup /> },
];

export const adminRoutes: RouteConfig[] = [
  { path: '/admin', element: <AdminDashboard />, requiresAuth: true, role: 'admin' },
  { path: '/admin/dashboard', element: <AdminDashboard />, requiresAuth: true, role: 'admin' },
  { path: '/admin/clients', element: <ClientManagement />, requiresAuth: true, role: 'admin' },
  { path: '/admin/apps', element: <AppManagement />, requiresAuth: true, role: 'admin' },
  { path: '/admin/content', element: <ContentManagement />, requiresAuth: true, role: 'admin' },
  { path: '/admin/invoices', element: <InvoiceManagement />, requiresAuth: true, role: 'admin' },
  { path: '/admin/settings', element: <AdminSettings />, requiresAuth: true, role: 'admin' },
  { path: '/admin/users', element: <UserAccessControl />, requiresAuth: true, role: 'admin' },
];

export const clientRoutes: RouteConfig[] = [
  { path: '/client/dashboard', element: <ClientDashboard />, requiresAuth: true, role: 'client' },
  { path: '/client/users', element: <UserManagement />, requiresAuth: true, role: 'client' },
  { path: '/client/billing', element: <Billing />, requiresAuth: true, role: 'client' },
];

export const allRoutes = [
  ...publicRoutes,
  ...authRoutes,
  ...adminRoutes,
  ...clientRoutes,
];
