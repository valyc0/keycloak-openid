import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Tasks from './pages/Tasks';
import Layout from './components/Layout/Layout';
import AuthProvider from './components/AuthProvider';
import './assets/css/cs-skin-elastic.css';
import './assets/css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  
  if (auth.isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function AppRoutes() {
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
          path="/about" 
          element={
            <ProtectedRoute>
              <Layout>
                <About />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute>
              <Layout>
                <Tasks />
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
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
