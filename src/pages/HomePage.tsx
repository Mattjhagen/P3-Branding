import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  TrendingUp, 
  Users, 
  DollarSign,
  CheckCircle,
  Star,
  Bitcoin,
  Lock,
  Eye
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/services/api';
import { PlatformMetrics } from '@/types';

const HomePage: React.FC = () => {
  // Cache bust: Apple redesign v2.0 - Force deployment
  const { isAuthenticated } = useAuthStore();
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlatformMetrics();
  }, []);

  const loadPlatformMetrics = async () => {
    try {
      const response = await apiService.getPlatformMetrics();
      if (response.success && response.data) {
        setMetrics(response.data);
      }
    } catch (error) {
      console.error('Failed to load platform metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'All transactions are immutably recorded on the blockchain, ensuring complete transparency and security for every loan.',
      color: 'text-blue-400'
    },
    {
      icon: Star,
      title: 'Reputation System',
      description: 'Build your on-chain reputation through successful transactions. Higher reputation unlocks better rates and larger loans.',
      color: 'text-yellow-400'
    },
    {
      icon: Lock,
      title: 'Smart Contracts',
      description: 'Automated loan agreements eliminate intermediaries, reducing costs and ensuring trustless execution of terms.',
      color: 'text-green-400'
    },
    {
      icon: Bitcoin,
      title: 'Bitcoin Native',
      description: 'All loans denominated in Bitcoin for global accessibility, liquidity, and borderless transactions.',
      color: 'text-orange-400'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Participate from anywhere in the world. No geographic restrictions or traditional banking requirements.',
      color: 'text-purple-400'
    },
    {
      icon: Eye,
      title: 'Transparent Analytics',
      description: 'Real-time dashboards showing platform metrics, loan performance, and market dynamics.',
      color: 'text-cyan-400'
    }
  ];

  const stats = [
    {
      label: 'Total Value Locked',
      value: metrics ? `$${(metrics.totalValueLocked / 1000000).toFixed(1)}M` : '$24.5M',
      icon: DollarSign
    },
    {
      label: 'Active Users',
      value: metrics ? metrics.totalUsers.toLocaleString() : '12,847',
      icon: Users
    },
    {
      label: 'Repayment Rate',
      value: metrics ? `${(100 - metrics.defaultRate).toFixed(1)}%` : '98.7%',
      icon: TrendingUp
    },
    {
      label: 'Average APY',
      value: metrics ? `${metrics.averageInterestRate.toFixed(1)}%` : '5.2%',
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Hero Section - Apple-inspired minimalism */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-8xl font-light mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                P³ Lending
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              The future of finance is{' '}
              <span className="text-white font-medium">decentralized</span>,{' '}
              <span className="text-white font-medium">transparent</span>, and{' '}
              <span className="text-white font-medium">accessible</span> to everyone
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-full font-medium text-lg transition-all duration-200 hover:bg-gray-100 hover:scale-105 hover:shadow-xl"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-full font-medium text-lg transition-all duration-200 hover:bg-gray-100 hover:scale-105 hover:shadow-xl"
                  >
                    <span>Start Lending</span>
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 border border-gray-600 text-white rounded-full font-medium text-lg transition-all duration-200 hover:border-gray-500 hover:bg-gray-800/50"
                  >
                    Request a Loan
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Coinbase/Robinhood inspired */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                      <Icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="text-3xl font-semibold text-gray-900 mb-1">
                      {isLoading ? (
                        <div className="animate-pulse bg-gray-300 h-8 w-20 rounded mx-auto"></div>
                      ) : (
                        stat.value
                      )}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Apple-inspired */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Built for the future
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              Every feature designed with precision, every interaction crafted for perfection
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white rounded-3xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors">
                      <Icon className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-light">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Apple-inspired */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
              Ready to begin?
            </h2>
            <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
              Join thousands of users who are already building the future of finance
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-full font-medium text-lg transition-all duration-200 hover:bg-gray-100 hover:scale-105 hover:shadow-xl"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 border border-gray-600 text-white rounded-full font-medium text-lg transition-all duration-200 hover:border-gray-500 hover:bg-gray-800/50"
                >
                  Sign In
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators - Minimalist */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-gray-900 font-medium">Fully Audited</span>
                <span className="text-gray-600 text-sm">Smart Contracts</span>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-gray-900 font-medium">Bank-Grade</span>
                <span className="text-gray-600 text-sm">Security</span>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-gray-900 font-medium">Global</span>
                <span className="text-gray-600 text-sm">Accessibility</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
