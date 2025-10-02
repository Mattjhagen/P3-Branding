import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Send, 
  Download, 
  Upload,
  Eye,
  EyeOff,
  Copy,
  QrCode,
  Settings,
  Shield,
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Minus,
  RefreshCw,
  BarChart3,
  PieChart,
  Target,
  Star,
  DollarSign,
  CreditCard,
  Users
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { web3Service } from '@/services/web3';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const SmartWalletPage: React.FC = () => {
  const { user } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(2.45);
  const [showBalance, setShowBalance] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [sendForm, setSendForm] = useState({
    address: '',
    amount: '',
    memo: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [walletStats, setWalletStats] = useState({
    totalReceived: 5.2,
    totalSent: 2.75,
    transactionCount: 24,
    avgTransactionSize: 0.33
  });

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setIsLoading(true);
      
      // Check wallet connection
      const walletConnection = web3Service.getWalletConnection();
      setIsConnected(walletConnection?.isConnected || false);
      setWalletAddress(walletConnection?.address || '');
      
      // Load mock transaction history
      setTransactions([
        {
          id: '1',
          type: 'received',
          amount: 0.5,
          address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          timestamp: new Date(Date.now() - 3600000),
          status: 'confirmed',
          memo: 'Loan payment received'
        },
        {
          id: '2',
          type: 'sent',
          amount: 0.1,
          address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
          timestamp: new Date(Date.now() - 7200000),
          status: 'confirmed',
          memo: 'Payment to lender'
        },
        {
          id: '3',
          type: 'received',
          amount: 0.25,
          address: '1C4hvFnQNURtPx37aPjKk4uVLy9hu2k4yZ',
          timestamp: new Date(Date.now() - 86400000),
          status: 'confirmed',
          memo: 'Interest earned'
        },
        {
          id: '4',
          type: 'sent',
          amount: 0.05,
          address: '1D1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          timestamp: new Date(Date.now() - 172800000),
          status: 'pending',
          memo: 'Micro payment'
        }
      ]);

    } catch (error) {
      console.error('Failed to load wallet data:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      const { wallet } = await web3Service.connectWallet();
      setIsConnected(true);
      setWalletAddress(wallet.address);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await web3Service.disconnectWallet();
      setIsConnected(false);
      setWalletAddress('');
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  const handleSendTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sendForm.address || !sendForm.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(sendForm.amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    if (parseFloat(sendForm.amount) > walletBalance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      setIsSending(true);
      
      // Mock transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newTransaction = {
        id: Date.now().toString(),
        type: 'sent',
        amount: parseFloat(sendForm.amount),
        address: sendForm.address,
        timestamp: new Date(),
        status: 'confirmed',
        memo: sendForm.memo || 'Transaction'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setWalletBalance(prev => prev - parseFloat(sendForm.amount));
      
      toast.success('Transaction sent successfully!');
      setShowSendModal(false);
      setSendForm({ address: '', amount: '', memo: '' });
      
    } catch (error) {
      console.error('Failed to send transaction:', error);
      toast.error('Failed to send transaction');
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const formatAddress = (address: string) => {
    if (address.length <= 20) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const walletStatsData = [
    {
      label: 'Total Balance',
      value: showBalance ? `${walletBalance.toFixed(4)} BTC` : '••••••',
      change: '+0.15 BTC',
      changeType: 'positive' as const,
      icon: Wallet,
      color: 'text-green-400'
    },
    {
      label: 'Total Received',
      value: `${walletStats.totalReceived.toFixed(3)} BTC`,
      change: '+0.5 BTC',
      changeType: 'positive' as const,
      icon: Download,
      color: 'text-blue-400'
    },
    {
      label: 'Total Sent',
      value: `${walletStats.totalSent.toFixed(3)} BTC`,
      change: '+0.1 BTC',
      changeType: 'positive' as const,
      icon: Upload,
      color: 'text-purple-400'
    },
    {
      label: 'Transactions',
      value: walletStats.transactionCount.toString(),
      change: '+3',
      changeType: 'positive' as const,
      icon: BarChart3,
      color: 'text-yellow-400'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-300">Loading wallet...</p>
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
            <h1 className="text-3xl font-bold text-white">Smart Wallet</h1>
            <p className="text-gray-300 mt-1">
              Manage your Bitcoin wallet with advanced features and security
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/10 group"
            >
              {showBalance ? (
                <EyeOff className="h-5 w-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
              )}
            </button>
            <button
              onClick={loadWalletData}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10"
            >
              <RefreshCw className="h-5 w-5 text-gray-400 hover:text-green-400 transition-colors" />
            </button>
          </div>
        </motion.div>

        {/* Wallet Connection Status */}
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center"
          >
            <Wallet className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Connect your Bitcoin wallet to start managing your funds
            </p>
            <button
              onClick={handleConnectWallet}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Wallet className="h-5 w-5" />
              <span>Connect Wallet</span>
            </button>
          </motion.div>
        ) : (
          <>
            {/* Wallet Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {walletStatsData.map((stat, index) => {
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
                        <TrendingUp className="h-4 w-4" />
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

            {/* Wallet Address & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Wallet Address</h2>
                <button
                  onClick={handleDisconnectWallet}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Disconnect
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Your Bitcoin Address</p>
                  <p className="text-white font-mono text-lg">{formatAddress(walletAddress)}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(walletAddress)}
                  className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <Copy className="h-5 w-5 text-gray-400 hover:text-white" />
                </button>
                <button
                  onClick={() => setShowReceiveModal(true)}
                  className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <QrCode className="h-5 w-5 text-gray-400 hover:text-white" />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowSendModal(true)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Bitcoin</span>
                </button>
                <button
                  onClick={() => setShowReceiveModal(true)}
                  className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Receive Bitcoin</span>
                </button>
              </div>
            </motion.div>

            {/* Transaction History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Transaction History</h2>
                <button className="text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        transaction.type === 'received' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {transaction.type === 'received' ? (
                          <Download className="h-6 w-6 text-green-400" />
                        ) : (
                          <Upload className="h-6 w-6 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {transaction.type === 'received' ? 'Received' : 'Sent'} {transaction.amount} BTC
                        </p>
                        <p className="text-gray-400 text-sm">{transaction.memo}</p>
                        <p className="text-gray-500 text-xs">
                          {transaction.timestamp.toLocaleDateString()} at {transaction.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        {transaction.status === 'confirmed' ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : transaction.status === 'pending' ? (
                          <Clock className="h-4 w-4 text-yellow-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                        <span className={`text-sm ${
                          transaction.status === 'confirmed' ? 'text-green-400' :
                          transaction.status === 'pending' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm font-mono">
                        {formatAddress(transaction.address)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Send Modal */}
        {showSendModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Send Bitcoin</h3>
                <button
                  onClick={() => {
                    setShowSendModal(false);
                    setSendForm({ address: '', amount: '', memo: '' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSendTransaction} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Recipient Address</label>
                  <input
                    type="text"
                    value={sendForm.address}
                    onChange={(e) => setSendForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter Bitcoin address"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Amount (BTC)</label>
                  <input
                    type="number"
                    step="0.00000001"
                    value={sendForm.amount}
                    onChange={(e) => setSendForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00000000"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                    required
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Available: {walletBalance.toFixed(8)} BTC
                  </p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Memo (Optional)</label>
                  <input
                    type="text"
                    value={sendForm.memo}
                    onChange={(e) => setSendForm(prev => ({ ...prev, memo: e.target.value }))}
                    placeholder="Add a note"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSendModal(false);
                      setSendForm({ address: '', amount: '', memo: '' });
                    }}
                    className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? 'Sending...' : 'Send Bitcoin'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Receive Modal */}
        {showReceiveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Receive Bitcoin</h3>
                <button
                  onClick={() => setShowReceiveModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="text-center space-y-6">
                <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-gray-800" />
                </div>
                
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">Your Bitcoin Address</p>
                  <p className="text-white font-mono text-sm break-all">{walletAddress}</p>
                </div>

                <button
                  onClick={() => copyToClipboard(walletAddress)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Copy className="h-5 w-5" />
                  <span>Copy Address</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartWalletPage;