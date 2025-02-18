import { AuthProvider as OidcProvider } from "react-oidc-context";
import { oidcConfig } from "../lib/auth-config";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <OidcProvider {...oidcConfig}>
      {children}
    </OidcProvider>
  );
};

export default AuthProvider;
