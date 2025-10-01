import { web3Service } from './web3';
import { apiService } from './api';
import { User, WalletConnection } from '@/types';

// OAuth providers
export interface OAuthProvider {
  name: string;
  clientId: string;
  redirectUri: string;
  scope: string;
}

// Stripe configuration
export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
}

// Plaid configuration
export interface PlaidConfig {
  clientId: string;
  secret: string;
  environment: 'sandbox' | 'development' | 'production';
  products: string[];
  countryCodes: string[];
}

// Authentication service class
export class AuthService {
  private currentUser: User | null = null;
  private walletConnection: WalletConnection | null = null;
  private oauthProviders: Map<string, OAuthProvider> = new Map();
  private stripeConfig: StripeConfig | null = null;
  private plaidConfig: PlaidConfig | null = null;

  constructor() {
    this.initializeProviders();
    this.loadStoredAuth();
  }

  private initializeProviders() {
    // Initialize OAuth providers
    this.oauthProviders.set('google', {
      name: 'Google',
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/auth/callback/google`,
      scope: 'openid email profile'
    });

    this.oauthProviders.set('github', {
      name: 'GitHub',
      clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/auth/callback/github`,
      scope: 'user:email'
    });

    this.oauthProviders.set('discord', {
      name: 'Discord',
      clientId: import.meta.env.VITE_DISCORD_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/auth/callback/discord`,
      scope: 'identify email'
    });

    // Initialize Stripe
    this.stripeConfig = {
      publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
      secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || ''
    };

    // Initialize Plaid
    this.plaidConfig = {
      clientId: import.meta.env.VITE_PLAID_CLIENT_ID || '',
      secret: import.meta.env.VITE_PLAID_SECRET || '',
      environment: (import.meta.env.VITE_PLAID_ENVIRONMENT as any) || 'sandbox',
      products: ['transactions', 'auth', 'identity'],
      countryCodes: ['US', 'CA']
    };
  }

  private loadStoredAuth() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        this.currentUser = JSON.parse(userData);
        // Verify token is still valid
        this.verifyToken();
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        this.clearAuth();
      }
    }
  }

  // Wallet authentication
  async connectWallet(): Promise<{ user: User; wallet: WalletConnection }> {
    try {
      // Connect to wallet
      this.walletConnection = await web3Service.connectWallet();
      
      // Get or create user
      const user = await this.getOrCreateUser(this.walletConnection.address);
      
      // Sign message for authentication
      const message = `Sign this message to authenticate with P³ Lending Platform.\n\nWallet: ${this.walletConnection.address}\nTimestamp: ${Date.now()}`;
      const signature = await web3Service.signMessage(message);
      
      // Authenticate with backend
      const response = await apiService.login(this.walletConnection.address, signature);
      
      if (response.success && response.data) {
        this.currentUser = response.data.user;
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        return { user: response.data.user, wallet: this.walletConnection };
      } else {
        throw new Error(response.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Wallet authentication failed:', error);
      throw error;
    }
  }

  // OAuth authentication
  async authenticateWithOAuth(provider: string): Promise<{ user: User; token: string }> {
    const oauthProvider = this.oauthProviders.get(provider);
    if (!oauthProvider) {
      throw new Error(`OAuth provider ${provider} not configured`);
    }

    // Redirect to OAuth provider
    const authUrl = this.buildOAuthUrl(oauthProvider);
    window.location.href = authUrl;
    
    // This will be handled by the callback
    return new Promise((resolve, reject) => {
      // Store the promise resolvers to be called by the callback
      (window as any).oauthCallback = { resolve, reject };
    });
  }

  // Handle OAuth callback
  async handleOAuthCallback(provider: string, code: string, state?: string): Promise<{ user: User; token: string }> {
    try {
      const response = await apiService.login(provider, code);
      
      if (response.success && response.data) {
        this.currentUser = response.data.user;
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        return { user: response.data.user, token: response.data.token };
      } else {
        throw new Error(response.error || 'OAuth authentication failed');
      }
    } catch (error) {
      console.error('OAuth callback failed:', error);
      throw error;
    }
  }

  // Email/password authentication
  async authenticateWithEmail(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        this.currentUser = response.data.user;
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        return { user: response.data.user, token: response.data.token };
      } else {
        throw new Error(response.error || 'Email authentication failed');
      }
    } catch (error) {
      console.error('Email authentication failed:', error);
      throw error;
    }
  }

  // Register new user
  async register(userData: Partial<User>): Promise<{ user: User; token: string }> {
    try {
      const response = await apiService.register(userData);
      
      if (response.success && response.data) {
        this.currentUser = response.data;
        
        // Generate token for new user
        const tokenResponse = await apiService.login(
          userData.walletAddress || userData.email || '',
          'new_user'
        );
        
        if (tokenResponse.success && tokenResponse.data) {
          localStorage.setItem('auth_token', tokenResponse.data.token);
          localStorage.setItem('user_data', JSON.stringify(response.data));
          
          return { user: response.data, token: tokenResponse.data.token };
        }
      }
      
      throw new Error(response.error || 'Registration failed');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // Get or create user by wallet address
  private async getOrCreateUser(walletAddress: string): Promise<User> {
    try {
      // Try to get existing user
      const response = await apiService.getUserById(walletAddress);
      if (response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      // User doesn't exist, create new one
      const newUser = await apiService.register({
        walletAddress,
        reputationScore: 100,
        kycStatus: 'not_started' as any,
        profile: {
          firstName: '',
          lastName: '',
          country: '',
          preferences: {
            notifications: {
              email: true,
              push: true,
              sms: false,
              loanUpdates: true,
              reputationChanges: true,
              marketAlerts: true
            },
            privacy: {
              profileVisibility: 'public' as any,
              transactionHistory: 'private' as any,
              reputationScore: 'public' as any
            },
            language: 'en',
            currency: 'BTC',
            theme: 'dark' as any
          }
        },
        isActive: true,
        totalLent: 0,
        totalBorrowed: 0,
        successfulLoans: 0,
        defaultedLoans: 0,
        averageRepaymentTime: 0,
        riskLevel: 'medium' as any,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      if (newUser.success && newUser.data) {
        return newUser.data;
      }
    }
    
    throw new Error('Failed to get or create user');
  }

  // Verify authentication token
  async verifyToken(): Promise<boolean> {
    try {
      const response = await apiService.getCurrentUser();
      if (response.success && response.data) {
        this.currentUser = response.data;
        return true;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      this.clearAuth();
    }
    return false;
  }

  // Refresh authentication token
  async refreshToken(): Promise<string | null> {
    try {
      const response = await apiService.refreshToken();
      if (response.success && response.data) {
        localStorage.setItem('auth_token', response.data.token);
        return response.data.token;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuth();
    }
    return null;
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      this.clearAuth();
    }
  }

  // Clear authentication data
  private clearAuth(): void {
    this.currentUser = null;
    this.walletConnection = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Get wallet connection
  getWalletConnection(): WalletConnection | null {
    return this.walletConnection;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null && localStorage.getItem('auth_token') !== null;
  }

  // Check if user has wallet connected
  isWalletConnected(): boolean {
    return this.walletConnection?.isConnected || false;
  }

  // Build OAuth URL
  private buildOAuthUrl(provider: OAuthProvider): string {
    const params = new URLSearchParams({
      client_id: provider.clientId,
      redirect_uri: provider.redirectUri,
      scope: provider.scope,
      response_type: 'code',
      state: this.generateState()
    });

    const baseUrls = {
      google: 'https://accounts.google.com/o/oauth2/v2/auth',
      github: 'https://github.com/login/oauth/authorize',
      discord: 'https://discord.com/api/oauth2/authorize'
    };

    const baseUrl = baseUrls[provider.name.toLowerCase() as keyof typeof baseUrls];
    return `${baseUrl}?${params.toString()}`;
  }

  // Generate OAuth state parameter
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Stripe integration
  async createStripePaymentIntent(amount: number, currency: string = 'usd'): Promise<{ clientSecret: string }> {
    try {
      const response = await apiService.createTransaction({
        type: 'platform_fee' as any,
        fromAddress: this.currentUser?.walletAddress || '',
        toAddress: '',
        amount,
        currency: currency.toUpperCase() as any,
        status: 'pending' as any,
        createdAt: new Date()
      });

      if (response.success && response.data) {
        // Create Stripe payment intent
        const stripeResponse = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({
            amount: amount * 100, // Convert to cents
            currency,
            transactionId: response.data.id
          })
        });

        const stripeData = await stripeResponse.json();
        return { clientSecret: stripeData.client_secret };
      }
      
      throw new Error('Failed to create payment intent');
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      throw error;
    }
  }

  // Plaid integration
  async createPlaidLinkToken(): Promise<{ linkToken: string }> {
    try {
      const response = await fetch('/api/plaid/create-link-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          userId: this.currentUser?.id,
          products: this.plaidConfig?.products || ['transactions']
        })
      });

      const data = await response.json();
      return { linkToken: data.link_token };
    } catch (error) {
      console.error('Plaid link token creation failed:', error);
      throw error;
    }
  }

  // Exchange Plaid public token
  async exchangePlaidToken(publicToken: string): Promise<{ accessToken: string }> {
    try {
      const response = await fetch('/api/plaid/exchange-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          publicToken,
          userId: this.currentUser?.id
        })
      });

      const data = await response.json();
      return { accessToken: data.access_token };
    } catch (error) {
      console.error('Plaid token exchange failed:', error);
      throw error;
    }
  }

  // Get Plaid accounts
  async getPlaidAccounts(): Promise<any[]> {
    try {
      const response = await fetch('/api/plaid/accounts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const data = await response.json();
      return data.accounts || [];
    } catch (error) {
      console.error('Failed to get Plaid accounts:', error);
      throw error;
    }
  }

  // Get Plaid transactions
  async getPlaidTransactions(accountId: string, startDate: string, endDate: string): Promise<any[]> {
    try {
      const response = await fetch('/api/plaid/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          accountId,
          startDate,
          endDate
        })
      });

      const data = await response.json();
      return data.transactions || [];
    } catch (error) {
      console.error('Failed to get Plaid transactions:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(profileData: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await apiService.updateUser(this.currentUser.id, profileData);
      if (response.success && response.data) {
        this.currentUser = response.data;
        localStorage.setItem('user_data', JSON.stringify(response.data));
        return response.data;
      }
      throw new Error(response.error || 'Profile update failed');
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (!response.ok) {
        throw new Error('Password change failed');
      }
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  }

  // Enable two-factor authentication
  async enable2FA(): Promise<{ qrCode: string; secret: string }> {
    try {
      const response = await fetch('/api/auth/enable-2fa', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const data = await response.json();
      return { qrCode: data.qr_code, secret: data.secret };
    } catch (error) {
      console.error('2FA enable failed:', error);
      throw error;
    }
  }

  // Verify 2FA token
  async verify2FA(token: string): Promise<void> {
    try {
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error('2FA verification failed');
      }
    } catch (error) {
      console.error('2FA verification failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const authService = new AuthService();

// Export types
export type { OAuthProvider, StripeConfig, PlaidConfig };
