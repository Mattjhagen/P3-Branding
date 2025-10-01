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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Steve Jobs Era Minimalism */}
      <section className="relative bg-white">
        <div className="max-w-4xl mx-auto px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center"
          >
            <h1 className="text-7xl md:text-9xl font-thin mb-8 tracking-tighter text-gray-900">
              P³ Lending
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
              The future of finance is{' '}
              <span className="text-gray-900 font-normal">decentralized</span>,{' '}
              <span className="text-gray-900 font-normal">transparent</span>, and{' '}
              <span className="text-gray-900 font-normal">accessible</span> to everyone
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-12 py-4 bg-gray-900 text-white rounded-none font-light text-lg transition-all duration-300 hover:bg-gray-800 hover:scale-105"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-5 w-5 ml-3" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-12 py-4 bg-gray-900 text-white rounded-none font-light text-lg transition-all duration-300 hover:bg-gray-800 hover:scale-105"
                  >
                    <span>Start Lending</span>
                    <ArrowRight className="h-5 w-5 ml-3" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-12 py-4 border-2 border-gray-900 text-gray-900 rounded-none font-light text-lg transition-all duration-300 hover:bg-gray-900 hover:text-white"
                  >
                    Request a Loan
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Steve Jobs Era Clean */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-5xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mb-6">
                    <Icon className="h-8 w-8 mx-auto text-gray-400" />
                  </div>
                  <div className="text-4xl font-thin text-gray-900 mb-2 tracking-tight">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-300 h-10 w-24 rounded mx-auto"></div>
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-sm text-gray-500 font-light tracking-wide uppercase">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Steve Jobs Era Elegance */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-6xl font-thin text-gray-900 mb-8 tracking-tight">
              Built for the future
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              Every feature designed with precision, every interaction crafted for perfection
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mb-8">
                    <Icon className="h-12 w-12 mx-auto text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-light text-lg">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Steve Jobs Era Bold */}
      <section className="py-32 bg-gray-900">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-thin text-white mb-8 tracking-tight">
              Ready to begin?
            </h2>
            <p className="text-xl text-gray-300 mb-16 font-light leading-relaxed max-w-2xl mx-auto">
              Join thousands of users who are already building the future of finance
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-12 py-4 bg-white text-gray-900 rounded-none font-light text-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5 ml-3" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-12 py-4 border-2 border-white text-white rounded-none font-light text-lg transition-all duration-300 hover:bg-white hover:text-gray-900"
                >
                  Request a Loan
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators - Steve Jobs Era Minimal */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-8 w-8 text-gray-400" />
                <span className="text-gray-900 font-light text-lg">Fully Audited</span>
                <span className="text-gray-500 text-sm font-light tracking-wide uppercase">Smart Contracts</span>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <Shield className="h-8 w-8 text-gray-400" />
                <span className="text-gray-900 font-light text-lg">Bank-Grade</span>
                <span className="text-gray-500 text-sm font-light tracking-wide uppercase">Security</span>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <Globe className="h-8 w-8 text-gray-400" />
                <span className="text-gray-900 font-light text-lg">Global</span>
                <span className="text-gray-500 text-sm font-light tracking-wide uppercase">Accessibility</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
