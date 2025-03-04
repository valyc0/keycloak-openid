import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import { setupFakeBackend } from './services/FakeBackendInterceptor';
import api from './services/api';
import Dashboard from './components/Dashboard/Dashboard';
import Alarms from './pages/Alarms';
import GatewayWizard from './pages/GatewayWizard';
import Layout from './components/Layout';
import AuthProvider from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import ComingSoon from './components/ComingSoon';
import { ToastProvider } from './components/Toast/ToastContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

function AppRoutes() {
  useEffect(() => {
    // Initialize fake backend if enabled in environment
    if (import.meta.env.VITE_USE_FAKE_BACKEND === 'true') {
      console.log('Setting up fake backend interceptor');
      setupFakeBackend(api);
    }

    // Load Bootstrap JS
    const loadBootstrapScript = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
      script.async = true;
      document.body.appendChild(script);
    };

    loadBootstrapScript();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/alarms"
          element={
            <ProtectedRoute>
              <Layout>
                <Alarms />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gateway-wizard"
          element={
            <ProtectedRoute>
              <Layout>
                <GatewayWizard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <ComingSoon />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <ComingSoon />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/1"
          element={
            <ProtectedRoute>
              <Layout>
                <ComingSoon />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/2"
          element={
            <ProtectedRoute>
              <Layout>
                <ComingSoon />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <ComingSoon />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
