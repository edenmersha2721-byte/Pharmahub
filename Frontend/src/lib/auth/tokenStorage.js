import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN_KEY = "ml.accessToken";
const REFRESH_TOKEN_KEY = "ml.refreshToken";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}


export function decodeUser(token) {
  if (!token) return null;
  try {
    const claims = jwtDecode(token);
    if (!claims?.sub) return null;
    return {
      userId: claims.sub,
      email: claims.email ?? null,
      role: claims.role ?? null,
      exp: claims.exp ?? null,
    };
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const user = decodeUser(token);
  if (!user?.exp) return true;
  return user.exp * 1000 <= Date.now() + 10_000;
}
