import axios from 'axios';

const API_URL = 'https://grameen-connect.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  sendOTP: (phone) => api.post('/auth/send-otp', { phone }),
  verifyOTP: (phone, otp) => api.post('/auth/verify-otp', { phone, otp }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  getMe: () => api.get('/auth/me'),
};

// User APIs
export const usersAPI = {
  getWorkers: (params) => api.get('/users/workers', { params }),
  getUserProfile: (id) => api.get(`/users/${id}`),
  getMyProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  deleteAccount: () => api.delete('/users/me'),
  uploadAvatar: (formData) => api.post('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Job APIs
export const jobsAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/my'),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  updateJobStatus: (id, status) => api.patch(`/jobs/${id}/status`, { status }),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};

// Application APIs
export const applicationsAPI = {
  apply: (data) => api.post('/applications', data),
  getMyApplications: (params) => api.get('/applications/my', { params }),
  getIncomingApplications: (params) => api.get('/applications/incoming', { params }),
  updateApplication: (id, status) => api.patch(`/applications/${id}`, { status }),
  deleteApplication: (id) => api.delete(`/applications/${id}`),
};

// Message APIs
export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (receiverId, text) => api.post('/messages', { receiverId, text }),
  markMessagesRead: (userId) => api.patch(`/messages/${userId}/read`),
};

// Review APIs
export const reviewsAPI = {
  createReview: (data) => api.post('/reviews', data),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

// Notification APIs
export const notificationsAPI = {
  getNotifications: () => api.get('/notifications'),
  markAllRead: () => api.patch('/notifications/read'),
  markNotificationRead: (id) => api.patch(`/notifications/${id}/read`),
};

export default api;
