import React from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  Search,
  ChevronRight,
  BookOpen,
  Users,
  Shield,
  CreditCard,
  Wallet
} from 'lucide-react';

const HelpPage: React.FC = () => {
  const faqItems = [
    {
      question: "How do I get started with P³ Lending?",
      answer: "To get started, create an account using Google, GitHub, or Discord OAuth, or connect your Web3 wallet. Complete the KYC process to verify your identity and start lending or borrowing Bitcoin."
    },
    {
      question: "What is the minimum loan amount?",
      answer: "The minimum loan amount is 0.001 BTC. For new users, we offer secured micro-loans until you build sufficient reputation for unsecured lending."
    },
    {
      question: "How does the reputation system work?",
      answer: "Your reputation score is based on successful loan completions, on-time payments, and positive feedback from other users. Higher reputation unlocks better rates and larger loan amounts."
    },
    {
      question: "What are the interest rates?",
      answer: "Interest rates vary based on loan terms, borrower reputation, and market conditions. Rates typically range from 3% to 15% APR, with better rates for higher reputation scores."
    },
    {
      question: "How secure is my Bitcoin?",
      answer: "All loans are secured by smart contracts on the blockchain. Your Bitcoin is held in escrow until loan terms are met. We use bank-grade security and are fully audited."
    },
    {
      question: "Can I withdraw my funds anytime?",
      answer: "Yes, you can withdraw your available balance anytime. However, funds currently in active loans cannot be withdrawn until the loan is completed or repaid."
    }
  ];

  const supportTopics = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn how to create an account and make your first loan",
      color: "text-blue-500"
    },
    {
      icon: Shield,
      title: "Security & Safety",
      description: "Understand our security measures and how to protect your account",
      color: "text-green-500"
    },
    {
      icon: CreditCard,
      title: "Lending & Borrowing",
      description: "Everything about creating and managing loans",
      color: "text-purple-500"
    },
    {
      icon: Wallet,
      title: "Wallet Integration",
      description: "Connect and manage your Web3 wallets",
      color: "text-orange-500"
    },
    {
      icon: Users,
      title: "Reputation System",
      description: "Build and maintain your on-chain reputation",
      color: "text-pink-500"
    },
    {
      icon: HelpCircle,
      title: "Troubleshooting",
      description: "Common issues and how to resolve them",
      color: "text-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <img 
                src="/logo-p3.svg" 
                alt="P³ Lending" 
                className="h-16 w-16"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-thin text-gray-900 mb-6 tracking-tight">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              Find answers to your questions and get the support you need
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles, guides, and FAQs..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Topics */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-thin text-gray-900 mb-4 tracking-tight">
              Popular Topics
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Browse our most helpful resources
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportTopics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-center mb-4">
                    <Icon className={`h-8 w-8 ${topic.color} mr-3`} />
                    <h3 className="text-xl font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {topic.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4 font-light">
                    {topic.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium">
                    <span>Learn more</span>
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-thin text-gray-900 mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Quick answers to common questions
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {item.question}
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  {item.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-4xl font-thin text-white mb-8 tracking-tight">
              Still Need Help?
            </h2>
            <p className="text-xl text-gray-300 mb-12 font-light leading-relaxed">
              Our support team is here to help you 24/7
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <MessageCircle className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Live Chat</h3>
                <p className="text-gray-400 font-light mb-4">Get instant help from our support team</p>
                <button className="btn btn-primary">Start Chat</button>
              </div>
              
              <div className="flex flex-col items-center">
                <Mail className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Email Support</h3>
                <p className="text-gray-400 font-light mb-4">Send us a detailed message</p>
                <button className="btn btn-primary">Send Email</button>
              </div>
              
              <div className="flex flex-col items-center">
                <Phone className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Phone Support</h3>
                <p className="text-gray-400 font-light mb-4">Speak directly with our team</p>
                <button className="btn btn-primary">Call Now</button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HelpPage;
