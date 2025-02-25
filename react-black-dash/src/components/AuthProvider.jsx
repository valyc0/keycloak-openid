import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AuthProvider as OidcProvider, useAuth as useOidcAuth } from "react-oidc-context";
import { oidcConfig } from "../lib/auth-config";
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const useFakeAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Automatically authenticate in development mode after a brief delay
    const timer = setTimeout(() => {
      const fakeUser = {
        name: 'Development User',
        email: 'dev@example.com',
        access_token: 'fake-token',
        profile: {
          name: 'Development User',
          email: 'dev@example.com',
        }
      };
      setUser(fakeUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const login = useCallback(() => {
    const fakeUser = {
      name: 'Development User',
      email: 'dev@example.com',
      access_token: 'fake-token',
      profile: {
        name: 'Development User',
        email: 'dev@example.com',
      }
    };
    setUser(fakeUser);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    user,
    login,
    logout,
    error: null,
    isLoading,
    token: user?.access_token
  };
};

export const AuthProvider = ({ children }) => {
  const useFakeAuthentication = import.meta.env.VITE_USE_FAKE_AUTH === 'true';

  if (useFakeAuthentication) {
    return <FakeAuthProvider>{children}</FakeAuthProvider>;
  }

  return (
    <OidcProvider {...oidcConfig}>
      <AuthContextProvider>{children}</AuthContextProvider>
    </OidcProvider>
  );
};

const FakeAuthProvider = ({ children }) => {
  const auth = useFakeAuth();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthContextProvider = ({ children }) => {
  const auth = useOidcAuth();

  const contextValue = {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    login: auth.signinRedirect,
    logout: auth.signoutRedirect,
    error: auth.error,
    isLoading: auth.isLoading,
    token: auth.user?.access_token
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

FakeAuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProvider;