import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Shield, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Activity,
  PieChart,
  BarChart3,
  Wallet,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Bell,
  Zap,
  Target,
  Star
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLoanStore } from '@/store/loanStore';
import { apiService } from '@/services/api';
import { Loan, PlatformMetrics } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { loans, userLoans, activeLoans, setLoans, setUserLoans, setActiveLoans } = useLoanStore();
  
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBalances, setShowBalances] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [walletBalance, setWalletBalance] = useState(2.45);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load platform metrics
      const metricsResponse = await apiService.getPlatformMetrics();
      if (metricsResponse.success && metricsResponse.data) {
        setMetrics(metricsResponse.data);
      }

      // Load user loans
      const loansResponse = await apiService.getLoans({ 
        borrowerId: user?.id,
        limit: 10 
      });
      if (loansResponse.success && loansResponse.data) {
        setUserLoans(loansResponse.data.data);
      }

      // Load active loans for lending
      const activeLoansResponse = await apiService.getLoans({ 
        status: 'active',
        limit: 10 
      });
      if (activeLoansResponse.success && activeLoansResponse.data) {
        setActiveLoans(activeLoansResponse.data.data);
      }

      // Load recent transactions (mock data for demo)
      setRecentTransactions([
        {
          id: '1',
          type: 'loan_payment',
          amount: 0.1,
          status: 'completed',
          timestamp: new Date(Date.now() - 3600000),
          description: 'Loan payment received'
        },
        {
          id: '2',
          type: 'loan_funded',
          amount: 0.5,
          status: 'completed',
          timestamp: new Date(Date.now() - 7200000),
          description: 'Funded loan request'
        },
        {
          id: '3',
          type: 'interest_earned',
          amount: 0.025,
          status: 'completed',
          timestamp: new Date(Date.now() - 86400000),
          description: 'Interest earned'
        }
      ]);

      // Load notifications (mock data for demo)
      setNotifications([
        {
          id: '1',
          type: 'loan_approved',
          title: 'Loan Approved',
          message: 'Your loan request for 0.5 BTC has been approved',
          timestamp: new Date(Date.now() - 1800000),
          read: false
        },
        {
          id: '2',
          type: 'payment_due',
          title: 'Payment Due',
          message: 'Payment of 0.1 BTC is due in 2 days',
          timestamp: new Date(Date.now() - 3600000),
          read: false
        },
        {
          id: '3',
          type: 'reputation_update',
          title: 'Reputation Updated',
          message: 'Your reputation score increased by 5 points',
          timestamp: new Date(Date.now() - 86400000),
          read: true
        }
      ]);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'lend':
        window.location.href = '/lend';
        break;
      case 'borrow':
        window.location.href = '/borrow';
        break;
      case 'wallet':
        window.location.href = '/smart-wallet';
        break;
      case 'kyc':
        window.location.href = '/kyc';
        break;
      default:
        break;
    }
  };

  const portfolioStats = [
    {
      label: 'Total Portfolio Value',
      value: showBalances ? '$12,450.32' : '••••••',
      change: '+2.4%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      label: 'Active Loans',
      value: userLoans.filter(loan => loan.status === 'active').length.toString(),
      change: '+1',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-blue-400'
    },
    {
      label: 'Reputation Score',
      value: user?.reputationScore.toString() || '0',
      change: '+5',
      changeType: 'positive' as const,
      icon: Shield,
      color: 'text-purple-400'
    },
    {
      label: 'Total Earned',
      value: showBalances ? '$1,234.56' : '••••••',
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-yellow-400'
    }
  ];

  const quickActions = [
    {
      title: 'Start Lending',
      description: 'Fund loans and earn interest',
      icon: TrendingUp,
      color: 'bg-green-500',
      action: () => handleQuickAction('lend')
    },
    {
      title: 'Request Loan',
      description: 'Borrow Bitcoin with competitive rates',
      icon: CreditCard,
      color: 'bg-pink-500',
      action: () => handleQuickAction('borrow')
    },
    {
      title: 'Smart Wallet',
      description: 'Manage your Bitcoin wallet',
      icon: Wallet,
      color: 'bg-blue-500',
      action: () => handleQuickAction('wallet')
    },
    {
      title: 'Complete KYC',
      description: 'Verify your identity',
      icon: Shield,
      color: 'bg-purple-500',
      action: () => handleQuickAction('kyc')
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.profile?.firstName || 'User'}!
            </h1>
            <p className="text-gray-300 mt-1">
              Here's what's happening with your portfolio today
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/10 group"
            >
              {showBalances ? (
                <EyeOff className="h-5 w-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
              )}
            </button>
            
            <div className="flex bg-gray-800/50 rounded-lg p-1">
              {['24h', '7d', '30d', '1y'].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                    selectedTimeframe === timeframe
                      ? 'bg-gradient-to-r from-pink-500/20 to-green-500/20 text-white border border-pink-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10 group disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 text-gray-400 group-hover:text-green-400 transition-colors ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* Portfolio Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {portfolioStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color.replace('text-', 'bg-').replace('-400', '-500/20')}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.title}
                onClick={action.action}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-left hover:border-gray-700 transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/5 group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </motion.button>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
                <button className="text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'loan_payment' ? 'bg-green-500/20' :
                        transaction.type === 'loan_funded' ? 'bg-blue-500/20' :
                        'bg-yellow-500/20'
                      }`}>
                        {transaction.type === 'loan_payment' ? (
                          <ArrowDownRight className="h-5 w-5 text-green-400" />
                        ) : transaction.type === 'loan_funded' ? (
                          <ArrowUpRight className="h-5 w-5 text-blue-400" />
                        ) : (
                          <Star className="h-5 w-5 text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.description}</p>
                        <p className="text-gray-400 text-sm">
                          {transaction.timestamp.toLocaleDateString()} at {transaction.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">
                        {transaction.amount} BTC
                      </p>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 text-sm">Completed</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Notifications</h2>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                    {notifications.filter(n => !n.read).length}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      notification.read 
                        ? 'bg-gray-800/30 border-gray-800' 
                        : 'bg-pink-500/10 border-pink-500/30'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.read ? 'bg-gray-600' : 'bg-pink-400'
                      }`} />
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                        <p className="text-gray-400 text-xs mt-1">{notification.message}</p>
                        <p className="text-gray-500 text-xs mt-2">
                          {notification.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Active Loans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Active Loans</h2>
              <button className="text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userLoans.filter(loan => loan.status === 'active').length > 0 ? (
                userLoans.filter(loan => loan.status === 'active').map((loan) => (
                  <div
                    key={loan.id}
                    className="p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium">{loan.amount} BTC</span>
                      <span className="text-green-400 text-sm font-medium">{loan.interestRate}% APY</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Status</span>
                        <span className="text-green-400">Active</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Due Date</span>
                        <span className="text-white">{new Date(loan.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">75%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-2">No Active Loans</h3>
                  <p className="text-gray-400 text-sm mb-4">Start by requesting a loan or funding others</p>
                  <button
                    onClick={() => handleQuickAction('borrow')}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Request Loan
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;