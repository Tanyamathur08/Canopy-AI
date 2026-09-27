import axios from "axios";

const isDev = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

let rawBase = import.meta.env.VITE_API_BASE_URL;
if (rawBase && !rawBase.startsWith("http://") && !rawBase.startsWith("https://") && !rawBase.startsWith("/")) {
  rawBase = `https://${rawBase}`;
}

const API_BASE = rawBase
  ? (rawBase.endsWith("/api/v1") ? rawBase : `${rawBase.replace(/\/$/, "")}/api/v1`)
  : (isDev && window.location.port !== "8000" ? "http://localhost:8000/api/v1" : "/api/v1");

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("codemind_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for automatic refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("codemind_refresh_token");
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE}/auth/refresh`, {
            refresh_token: refreshToken
          });
          const { access_token, refresh_token: newRefresh } = res.data;
          localStorage.setItem("codemind_access_token", access_token);
          localStorage.setItem("codemind_refresh_token", newRefresh);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch {
          localStorage.removeItem("codemind_access_token");
          localStorage.removeItem("codemind_refresh_token");
        }
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: (url, params) => apiClient.get(url, { params }).then((res) => res.data),
  post: (url, data) => apiClient.post(url, data).then((res) => res.data),
  put: (url, data) => apiClient.put(url, data).then((res) => res.data),
  delete: (url) => apiClient.delete(url).then((res) => res.data),
  upload: (url, formData) =>
    apiClient
      .post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then((res) => res.data)
};

export default apiClient;
