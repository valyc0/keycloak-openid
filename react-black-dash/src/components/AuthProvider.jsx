import { createContext, useContext } from 'react';
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

export const AuthProvider = ({ children }) => {
  return (
    <OidcProvider {...oidcConfig}>
      <AuthContextProvider>{children}</AuthContextProvider>
    </OidcProvider>
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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProvider;