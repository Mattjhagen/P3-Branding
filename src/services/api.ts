import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  Loan, 
  APIResponse, 
  PaginatedResponse, 
  PlatformMetrics,
  Transaction,
  Review,
  Dispute,
  KYCDocument,
  PlatformEvent
} from '@/types';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.p3lending.com';
const API_VERSION = 'v1';

// Mock data for development when backend is unavailable
const MOCK_METRICS = {
  totalValueLocked: 24500000,
  totalUsers: 12847,
  defaultRate: 1.3,
  averageInterestRate: 5.2
};

const MOCK_USER = {
  id: 'mock-user-1',
  email: 'demo@p3lending.space',
  firstName: 'Demo',
  lastName: 'User',
  walletAddress: '0x1234567890123456789012345678901234567890',
  reputation: {
    score: 850,
    factors: ['successful_loans', 'on_time_payments', 'positive_reviews']
  },
  kycStatus: 'verified',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service class
export class APIService {
  // Authentication endpoints
  async login(walletAddress: string, signature: string): Promise<APIResponse<{ token: string; user: User }>> {
    const response = await apiClient.post('/auth/login', {
      walletAddress,
      signature,
    });
    return response.data;
  }

  async register(userData: Partial<User>): Promise<APIResponse<User>> {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      // Return mock success for development
      console.warn('Backend unavailable, using mock registration');
      return {
        success: true,
        data: { ...MOCK_USER, ...userData },
        message: 'Mock registration successful - backend unavailable'
      };
    }
  }

  async refreshToken(): Promise<APIResponse<{ token: string }>> {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  }

  async logout(): Promise<APIResponse<void>> {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  }

  // User endpoints
  async getCurrentUser(): Promise<APIResponse<User>> {
    const response = await apiClient.get('/users/me');
    return response.data;
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<APIResponse<User>> {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  }

  async getUserById(userId: string): Promise<APIResponse<User>> {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  }

  async getUserReputation(userId: string): Promise<APIResponse<{ score: number; factors: any[] }>> {
    const response = await apiClient.get(`/users/${userId}/reputation`);
    return response.data;
  }

  async updateUserReputation(userId: string, factors: any[]): Promise<APIResponse<void>> {
    const response = await apiClient.post(`/users/${userId}/reputation`, { factors });
    return response.data;
  }

  // Loan endpoints
  async createLoan(loanData: Partial<Loan>): Promise<APIResponse<Loan>> {
    const response = await apiClient.post('/loans', loanData);
    return response.data;
  }

  async getLoans(params?: {
    page?: number;
    limit?: number;
    status?: string;
    borrowerId?: string;
    lenderId?: string;
    minAmount?: number;
    maxAmount?: number;
    minInterestRate?: number;
    maxInterestRate?: number;
    purpose?: string;
  }): Promise<APIResponse<PaginatedResponse<Loan>>> {
    const response = await apiClient.get('/loans', { params });
    return response.data;
  }

  async getLoanById(loanId: string): Promise<APIResponse<Loan>> {
    const response = await apiClient.get(`/loans/${loanId}`);
    return response.data;
  }

  async updateLoan(loanId: string, loanData: Partial<Loan>): Promise<APIResponse<Loan>> {
    const response = await apiClient.put(`/loans/${loanId}`, loanData);
    return response.data;
  }

  async fundLoan(loanId: string, transactionHash: string): Promise<APIResponse<Loan>> {
    const response = await apiClient.post(`/loans/${loanId}/fund`, {
      transactionHash,
    });
    return response.data;
  }

  async repayLoan(loanId: string, transactionHash: string): Promise<APIResponse<Loan>> {
    const response = await apiClient.post(`/loans/${loanId}/repay`, {
      transactionHash,
    });
    return response.data;
  }

  async cancelLoan(loanId: string): Promise<APIResponse<Loan>> {
    const response = await apiClient.post(`/loans/${loanId}/cancel`);
    return response.data;
  }

  async getLoanRiskAssessment(loanId: string): Promise<APIResponse<any>> {
    const response = await apiClient.get(`/loans/${loanId}/risk-assessment`);
    return response.data;
  }

  // Transaction endpoints
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    userId?: string;
    type?: string;
    status?: string;
  }): Promise<APIResponse<PaginatedResponse<Transaction>>> {
    const response = await apiClient.get('/transactions', { params });
    return response.data;
  }

  async getTransactionById(transactionId: string): Promise<APIResponse<Transaction>> {
    const response = await apiClient.get(`/transactions/${transactionId}`);
    return response.data;
  }

  async createTransaction(transactionData: Partial<Transaction>): Promise<APIResponse<Transaction>> {
    const response = await apiClient.post('/transactions', transactionData);
    return response.data;
  }

  // Review endpoints
  async createReview(reviewData: Partial<Review>): Promise<APIResponse<Review>> {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  }

  async getReviews(params?: {
    page?: number;
    limit?: number;
    loanId?: string;
    reviewerId?: string;
    revieweeId?: string;
  }): Promise<APIResponse<PaginatedResponse<Review>>> {
    const response = await apiClient.get('/reviews', { params });
    return response.data;
  }

  async updateReview(reviewId: string, reviewData: Partial<Review>): Promise<APIResponse<Review>> {
    const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  }

  async deleteReview(reviewId: string): Promise<APIResponse<void>> {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  }

  // Dispute endpoints
  async createDispute(disputeData: Partial<Dispute>): Promise<APIResponse<Dispute>> {
    const response = await apiClient.post('/disputes', disputeData);
    return response.data;
  }

  async getDisputes(params?: {
    page?: number;
    limit?: number;
    loanId?: string;
    initiatorId?: string;
    respondentId?: string;
    status?: string;
  }): Promise<APIResponse<PaginatedResponse<Dispute>>> {
    const response = await apiClient.get('/disputes', { params });
    return response.data;
  }

  async getDisputeById(disputeId: string): Promise<APIResponse<Dispute>> {
    const response = await apiClient.get(`/disputes/${disputeId}`);
    return response.data;
  }

  async updateDispute(disputeId: string, disputeData: Partial<Dispute>): Promise<APIResponse<Dispute>> {
    const response = await apiClient.put(`/disputes/${disputeId}`, disputeData);
    return response.data;
  }

  async resolveDispute(disputeId: string, resolution: any): Promise<APIResponse<Dispute>> {
    const response = await apiClient.post(`/disputes/${disputeId}/resolve`, resolution);
    return response.data;
  }

  // KYC endpoints
  async uploadKYCDocument(documentData: FormData): Promise<APIResponse<KYCDocument>> {
    const response = await apiClient.post('/kyc/documents', documentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getKYCDocuments(userId: string): Promise<APIResponse<KYCDocument[]>> {
    const response = await apiClient.get(`/kyc/users/${userId}/documents`);
    return response.data;
  }

  async updateKYCDocumentStatus(documentId: string, status: string, reason?: string): Promise<APIResponse<KYCDocument>> {
    const response = await apiClient.put(`/kyc/documents/${documentId}/status`, {
      status,
      reason,
    });
    return response.data;
  }

  // Platform metrics
  async getPlatformMetrics(): Promise<APIResponse<PlatformMetrics>> {
    try {
      const response = await apiClient.get('/platform/metrics');
      return response.data;
    } catch (error) {
      // Return mock data when backend is unavailable
      console.warn('Backend unavailable, using mock metrics data');
      return {
        success: true,
        data: MOCK_METRICS,
        message: 'Using mock data - backend unavailable'
      };
    }
  }

  async getMarketData(): Promise<APIResponse<any>> {
    const response = await apiClient.get('/platform/market-data');
    return response.data;
  }

  async getRiskAnalysis(loanId: string): Promise<APIResponse<any>> {
    const response = await apiClient.get(`/platform/risk-analysis/${loanId}`);
    return response.data;
  }

  // AI and analytics endpoints
  async getAIAnalysis(data: any): Promise<APIResponse<any>> {
    const response = await apiClient.post('/ai/analyze', data);
    return response.data;
  }

  async getBlockchainAnalysis(address: string): Promise<APIResponse<any>> {
    const response = await apiClient.get(`/blockchain/analyze/${address}`);
    return response.data;
  }

  async getNewsSentiment(query: string): Promise<APIResponse<any>> {
    const response = await apiClient.get('/news/sentiment', { params: { query } });
    return response.data;
  }

  // Notification endpoints
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    read?: boolean;
  }): Promise<APIResponse<PaginatedResponse<any>>> {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  }

  async markNotificationAsRead(notificationId: string): Promise<APIResponse<void>> {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  }

  async markAllNotificationsAsRead(): Promise<APIResponse<void>> {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  }

  // File upload endpoints
  async uploadFile(file: File, type: string): Promise<APIResponse<{ url: string; id: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // WebSocket connection for real-time updates
  connectWebSocket(): WebSocket {
    const wsUrl = import.meta.env.VITE_WS_URL || 'wss://api.p3lending.com/ws';
    const token = localStorage.getItem('auth_token');
    const ws = new WebSocket(`${wsUrl}?token=${token}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return ws;
  }

  // Utility methods
  async healthCheck(): Promise<APIResponse<{ status: string; timestamp: string }>> {
    const response = await apiClient.get('/health');
    return response.data;
  }

  async getVersion(): Promise<APIResponse<{ version: string; build: string }>> {
    const response = await apiClient.get('/version');
    return response.data;
  }
}

// Create singleton instance
export const apiService = new APIService();

// Export types for use in components
export type { APIResponse, PaginatedResponse };

// Error handling utilities
export const handleAPIError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.response?.data?.error) {
    return error.response.data.error;
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unexpected error occurred';
  }
};

export const isAPIError = (error: any): error is { response: { data: { message: string } } } => {
  return error.response?.data?.message !== undefined;
};
