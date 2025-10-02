import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { authService } from '@/services/auth';
import { web3Service } from '@/services/web3';
import { ReownWeb3Provider } from '@/components/ReownWeb3Provider';

// Layout components
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Page components
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import LendingPage from '@/pages/LendingPage';
import BorrowingPage from '@/pages/BorrowingPage';
import ReputationPage from '@/pages/ReputationPage';
import KYCPage from '@/pages/KYCPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPage from '@/pages/AdminPage';
import OAuthCallback from '@/pages/OAuthCallback';
import HelpPage from '@/pages/HelpPage';
import ContactPage from '@/pages/ContactPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import SmartWalletPage from '@/pages/SmartWalletPage';
import SlackWebhookPage from '@/pages/SlackWebhookPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Loading component
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const App: React.FC = () => {
  const { isAuthenticated, user, setUser, setAuthenticated } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Load saved theme
      const savedTheme = localStorage.getItem('p3-theme-mode') || 'light';
      setTheme(savedTheme as 'light' | 'dark');

      // Check authentication
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setAuthenticated(true);
        } else {
          // Verify token
          const isValid = await authService.verifyToken();
          if (isValid) {
            const user = authService.getCurrentUser();
            if (user) {
              setUser(user);
              setAuthenticated(true);
            }
          }
        }
      }

      // Initialize Web3
      if (web3Service.isWalletConnected()) {
        const walletConnection = web3Service.getWalletConnection();
        if (walletConnection) {
          // Update wallet connection state
        }
      }

      // Set up Web3 event listeners
      web3Service.onAccountsChanged((accounts) => {
        if (accounts.length === 0) {
          // User disconnected wallet
          authService.logout();
          setUser(null);
          setAuthenticated(false);
        } else {
          // User switched accounts
          const newAddress = accounts[0];
          if (user?.walletAddress !== newAddress) {
            // Handle account switch
            handleAccountSwitch(newAddress);
          }
        }
      });

      web3Service.onChainChanged((chainId) => {
        // Handle chain change
        console.log('Chain changed to:', chainId);
      });

    } catch (error) {
      console.error('App initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountSwitch = async (newAddress: string) => {
    try {
      // Try to get user with new address
      const newUser = await authService.getOrCreateUser(newAddress);
      if (newUser) {
        setUser(newUser);
        setAuthenticated(true);
      }
    } catch (error) {
      console.error('Account switch failed:', error);
      // Fallback to logout
      authService.logout();
      setUser(null);
      setAuthenticated(false);
    }
  };

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('p3-theme-mode', theme);
  }, [theme]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400">Initializing P³ Lending Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <ReownWeb3Provider>
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-white'
      }`}>
        <AnimatePresence mode="wait">
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
          } />

          {/* OAuth callback routes */}
          <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
          <Route path="/auth/callback/google" element={<OAuthCallback />} />
          <Route path="/auth/callback/github" element={<OAuthCallback />} />
          <Route path="/auth/callback/discord" element={<OAuthCallback />} />

          {/* Slack webhook route */}
          <Route path="/slack/webhook" element={<SlackWebhookPage />} />

          {/* Public support pages */}
          <Route path="/help" element={<HelpPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/smart-wallet" element={<SmartWalletPage />} />
          
          {/* Static HTML files */}
          <Route path="/terms-of-service.html" element={<Navigate to="/terms-of-service.html" replace />} />
          <Route path="/privacy-policy.html" element={<Navigate to="/privacy-policy.html" replace />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/lend" element={
            <ProtectedRoute>
              <Layout>
                <LendingPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/borrow" element={
            <ProtectedRoute>
              <Layout>
                <BorrowingPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/reputation" element={
            <ProtectedRoute>
              <Layout>
                <ReputationPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/kyc" element={
            <ProtectedRoute>
              <Layout>
                <KYCPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <AdminPage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </ReownWeb3Provider>
  );
};

export default App;
