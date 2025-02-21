export const oidcConfig = {
  authority: import.meta.env.VITE_OIDC_ISSUER || "http://localhost:8080/realms/master",
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID || "react-client",
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI || "http://localhost:5173",
  scope: "openid profile email",
  onSigninCallback: () => {
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
  },
  post_logout_redirect_uri: window.location.origin,
  onSignoutCallback: () => {
    window.location.href = '/';
  }
};

export const UserProfile = {
  email: '',
  name: '',
  picture: ''
};