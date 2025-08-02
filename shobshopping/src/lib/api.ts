import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://shobshopping.com/api";

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token on each request if available
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle common errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || "API request failed";
    return Promise.reject(new Error(message));
  }
);

// Define API methods
export const API = {
  // 🟢 Products
  getProducts: () => api.get("/products/").then(res => res.data),
  getProductById: (id: number) => api.get(`/products/${id}/`).then(res => res.data),

  // 🟢 Reviews
  createReview: (data: { product: number; rating: number; comment?: string }) =>
    api.post("/reviews/", data).then(res => res.data),

  // 🟢 Auth
  login: (email: string, password: string) =>
    api.post("/auth/login/", { email, password }).then(res => res.data),

  refreshToken: (refresh: string) =>
    api.post("/auth/token/refresh/", { refresh }).then(res => res.data),
};
