import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Products ──────────────────────────────────────────────
export const productsApi = {
  getAll: (params?: any) => api.get('/products', { params }),
  getOne: (slug: string) => api.get(`/products/${slug}`),
  search: (q: string) => api.get('/products/search', { params: { q } }),
  create: (data: FormData) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) => api.patch(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
  profile: () => api.get('/auth/profile'),
};

// ── Orders ────────────────────────────────────────────────
export const ordersApi = {
  create: (data: any) => api.post('/orders', data),
  myOrders: () => api.get('/orders/my'),
  track: (id: string) => api.get(`/orders/${id}/track`),
  getAll: (params?: any) => api.get('/orders', { params }),
  updateStatus: (id: string, data: any) => api.patch(`/orders/${id}/status`, data),
};

// ── Customers ─────────────────────────────────────────────
export const customersApi = {
  getAll: (params?: any) => api.get('/customers', { params }),
  getOne: (id: string) => api.get(`/customers/${id}`),
  suspend: (id: string) => api.patch(`/customers/${id}/suspend`),
};

// ── Contact ───────────────────────────────────────────────
export const contactApi = {
  getSettings: () => api.get('/contact/settings'),
  updateSettings: (data: any) => api.put('/contact/settings', data),
  sendInquiry: (data: any) => api.post('/contact/inquiry', data),
};
