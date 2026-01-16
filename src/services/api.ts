import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken },
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Service Methods

// ============ AUTH ENDPOINTS ============
export const authService = {
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => axiosInstance.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    axiosInstance.post("/auth/login", data),

  verifyEmail: (token: string) =>
    axiosInstance.get("/auth/verify-email", { params: { token } }),

  resendVerificationEmail: (email: string) =>
    axiosInstance.post("/auth/resend-verification", { email }),

  refreshToken: (refreshToken: string) =>
    axiosInstance.post("/auth/refresh", { refreshToken }),

  logout: () => axiosInstance.post("/auth/logout"),
  mfaSetup: () => axiosInstance.post("/auth/mfa/setup"),
  mfaVerify: (token: string) => axiosInstance.post("/auth/mfa/verify", { token }),
  mfaLoginVerify: (tempToken: string, token: string) =>
    axiosInstance.post("/auth/mfa/login-verify", { tempToken, token }),
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => axiosInstance.post("/auth/change-password", data),
};

// ============ USER ENDPOINTS ============
export const usersService = {
  getCurrentUser: () => axiosInstance.get("/users/me"),

  getUserById: (id: string) => axiosInstance.get(`/users/${id}`),

  updateUser: (
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      profilePicture?: string;
      status?: string;
    }
  ) => axiosInstance.put(`/users/${id}`, data),

  getAllUsers: (limit: number = 10, offset: number = 0) =>
    axiosInstance.get("/users", { params: { limit, offset } }),

  getAllUsersForAdmin: (skip: number = 0, take: number = 10) =>
    axiosInstance.get("/users/admin/all", { params: { skip, take } }),

  deleteUser: (id: string) => axiosInstance.delete(`/users/${id}`),

  assignRole: (userId: string, roleId: string) =>
    axiosInstance.post(`/users/${userId}/roles/${roleId}`),

  removeRole: (userId: string, roleId: string) =>
    axiosInstance.delete(`/users/${userId}/roles/${roleId}`),

  getSupportStaff: (skip: number = 0, take: number = 10) =>
    axiosInstance.get("/users/admin/support-staff", { params: { skip, take } }),
};

// ============ TENANT/COMPANY ENDPOINTS ============
export const tenantsService = {
  createTenant: (data: {
    name: string;
    slug?: string;
    description?: string;
    website?: string;
    industry?: string;
    maxUsers?: number;
  }) => axiosInstance.post("/companies", data),

  getUserTenants: () => axiosInstance.get("/companies"),

  getTenantById: (id: string) => axiosInstance.get(`/companies/${id}`),

  getTenantBySlug: (slug: string) => axiosInstance.get(`/companies/${slug}`),

  updateTenant: (
    id: string,
    data: {
      name?: string;
      description?: string;
      website?: string;
      maxUsers?: number;
    }
  ) => axiosInstance.put(`/companies/${id}`, data),

  deleteTenant: (id: string) => axiosInstance.delete(`/companies/${id}`),

  getAllTenants: (limit: number = 10, offset: number = 0) =>
    axiosInstance.get("/companies", { params: { skip: offset, take: limit } }),
};

// ============ COMPANY ENDPOINTS ============
export const companiesService = {
  createCompany: (data: {
    name: string;
    tin?: string;
    rcNumber?: string;
    industry?: string;
    numberOfEmployees?: number;
    state?: string;
    lga?: string;
    website?: string;
    description?: string;
  }) => axiosInstance.post("/companies", data),

  getCompanyById: (id: string) => axiosInstance.get(`/companies/${id}`),

  updateCompany: (id: string, data: Record<string, any>) =>
    axiosInstance.put(`/companies/${id}`, data),

  getUserCompanies: () => axiosInstance.get("/companies"),

  getAllCompanies: (skip: number = 0, take: number = 10) =>
    axiosInstance.get("/companies/admin/all", { params: { skip, take } }),

  getCompanySubscription: (companyId: string) =>
    axiosInstance.get(`/companies/${companyId}/subscription`),

  deleteCompany: (id: string) => axiosInstance.delete(`/companies/${id}`),
};

