import { AuthProviderProps } from "react-oidc-context";

export const oidcConfig: AuthProviderProps = {
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
  post_logout_redirect_uri: window.location.origin,  // Aggiungiamo l'URI di reindirizzamento post-logout
  onSignoutCallback: () => {
    window.location.href = '/';  // Forza il reindirizzamento alla home dopo il logout
  }
};

export type UserProfile = {
  email?: string;
  name?: string;
  picture?: string;
};
