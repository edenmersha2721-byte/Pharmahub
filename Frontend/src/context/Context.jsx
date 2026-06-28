import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import * as authApi from "@/features/auth/api/authApi";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  decodeUser,
  isTokenExpired,
} from "@/lib/auth/tokenStorage";


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  const applyTokens = useCallback((authResponse) => {
    setTokens({
      accessToken: authResponse.accessToken,
      refreshToken: authResponse.refreshToken,
    });
    const decoded = decodeUser(authResponse.accessToken);
    setUser(decoded);
    setStatus(decoded ? "authenticated" : "unauthenticated");
    return decoded;
  }, []);

  const clearSession = useCallback(() => {
    clearTokens();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      const access = getAccessToken();
      const refresh = getRefreshToken();

      if (access && !isTokenExpired(access)) {
        if (active) {
          setUser(decodeUser(access));
          setStatus("authenticated");
        }
        return;
      }
      if (refresh) {
        try {
          const data = await authApi.refreshSession(refresh);
          if (active) applyTokens(data);
          return;
        } catch {
         
        }
      }
      if (active) clearSession();
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, [applyTokens, clearSession]);

  const login = useCallback(
    async (credentials) => {
      const data = await authApi.login(credentials);
      return applyTokens(data); 
    },
    [applyTokens]
  );

  const logout = useCallback(async () => {
    const refresh = getRefreshToken();
    try {
      await authApi.logout(refresh);
    } catch {

    } finally {
      clearSession();
    }
  }, [clearSession]);

 
  const registerCustomer = useCallback((payload) => authApi.registerCustomer(payload), []);
  const registerPharmacy = useCallback((payload) => authApi.registerPharmacy(payload), []);

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      login,
      logout,
      registerCustomer,
      registerPharmacy,
    }),
    [user, status, login, logout, registerCustomer, registerPharmacy]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
