import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// CSRF token stored in-memory (read from response headers, not cookies)
// This handles cross-origin dev setups where document.cookie can't read backend cookies
let csrfToken: string | null = null;

// Request interceptor: attach CSRF token to mutating requests
api.interceptors.request.use((config) => {
  if (csrfToken && config.method && !["get", "head", "options"].includes(config.method)) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});

// Response interceptor for token refresh, CSRF recovery, and data sanitization
api.interceptors.response.use(
  (response) => {
    // Capture CSRF token from response headers (case-insensitive)
    const newCsrfToken = response.headers["x-csrf-token"] || response.headers["X-CSRF-Token"];
    if (newCsrfToken) {
      csrfToken = newCsrfToken;
    }

    // Global sanitization for legacy "placeholder-blurred" strings
    if (response.data) {
      const dataStr = JSON.stringify(response.data);
      if (dataStr.includes("placeholder-blurred")) {
        const sanitizedData = JSON.parse(dataStr.replace(/placeholder-blurred/g, ""));
        response.data = sanitizedData;
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // CSRF auto-recovery: if 403 due to missing CSRF token, seed it and retry once
    if (
      error.response?.status === 403 &&
      error.response?.data?.message?.includes("CSRF") &&
      !originalRequest._csrfRetry
    ) {
      originalRequest._csrfRetry = true;
      // Trigger a GET to seed the CSRF token (captured in success handler above)
      await api.get("/health");
      // Now csrfToken is populated from the response header
      if (csrfToken) {
        originalRequest.headers["X-CSRF-Token"] = csrfToken;
      }
      return api(originalRequest);
    }

    // Prevent infinite loop if /refresh itself fails
    if (originalRequest.url?.includes("/auth/refresh")) {
      if (typeof window !== "undefined") {
        // Clear local storage to break the GuestOnlyRoute -> ProtectedRoute loop
        localStorage.removeItem("auth-storage");
        window.location.href = "/login?error=session_expired";
      }
      return Promise.reject(error);
    }

    // 401 error: Access token might be expired
    const isLoginRequest = originalRequest.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLoginRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the session
        await api.post("/auth/refresh");
        
        // If successful, retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed (refresh token expired) -> log out
        if (typeof window !== "undefined") {
          // IMPORTANT: Clear store to prevent GuestOnlyRoute redirect loop
          localStorage.removeItem("auth-storage");
          window.location.href = "/login?expired=true";
        }
        return Promise.reject(refreshError);
      }
    }

    // Existing generic redirection logic
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      
      if (error.response?.status === 403 && error.response.data?.isBlocked) {
        if (currentPath !== "/account-suspended") {
          window.location.href = "/account-suspended";
        }
      } else if (!error.response || error.response.status >= 500) {
        // Only redirect if not already on the error page to prevent reload loop
        if (currentPath !== "/505") {
          window.location.href = "/505";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;





