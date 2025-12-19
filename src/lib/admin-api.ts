// Admin API helper functions

const API_BASE = '/api/admin';

// Get auth token (in production, get from secure storage)
const getAuthToken = () => {
  // For demo, use a mock token
  return 'Bearer demo-admin-token';
};

// Generic API request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthToken(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiRequest('/dashboard/stats'),
};

// Users API
export const usersAPI = {
  getUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    verified?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiRequest(`/users?${queryParams}`);
  },
  
  updateUser: (userId: string, updates: any) =>
    apiRequest('/users', {
      method: 'PUT',
      body: JSON.stringify({ userId, updates }),
    }),
  
  performAction: (userId: string, action: string, reason?: string) =>
    apiRequest('/users/action', {
      method: 'POST',
      body: JSON.stringify({ userId, action, reason }),
    }),
};

// Bookings API
export const bookingsAPI = {
  getBookings: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiRequest(`/bookings?${queryParams}`);
  },
  
  updateBooking: (bookingId: string, updates: any) =>
    apiRequest('/bookings', {
      method: 'PUT',
      body: JSON.stringify({ bookingId, updates }),
    }),
  
  performAction: (bookingId: string, action: string, data?: any) =>
    apiRequest('/bookings/action', {
      method: 'POST',
      body: JSON.stringify({ bookingId, action, data }),
    }),
  
  deleteBooking: (bookingId: string) =>
    apiRequest(`/bookings?id=${bookingId}`, {
      method: 'DELETE',
    }),
};

// Transactions API
export const transactionsAPI = {
  getTransactions: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiRequest(`/transactions?${queryParams}`);
  },
  
  updateTransaction: (transactionId: string, updates: any) =>
    apiRequest('/transactions', {
      method: 'PUT',
      body: JSON.stringify({ transactionId, updates }),
    }),
  
  performAction: (transactionId: string, action: string, data?: any) =>
    apiRequest('/transactions/action', {
      method: 'POST',
      body: JSON.stringify({ transactionId, action, data }),
    }),
  
  exportTransactions: (format: string, dateFrom?: string, dateTo?: string) =>
    apiRequest('/transactions/export', {
      method: 'POST',
      body: JSON.stringify({ format, dateFrom, dateTo }),
    }),
};

// Services API
export const servicesAPI = {
  getServices: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    active?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiRequest(`/services?${queryParams}`);
  },
  
  updateService: (serviceId: string, updates: any) =>
    apiRequest('/services', {
      method: 'PUT',
      body: JSON.stringify({ serviceId, updates }),
    }),
  
  performAction: (serviceId: string, action: string, data?: any) =>
    apiRequest('/services/action', {
      method: 'POST',
      body: JSON.stringify({ serviceId, action, data }),
    }),
  
  deleteService: (serviceId: string) =>
    apiRequest(`/services?id=${serviceId}`, {
      method: 'DELETE',
    }),
};

// Support API
export const supportAPI = {
  getTickets: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiRequest(`/support?${queryParams}`);
  },
  
  updateTicket: (ticketId: string, updates: any) =>
    apiRequest('/support', {
      method: 'PUT',
      body: JSON.stringify({ ticketId, updates }),
    }),
  
  sendMessage: (ticketId: string, message: string) =>
    apiRequest('/support/message', {
      method: 'POST',
      body: JSON.stringify({ ticketId, message }),
    }),
  
  deleteTicket: (ticketId: string) =>
    apiRequest(`/support?id=${ticketId}`, {
      method: 'DELETE',
    }),
};

// Promo Codes API
export const promosAPI = {
  getPromoCodes: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiRequest(`/promos?${queryParams}`);
  },
  
  createPromoCode: (promoData: any) =>
    apiRequest('/promos', {
      method: 'POST',
      body: JSON.stringify(promoData),
    }),
  
  updatePromoCode: (promoId: string, updates: any) =>
    apiRequest('/promos', {
      method: 'PUT',
      body: JSON.stringify({ promoId, updates }),
    }),
  
  deletePromoCode: (promoId: string) =>
    apiRequest(`/promos?id=${promoId}`, {
      method: 'DELETE',
    }),
  
  validatePromoCode: (code: string, userId: string, amount: number, serviceId?: string) =>
    apiRequest('/promos/validate', {
      method: 'POST',
      body: JSON.stringify({ code, userId, amount, serviceId }),
    }),
};

// Audit Log API
export const auditAPI = {
  logAction: (action: string, details: any) =>
    apiRequest('/audit', {
      method: 'POST',
      body: JSON.stringify({ action, details, timestamp: new Date().toISOString() }),
    }),
  
  getAuditLogs: (params?: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiRequest(`/audit?${queryParams}`);
  },
};
