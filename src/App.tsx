import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { allRoutes } from './config/routes';
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
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        }>
          <Routes>
            {allRoutes.map((route, index) => (
              <Route 
                key={index} 
                path={route.path} 
                element={
                  React.isValidElement(route.element) && route.element.type.name === 'LoginForm'
                    ? React.cloneElement(route.element as React.ReactElement, { onLogin: handleLogin })
                    : route.element
                } 
              />
            ))}
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;