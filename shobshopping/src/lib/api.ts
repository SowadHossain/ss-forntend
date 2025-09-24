import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://shobshopping.com/api";

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  // Do not set Content-Type globally; let Axios handle it per request
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Attach token on each request if available
api.interceptors.request.use((config) => {
  // Follow project convention: prefer sessionStorage, fallback to localStorage
  const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle common errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    // If backend reports token is not valid / expired for access token, clear stored tokens
    try {
      const isTokenNotValid = data?.code === "token_not_valid";
      const hasExpiredMessage = Array.isArray(data?.messages) && data.messages.some((m: any) => {
        return (m?.token_class === "AccessToken" || m?.token_type === "access") && /expired/i.test(m?.message || "");
      });

      if (status === 401 && (isTokenNotValid || hasExpiredMessage)) {
        // Remove tokens from both sessionStorage and localStorage
        try {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshtoken");
        } catch (e) {
          // ignore
        }
        try {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshtoken");
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // non-blocking
    }

    const message = data?.detail || "API request failed";
    return Promise.reject(new Error(message));
  }
);

// Define API methods
export const API = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await api.post("/auth/login/", { email, password });
    const { access, refresh } = res.data;
    if (access) localStorage.setItem("accessToken", access);
    // Do not store refresh token here; handled in LoginPage
    return res.data;
  },
  refreshToken: (refresh?: string) => {
    // If no refresh token provided, try to read from cookie
    if (!refresh) {
      const match = document.cookie.match(/(?:^|; )refreshToken=([^;]*)/);
      refresh = match ? decodeURIComponent(match[1]) : "";
    }
    return api.post("/auth/token/refresh/", { refresh }).then(res => res.data);
  },
  register: (data: { email: string; name: string; password: string; phone?: string; address?: string; role?: string }) => api.post("/auth/register/", data).then(res => res.data),
  getProfile: () => api.get("/auth/profile/").then(res => res.data),
  updateProfile: (data: any) => api.put("/auth/profile/", data).then(res => res.data),
  getSellerProfile: () => api.get("/auth/seller/profile/").then(res => res.data),
  updateSellerProfile: (data: any) => api.put("/auth/seller/profile/", data).then(res => res.data),

  getAllSellers: (data: any) => api.get("/auth/seller/public/all/", { params: data }).then(res => res.data),

  // Cart
  getCart: (search?: string) => api.get("/cart/", { params: search ? { search } : {} }).then(res => res.data),
  createCart: (data: any) => api.post("/cart/", data).then(res => res.data),
  getCartItem: (id: number) => api.get(`/cart/${id}/`).then(res => res.data),
  updateCartItem: (id: number, data: any) => api.put(`/cart/${id}/`, data).then(res => res.data),
  partialUpdateCartItem: (id: number, data: any) => api.patch(`/cart/${id}/`, data).then(res => res.data),
  deleteCartItem: (id: number) => api.delete(`/cart/${id}/`).then(res => res.data),

  // Categories
  getCategories: (search?: string) => api.get("/categories/", { params: search ? { search } : {} }).then(res => res.data),
  createCategory: (data: any) => api.post("/categories/", data).then(res => res.data),
  getCategoryById: (id: number) => api.get(`/categories/${id}/`).then(res => res.data),
  updateCategory: (id: number, data: any) => api.put(`/categories/${id}/`, data).then(res => res.data),
  partialUpdateCategory: (id: number, data: any) => api.patch(`/categories/${id}/`, data).then(res => res.data),
  deleteCategory: (id: number) => api.delete(`/categories/${id}/`).then(res => res.data),

  // Coupons
  getCoupons: (search?: string) => api.get("/coupons/", { params: search ? { search } : {} }).then(res => res.data),
  createCoupon: (data: any) => api.post("/coupons/", data).then(res => res.data),
  applyCoupon: (data: any) => api.post("/coupons/apply/", data).then(res => res.data),
  getCouponById: (id: number) => api.get(`/coupons/${id}/`).then(res => res.data),
  updateCoupon: (id: number, data: any) => api.put(`/coupons/${id}/`, data).then(res => res.data),
  partialUpdateCoupon: (id: number, data: any) => api.patch(`/coupons/${id}/`, data).then(res => res.data),
  deleteCoupon: (id: number) => api.delete(`/coupons/${id}/`).then(res => res.data),

  // Onboarding Seller Applications
  getSellerApplications: (search?: string) => api.get("/onboarding/seller-applications/", { params: search ? { search } : {} }).then(res => res.data),
  createSellerApplication: (data: any) => api.post("/onboarding/seller-applications/", data).then(res => res.data),
  getSellerApplicationById: (id: number) => api.get(`/onboarding/seller-applications/${id}/`).then(res => res.data),
  updateSellerApplication: (id: number, data: any) => api.put(`/onboarding/seller-applications/${id}/`, data).then(res => res.data),
  partialUpdateSellerApplication: (id: number, data: any) => api.patch(`/onboarding/seller-applications/${id}/`, data).then(res => res.data),
  deleteSellerApplication: (id: number) => api.delete(`/onboarding/seller-applications/${id}/`).then(res => res.data),
  approveSellerApplication: (id: number, data: any) => api.post(`/onboarding/seller-applications/${id}/approve/`, data).then(res => res.data),
  rejectSellerApplication: (id: number, data: any) => api.post(`/onboarding/seller-applications/${id}/reject/`, data).then(res => res.data),

  // Orders
  getOrders: (search?: string) => api.get("/orders/", { params: search ? { search } : {} }).then(res => res.data),
  createOrder: (data: any) => api.post("/orders/", data).then(res => res.data),
  getOrderById: (id: number) => api.get(`/orders/${id}/`).then(res => res.data),
  updateOrder: (id: number, data: any) => api.put(`/orders/${id}/`, data).then(res => res.data),
  partialUpdateOrder: (id: number, data: any) => api.patch(`/orders/${id}/`, data).then(res => res.data),
  deleteOrder: (id: number) => api.delete(`/orders/${id}/`).then(res => res.data),
  requestOrderCancel: (id: number, data: any) => api.post(`/orders/${id}/request_cancel/`, data).then(res => res.data),
  requestOrderRefund: (id: number, data: any) => api.post(`/orders/${id}/request_refund/`, data).then(res => res.data),
  requestOrderReplace: (id: number, data: any) => api.post(`/orders/${id}/request_replace/`, data).then(res => res.data),

  // Products
  getProducts: (search?: string) => api.get("/products/", { params: search ? { search } : {} }).then(res => res.data),
  createProduct: (data: any) => {
    if (data instanceof FormData) {
      return api.post("/products/", data, {
        headers: { "Content-Type": "multipart/form-data" }
      }).then(res => res.data);
    }
    return api.post("/products/", data).then(res => res.data);
  },
  getProductById: (id: number) => api.get(`/products/${id}/`).then(res => res.data),
  updateProduct: (id: number, data: any) => api.put(`/products/${id}/`, data).then(res => res.data),
  partialUpdateProduct: (id: number, data: any) => api.patch(`/products/${id}/`, data).then(res => res.data),
  deleteProduct: (id: number) => api.delete(`/products/${id}/`).then(res => res.data),

  // Add media (images as data URIs and video links) to a product
  addProductMedia: (id: number, data: any) => api.post(`/products/${id}/add_media/`, data).then(res => res.data),

  getSellerProducts: (search?: string) => api.get("/seller/products/", { params: search ? { search } : {} }).then(res => res.data),

  // QnA
  getAnswers: (search?: string) => api.get("/qna/answers/", { params: search ? { search } : {} }).then(res => res.data),
  createAnswer: (data: any) => api.post("/qna/answers/", data).then(res => res.data),
  getAnswerById: (id: number) => api.get(`/qna/answers/${id}/`).then(res => res.data),
  updateAnswer: (id: number, data: any) => api.put(`/qna/answers/${id}/`, data).then(res => res.data),
  partialUpdateAnswer: (id: number, data: any) => api.patch(`/qna/answers/${id}/`, data).then(res => res.data),
  deleteAnswer: (id: number) => api.delete(`/qna/answers/${id}/`).then(res => res.data),
  getQuestions: (search?: string) => api.get("/qna/questions/", { params: search ? { search } : {} }).then(res => res.data),
  createQuestion: (data: any) => api.post("/qna/questions/", data).then(res => res.data),
  getQuestionById: (id: number) => api.get(`/qna/questions/${id}/`).then(res => res.data),
  updateQuestion: (id: number, data: any) => api.put(`/qna/questions/${id}/`, data).then(res => res.data),
  partialUpdateQuestion: (id: number, data: any) => api.patch(`/qna/questions/${id}/`, data).then(res => res.data),
  deleteQuestion: (id: number) => api.delete(`/qna/questions/${id}/`).then(res => res.data),
  getProductQuestions: (product_id: number) => api.get(`/qna/questions/${product_id}/qna/`).then(res => res.data),

  // Reviews
  getReviews: (search?: string) => api.get("/reviews/reviews/", { params: search ? { search } : {} }).then(res => res.data),
  createReview: (data: any) => api.post("/reviews/reviews/", data).then(res => res.data),
  getReviewById: (id: number) => api.get(`/reviews/reviews/${id}/`).then(res => res.data),
  updateReview: (id: number, data: any) => api.put(`/reviews/reviews/${id}/`, data).then(res => res.data),
  partialUpdateReview: (id: number, data: any) => api.patch(`/reviews/reviews/${id}/`, data).then(res => res.data),
  deleteReview: (id: number) => api.delete(`/reviews/reviews/${id}/`).then(res => res.data),

  // Support
  getSupportMessages: (search?: string) => api.get("/support/messages/", { params: search ? { search } : {} }).then(res => res.data),
  createSupportMessage: (data: any) => api.post("/support/messages/", data).then(res => res.data),
  getSupportMessageById: (id: number) => api.get(`/support/messages/${id}/`).then(res => res.data),
  updateSupportMessage: (id: number, data: any) => api.put(`/support/messages/${id}/`, data).then(res => res.data),
  partialUpdateSupportMessage: (id: number, data: any) => api.patch(`/support/messages/${id}/`, data).then(res => res.data),
  deleteSupportMessage: (id: number) => api.delete(`/support/messages/${id}/`).then(res => res.data),
  getSupportTickets: (search?: string) => api.get("/support/tickets/", { params: search ? { search } : {} }).then(res => res.data),
  createSupportTicket: (data: any) => api.post("/support/tickets/", data).then(res => res.data),
  getSupportTicketById: (id: number) => api.get(`/support/tickets/${id}/`).then(res => res.data),
  updateSupportTicket: (id: number, data: any) => api.put(`/support/tickets/${id}/`, data).then(res => res.data),
  partialUpdateSupportTicket: (id: number, data: any) => api.patch(`/support/tickets/${id}/`, data).then(res => res.data),
  deleteSupportTicket: (id: number) => api.delete(`/support/tickets/${id}/`).then(res => res.data),
  replySupportTicket: (id: number, data: any) => api.post(`/support/tickets/${id}/reply/`, data).then(res => res.data),

  // Tags
  getTags: (search?: string) => api.get("/tags/", { params: search ? { search } : {} }).then(res => res.data),
  createTag: (data: any) => api.post("/tags/", data).then(res => res.data),
  getTagById: (id: number) => api.get(`/tags/${id}/`).then(res => res.data),
  updateTag: (id: number, data: any) => api.put(`/tags/${id}/`, data).then(res => res.data),
  partialUpdateTag: (id: number, data: any) => api.patch(`/tags/${id}/`, data).then(res => res.data),
  deleteTag: (id: number) => api.delete(`/tags/${id}/`).then(res => res.data),

  // Wishlist
  getWishlist: (search?: string) => api.get("/wishlist/", { params: search ? { search } : {} }).then(res => res.data),
  createWishlistItem: (data: any) => api.post("/wishlist/", data).then(res => res.data),
  getWishlistItemById: (id: number) => api.get(`/wishlist/${id}/`).then(res => res.data),
  updateWishlistItem: (id: number, data: any) => api.put(`/wishlist/${id}/`, data).then(res => res.data),
  partialUpdateWishlistItem: (id: number, data: any) => api.patch(`/wishlist/${id}/`, data).then(res => res.data),
  deleteWishlistItem: (id: number) => api.delete(`/wishlist/${id}/`).then(res => res.data),
  moveWishlistItemToCart: (id: number, data: any) => api.post(`/wishlist/${id}/move_to_cart/`, data).then(res => res.data),
};
