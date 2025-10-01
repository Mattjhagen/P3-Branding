import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth';
import toast from 'react-hot-toast';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { provider } = useParams<{ provider: string }>();
  const { login } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    handleOAuthCallback();
  }, [provider]);

  const handleOAuthCallback = async () => {
    if (!provider) {
      setStatus('error');
      setMessage('Invalid OAuth provider');
      return;
    }

    try {
      // Get the authorization code from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        throw new Error(`OAuth error: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      // Mock OAuth success for demo purposes
      // In production, this would exchange code for token via backend
      const mockUser = {
        id: `oauth_${provider}_${Date.now()}`,
        firstName: 'Demo',
        lastName: 'User',
        email: `demo@${provider}.com`,
        walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        reputationScore: 750,
        kycStatus: 'verified' as any,
        isActive: true,
        totalLent: 5,
        totalBorrowed: 2,
        successfulLoans: 8,
        defaultedLoans: 0,
        averageRepaymentTime: 7,
        riskLevel: 'low' as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profile: {
          firstName: 'Demo',
          lastName: 'User',
          country: 'United States',
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
        }
      };
      
      // Login the user with mock data
      login(mockUser, { 
        address: mockUser.walletAddress, 
        chainId: 1, 
        isConnected: true, 
        provider: null 
      });

      setStatus('success');
      setMessage('Successfully authenticated!');
      toast.success(`Welcome back, ${mockUser.profile?.firstName || 'User'}!`);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('OAuth callback error:', error);
      setStatus('error');
      setMessage(error.message || 'Authentication failed');
      toast.error('Authentication failed. Please try again.');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  const getProviderName = () => {
    switch (provider) {
      case 'google': return 'Google';
      case 'github': return 'GitHub';
      case 'discord': return 'Discord';
      default: return 'OAuth Provider';
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-8">
            <img 
              src="/logo-simple.svg" 
              alt="P³ Lending" 
              className="h-16 w-16"
            />
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-xl">
            {status === 'loading' && (
              <div className="text-center">
                <Loader2 className="h-12 w-12 mx-auto text-blue-500 animate-spin mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Authenticating with {getProviderName()}
                </h2>
                <p className="text-gray-600">
                  Please wait while we complete your authentication...
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Authentication Successful!
                </h2>
                <p className="text-gray-600 mb-4">
                  {message}
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting to dashboard...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <XCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Authentication Failed
                </h2>
                <p className="text-gray-600 mb-4">
                  {message}
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting to login page...
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OAuthCallback;
