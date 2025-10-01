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
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-accent-900/20">
          <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center opacity-10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">P³ Lending</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Revolutionizing finance through{' '}
              <span className="text-blue-400 font-semibold">blockchain technology</span>,{' '}
              <span className="text-orange-400 font-semibold">Bitcoin</span>, and{' '}
              <span className="text-cyan-400 font-semibold">trust-based reputation</span> systems
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn btn-primary btn-lg flex items-center justify-center space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-lg flex items-center justify-center space-x-2"
                  >
                    <span>Start Lending</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-outline btn-lg"
                  >
                    Request a Loan
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
                  <div className="card card-hover h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/10 mb-4 group-hover:bg-primary-500/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                      {isLoading ? (
                        <div className="animate-pulse bg-gray-700 h-8 w-20 rounded"></div>
                      ) : (
                        stat.value
                      )}
                    </div>
                    <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Platform Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of decentralized finance with our comprehensive suite of features
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
                  <div className="card card-hover h-full flex flex-col">
                    <div className={`h-16 w-16 rounded-xl bg-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 group-hover:text-primary-300 transition-colors">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed flex-grow">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900/20 to-accent-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Join the Future?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start your journey with P³ Lending today and experience the power of decentralized finance
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="btn btn-primary btn-xl flex items-center justify-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline btn-xl"
                >
                  Sign In
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold mb-8">Trusted by Thousands</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span className="text-gray-300">Fully Audited Smart Contracts</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="text-gray-300">Bank-Grade Security</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Globe className="h-6 w-6 text-purple-400" />
                <span className="text-gray-300">Global Accessibility</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
