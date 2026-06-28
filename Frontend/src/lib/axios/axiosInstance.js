import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "@/lib/auth/tokenStorage";

/**
 * Single Axios instance for all gateway traffic.
 *
 * - Request interceptor attaches `Authorization: Bearer <accessToken>`.
 * - Response interceptor transparently refreshes the access token on a 401
 *   via `POST /auth/refresh?refreshToken=...`, then retries the failed request.
 *   Concurrent 401s are queued so only one refresh call is made.
 */

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

const AUTH_BYPASS = ["/auth/login", "/auth/admin/login", "/auth/register", "/auth/refresh"];

function isAuthBypass(url = "") {
  return AUTH_BYPASS.some((path) => url.includes(path));
}

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- refresh coordination ---------------------------------------------------
let isRefreshing = false;
let pendingQueue = [];

function flushQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

/** Called when refresh fails: nuke tokens and bounce to login. */
function forceLogout() {
  clearTokens();
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status !== 401 || !original || original._retry || isAuthBypass(original.url)) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      forceLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Wait for the in-flight refresh, then retry with the new token.
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        original._retry = true;
        return axiosInstance(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      // Refresh token is passed as a query param (backend contract).
      const { data } = await axios.post(`${baseURL}/auth/refresh`, null, {
        params: { refreshToken },
      });
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      flushQueue(null, data.accessToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return axiosInstance(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
