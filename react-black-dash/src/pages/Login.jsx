import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../assets/css/cs-skin-elastic.css';
import '../assets/css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [auth.isAuthenticated, navigate]);

  if (auth.isLoading) {
    return (
      <div className="bg-dark d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  const handleLogin = () => {
    auth.signinRedirect();
  };

  return (
    <div className="bg-dark">
      <div className="sufee-login d-flex align-content-center flex-wrap">
        <div className="container">
          <div className="login-content">
            <div className="login-logo">
              <a href="/">
                <img className="align-content" src="/src/assets/images/logo.png" alt="" />
              </a>
            </div>
            <div className="login-form">
              <div className="text-center mb-4">
                <h4>Welcome</h4>
                <p>Please sign in to continue</p>
              </div>
              <div className="social-login-content">
                <div className="social-button">
                  <button 
                    type="button" 
                    className="btn btn-primary btn-flat btn-addon m-b-30"
                    onClick={handleLogin}
                  >
                    <i className="fa fa-sign-in"></i> Sign in with OpenID
                  </button>
                </div>
              </div>
              <div className="register-link m-t-15 text-center">
                <p>
                  Don't have account ? Please contact administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;