// ============ SUBSCRIPTION ENDPOINTS ============
export const subscriptionsService = {
  getCurrentSubscription: (companyId: string) =>
    axiosInstance.get("/subscriptions/current", { params: { companyId } }),

  getSubscriptionHistory: (companyId: string) =>
    axiosInstance.get(`/subscriptions/${companyId}/history`),

  createSubscription: (data: {
    companyId: string;
    planId: string;
    billingCycle: string;
  }) => axiosInstance.post("/subscriptions", data),

  updateSubscription: (
    subscriptionId: string,
    data: Record<string, any>
  ) => axiosInstance.put(`/subscriptions/${subscriptionId}`, data),

  cancelSubscription: (subscriptionId: string) =>
    axiosInstance.post(`/subscriptions/${subscriptionId}/cancel`),
};

// ============ SUPPORT ENDPOINTS ============
export const supportService = {
  createTicket: (data: { title: string; description: string; priority?: string }) =>
    axiosInstance.post('/support', data),

  getTicketById: (id: string) => axiosInstance.get(`/support/${id}`),

  getOpenTickets: (skip: number = 0, take: number = 10) =>
    axiosInstance.get('/support', { params: { skip, take } }),

  getTicketStats: () => axiosInstance.get('/support/admin/stats'),

  getPendingTickets: (skip: number = 0, take: number = 10) =>
    axiosInstance.get('/support/admin/pending', { params: { skip, take } }),

  getClosedTickets: (skip: number = 0, take: number = 10) =>
    axiosInstance.get('/support/admin/closed', { params: { skip, take } }),

  updateTicket: (id: string, data: Record<string, any>) =>
    axiosInstance.put(`/support/${id}`, data),

  closeTicket: (id: string, resolution?: string) =>
    axiosInstance.post(`/support/${id}/close`, { resolution }),

  deleteTicket: (id: string) => axiosInstance.delete(`/support/${id}`),

  addMessage: (ticketId: string, content: string, companyId?: string) =>
    axiosInstance.post(`/support/${ticketId}/messages`, { content, companyId }),

  getTicketMessages: (ticketId: string, skip: number = 0, take: number = 50) =>
    axiosInstance.get(`/support/${ticketId}/messages`, { params: { skip, take } }),
  
  // Assignment / staff endpoints
  assignTicket: (id: string, assignedToUserId: string) =>
    axiosInstance.put(`/support/${id}/assign`, { assignedToUserId }),

  getMyAssignedTickets: (skip: number = 0, take: number = 10) =>
    axiosInstance.get(`/support/assigned/me`, { params: { skip, take } }),

  getUnassignedTickets: (skip: number = 0, take: number = 10) =>
    axiosInstance.get(`/support/unassigned`, { params: { skip, take } }),

  // Support staff dashboard endpoints
  getAssignedTicketsStats: () =>
    axiosInstance.get(`/support/assigned/stats`),

  getUrgentAssignedTickets: (skip: number = 0, take: number = 10) =>
    axiosInstance.get(`/support/assigned/urgent`, { params: { skip, take } }),

  getAssignedTicketsActivity: (skip: number = 0, take: number = 10) =>
    axiosInstance.get(`/support/assigned/activity`, { params: { skip, take } }),

  getAssignedTicketsMetrics: () =>
    axiosInstance.get(`/support/assigned/metrics`),

  // Notification endpoints
  getNotifications: (skip: number = 0, take: number = 20) =>
    axiosInstance.get(`/notifications`, { params: { skip, take } }),

  markNotificationAsRead: (notificationId: string) =>
    axiosInstance.patch(`/notifications/${notificationId}/read`),

  markAllNotificationsAsRead: () =>
    axiosInstance.patch(`/notifications/read-all`),

  archiveNotification: (notificationId: string) =>
    axiosInstance.patch(`/notifications/${notificationId}/archive`),

  deleteNotification: (notificationId: string) =>
    axiosInstance.delete(`/notifications/${notificationId}`),

  getUnreadCount: () =>
    axiosInstance.get(`/notifications/unread-count`),
};

// ============ RBAC ENDPOINTS ============
export const rbacService = {
  getAllRoles: () => axiosInstance.get("/rbac/roles"),

  getRoleById: (id: string) => axiosInstance.get(`/rbac/roles/${id}`),

  createRole: (data: {
    name: string;
    description: string;
    permissions: string[];
  }) => axiosInstance.post("/rbac/roles", data),

  updateRole: (id: string, data: Record<string, any>) =>
    axiosInstance.put(`/rbac/roles/${id}`, data),

  deleteRole: (id: string) => axiosInstance.delete(`/rbac/roles/${id}`),
};

export default axiosInstance;
