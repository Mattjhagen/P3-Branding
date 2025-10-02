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
  Eye,
  Play,
  Target,
  Rocket,
  Hand
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { apiService } from '@/services/api';
import { PlatformMetrics } from '@/types';

const HomePage: React.FC = () => {
  // Simple test version to debug rendering issues
  const { isAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();
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
    <div className={`min-h-screen overflow-hidden ${
      theme === 'light' 
        ? 'bg-white text-gray-900' 
        : 'bg-black text-white'
    }`}>
      {/* P³ Lending Brand Colors Background */}
      <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#1E3A8A' }}>
        {/* Animated network lines with brand colors */}
        <div className="absolute inset-0">
          {/* Main network lines - alternating between pink and green */}
          {Array.from({ length: 12 }).map((_, i) => {
            const isPink = i % 2 === 0;
            const color = isPink ? '#FF5B77' : '#5DE794';
            return (
              <motion.div
                key={`line-${i}`}
                className="absolute h-px"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 300 + 100}px`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  background: `linear-gradient(to right, transparent, ${color}, transparent)`,
                  boxShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scaleX: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            );
          })}
          
          {/* Intersection points with plus signs */}
          {Array.from({ length: 8 }).map((_, i) => {
            const isPink = i % 2 === 0;
            const color = isPink ? '#FF5B77' : '#5DE794';
            return (
              <motion.div
                key={`plus-${i}`}
                className="absolute font-bold text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  color: color,
                  textShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                +
              </motion.div>
            );
          })}
          
          {/* Floating data points */}
          {Array.from({ length: 20 }).map((_, i) => {
            const isPink = i % 2 === 0;
            const color = isPink ? '#FF5B77' : '#5DE794';
            return (
              <motion.div
                key={`point-${i}`}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: color,
                  boxShadow: `0 0 6px ${color}, 0 0 12px ${color}`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            );
          })}
        </div>
        
        {/* Subtle gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-pink-500/5 to-transparent" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center"
          >
            {/* Logo and Brand */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center justify-center mb-20"
            >
              {/* Glowing logo container with brand colors */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255, 91, 119, 0.3), 0 0 40px rgba(93, 231, 148, 0.3)',
                    '0 0 40px rgba(255, 91, 119, 0.6), 0 0 80px rgba(93, 231, 148, 0.6)',
                    '0 0 20px rgba(255, 91, 119, 0.3), 0 0 40px rgba(93, 231, 148, 0.3)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative mb-8"
              >
                <div 
                  className="absolute inset-0 rounded-full blur-xl opacity-30"
                  style={{
                    background: 'linear-gradient(45deg, #FF5B77, #5DE794)',
                  }}
                />
                <img 
                  src="/logo-p3.svg" 
                  alt="P³ Lending" 
                  className="relative h-24 w-24 filter drop-shadow-2xl"
                />
              </motion.div>
              
              <div className="text-center">
                <motion.h1 
                  className={`text-6xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent mb-4 ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'
                      : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600'
                  }`}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                >
                  P³ Lending
                </motion.h1>
                <motion.p 
                  className={`text-xl font-light ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Peer-to-Peer = 2 + 1 for helping those in need
                </motion.p>
              </div>
            </motion.div>

            {/* Main Headline with Brand Colors */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl md:text-8xl font-bold mb-12 leading-tight text-center text-white"
            >
              Meet your{' '}
              <span 
                style={{
                  color: '#FF5B77',
                  textShadow: '0 0 20px #FF5B77, 0 0 40px #FF5B77, 0 0 60px #FF5B77',
                }}
              >
                decentralized
              </span>
              <br />
              lending ecosystem
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl mb-16 max-w-4xl mx-auto font-light leading-relaxed text-center text-gray-300"
            >
              Revolutionizing peer-to-peer finance through blockchain technology, 
              Bitcoin, and trust-based reputation systems. Join thousands building 
              the future of accessible credit.
            </motion.p>

            {/* CTA Buttons with Brand Colors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
            >
              {isAuthenticated ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/dashboard"
                    className="group relative inline-flex items-center justify-center px-12 py-4 text-black rounded-lg font-bold text-lg transition-all duration-300 overflow-hidden"
                    style={{
                      backgroundColor: '#5DE794',
                      boxShadow: '0 0 20px rgba(93, 231, 148, 0.4), 0 0 40px rgba(93, 231, 148, 0.2)',
                    }}
                  >
                    <span className="relative z-10">Go to Dashboard</span>
                    <ArrowRight className="relative z-10 h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/register"
                      className="group relative inline-flex items-center justify-center px-12 py-4 text-black rounded-lg font-bold text-lg transition-all duration-300 overflow-hidden"
                      style={{
                        backgroundColor: '#5DE794',
                        boxShadow: '0 0 20px rgba(93, 231, 148, 0.4), 0 0 40px rgba(93, 231, 148, 0.2)',
                      }}
                    >
                      <Rocket className="relative z-10 h-5 w-5 mr-3" />
                      <span className="relative z-10">Start Lending</span>
                      <ArrowRight className="relative z-10 h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/login"
                      className="group relative inline-flex items-center justify-center px-12 py-4 border-2 text-white rounded-lg font-bold text-lg transition-all duration-300 overflow-hidden"
                      style={{
                        borderColor: '#FF5B77',
                        color: '#FF5B77',
                      }}
                    >
                      <Target className="relative z-10 h-5 w-5 mr-3" />
                      <span className="relative z-10">Request a Loan</span>
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Demo Video Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className={`flex flex-col items-center justify-center space-y-4 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              <button className={`group flex items-center space-x-3 transition-colors ${
                theme === 'light' ? 'hover:text-gray-900' : 'hover:text-white'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${
                  theme === 'light'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600'
                }`}>
                  <Play className="h-5 w-5 text-white ml-1" />
                </div>
                <span className="font-medium">Watch Demo</span>
              </button>
              <span className="text-sm text-center">See how P³ Lending works</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-32 bg-black">
        <div className="max-w-7xl mx-auto px-8">
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
                  className="text-center group"
                >
                  <div 
                    className="mb-8 p-4 rounded-2xl inline-block group-hover:scale-110 transition-transform"
                    style={{
                      background: 'linear-gradient(45deg, rgba(255, 91, 119, 0.1), rgba(93, 231, 148, 0.1))',
                    }}
                  >
                    <Icon 
                      className="h-8 w-8"
                      style={{ color: '#5DE794' }}
                    />
                  </div>
                  <div className="text-4xl font-bold mb-4 tracking-tight text-white">
                    {isLoading ? (
                      <div className="animate-pulse h-10 w-24 rounded mx-auto bg-gray-700"></div>
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-sm font-medium tracking-wide uppercase text-gray-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-40 bg-black">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-32"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-12 tracking-tight text-white">
              Built for the{' '}
              <span 
                style={{
                  color: '#FF5B77',
                  textShadow: '0 0 20px #FF5B77, 0 0 40px #FF5B77',
                }}
              >
                future
              </span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto font-light leading-relaxed text-gray-300">
              Every feature designed with precision, every interaction crafted for perfection. 
              Experience the next generation of decentralized finance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div 
                    className="p-10 rounded-2xl border transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-gray-900 to-black border-gray-800"
                    style={{
                      '&:hover': {
                        borderColor: 'rgba(93, 231, 148, 0.5)',
                        boxShadow: '0 0 30px rgba(93, 231, 148, 0.1)',
                      }
                    }}
                  >
                    <div 
                      className="mb-8 p-4 rounded-xl inline-block group-hover:scale-110 transition-transform"
                      style={{
                        background: 'linear-gradient(45deg, rgba(255, 91, 119, 0.1), rgba(93, 231, 148, 0.1))',
                      }}
                    >
                      <Icon 
                        className="h-8 w-8"
                        style={{ color: '#5DE794' }}
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-6 tracking-tight text-white">{feature.title}</h3>
                    <p className="leading-relaxed text-gray-300">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-40 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-32"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-12 tracking-tight">
              How it{' '}
              <span 
                style={{
                  color: '#5DE794',
                  textShadow: '0 0 20px #5DE794, 0 0 40px #5DE794',
                }}
              >
                works
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              Simple, secure, and transparent. Get started in minutes with our revolutionary platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                step: "01",
                title: "Connect & Verify",
                description: "Link your wallet, complete KYC, and build your reputation score through our transparent system.",
                icon: Shield,
                color: "#FF5B77"
              },
              {
                step: "02", 
                title: "Lend or Borrow",
                description: "Browse opportunities, set your terms, and let smart contracts handle the rest automatically.",
                icon: Hand,
                color: "#5DE794"
              },
              {
                step: "03",
                title: "Grow & Earn",
                description: "Watch your reputation grow, earn competitive returns, and access better rates over time.",
                icon: TrendingUp,
                color: "#FF5B77"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="relative mb-8">
                    <div 
                      className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: `0 0 20px ${item.color}, 0 0 40px ${item.color}`,
                      }}
                    >
                      {item.step}
                    </div>
                    <div 
                      className="absolute -top-2 -right-2 w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(93, 231, 148, 0.2)',
                      }}
                    >
                      <Icon 
                        className="h-8 w-8"
                        style={{ color: '#5DE794' }}
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-40 bg-black">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-12 tracking-tight">
              Ready to{' '}
              <span 
                style={{
                  color: '#5DE794',
                  textShadow: '0 0 20px #5DE794, 0 0 40px #5DE794',
                }}
              >
                revolutionize
              </span>
              <br />
              your finances?
            </h2>
            <p className="text-xl text-gray-300 mb-20 font-light leading-relaxed max-w-3xl mx-auto">
              Join thousands of users who are already building the future of finance. 
              Start your journey with P³ Lending today.
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center px-8 py-4 text-black rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: '#5DE794',
                    boxShadow: '0 0 20px rgba(93, 231, 148, 0.4), 0 0 40px rgba(93, 231, 148, 0.2)',
                  }}
                >
                  <Rocket className="h-5 w-5 mr-3" />
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center px-8 py-4 border-2 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: '#FF5B77',
                    color: '#FF5B77',
                  }}
                >
                  <Target className="h-5 w-5 mr-3" />
                  <span>Request a Loan</span>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="relative z-10 py-32 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-20">
              Trusted by thousands worldwide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="flex flex-col items-center space-y-4 group">
                <div 
                  className="p-4 rounded-2xl group-hover:scale-110 transition-transform"
                  style={{
                    background: 'linear-gradient(45deg, rgba(255, 91, 119, 0.1), rgba(93, 231, 148, 0.1))',
                  }}
                >
                  <CheckCircle 
                    className="h-12 w-12"
                    style={{ color: '#5DE794' }}
                  />
                </div>
                <span className="text-white font-bold text-xl">Fully Audited</span>
                <span className="text-gray-400 text-sm font-medium tracking-wide uppercase">Smart Contracts</span>
              </div>
              <div className="flex flex-col items-center space-y-4 group">
                <div 
                  className="p-4 rounded-2xl group-hover:scale-110 transition-transform"
                  style={{
                    background: 'linear-gradient(45deg, rgba(255, 91, 119, 0.1), rgba(93, 231, 148, 0.1))',
                  }}
                >
                  <Shield 
                    className="h-12 w-12"
                    style={{ color: '#FF5B77' }}
                  />
                </div>
                <span className="text-white font-bold text-xl">Bank-Grade</span>
                <span className="text-gray-400 text-sm font-medium tracking-wide uppercase">Security</span>
              </div>
              <div className="flex flex-col items-center space-y-4 group">
                <div 
                  className="p-4 rounded-2xl group-hover:scale-110 transition-transform"
                  style={{
                    background: 'linear-gradient(45deg, rgba(255, 91, 119, 0.1), rgba(93, 231, 148, 0.1))',
                  }}
                >
                  <Globe 
                    className="h-12 w-12"
                    style={{ color: '#5DE794' }}
                  />
                </div>
                <span className="text-white font-bold text-xl">Global</span>
                <span className="text-gray-400 text-sm font-medium tracking-wide uppercase">Accessibility</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/logo-p3.svg" 
                  alt="P³ Lending" 
                  className="h-10 w-10"
                />
                <span 
                  className="text-2xl font-bold"
                  style={{
                    background: 'linear-gradient(45deg, #FF5B77, #5DE794)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  P³ Lending
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                Revolutionizing peer-to-peer finance through blockchain technology, 
                Bitcoin, and trust-based reputation systems. Building the future of accessible credit.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/lend" className="text-gray-400 hover:text-green-400 transition-colors">Lend</Link></li>
                <li><Link to="/borrow" className="text-gray-400 hover:text-green-400 transition-colors">Borrow</Link></li>
                <li><Link to="/reputation" className="text-gray-400 hover:text-green-400 transition-colors">Reputation</Link></li>
                <li><Link to="/kyc" className="text-gray-400 hover:text-green-400 transition-colors">KYC</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/help" className="text-gray-400 hover:text-green-400 transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-green-400 transition-colors">Contact Us</Link></li>
                <li><Link to="/terms-of-service.html" className="text-gray-400 hover:text-green-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy-policy.html" className="text-gray-400 hover:text-green-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 P³ Lending. All rights reserved. Built with ❤️ for the decentralized future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
