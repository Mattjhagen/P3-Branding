import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Clock,
  Users,
  Star,
  Eye,
  Filter,
  Search,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap,
  Target,
  BarChart3,
  PieChart,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLoanStore } from '@/store/loanStore';
import { apiService } from '@/services/api';
import { Loan } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const LendingPage: React.FC = () => {
  const { user } = useAuthStore();
  const { loans, setLoans } = useLoanStore();
  
  const [availableLoans, setAvailableLoans] = useState<Loan[]>([]);
  const [myLending, setMyLending] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('interestRate');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [lendingAmount, setLendingAmount] = useState('');
  const [isFunding, setIsFunding] = useState(false);

  useEffect(() => {
    loadLendingData();
  }, []);

  const loadLendingData = async () => {
    try {
      setIsLoading(true);
      
      // Load available loans for funding
      const availableResponse = await apiService.getLoans({ 
        status: 'pending',
        limit: 50 
      });
      if (availableResponse.success && availableResponse.data) {
        setAvailableLoans(availableResponse.data.data);
      }

      // Load my lending portfolio
      const lendingResponse = await apiService.getLoans({ 
        lenderId: user?.id,
        limit: 50 
      });
      if (lendingResponse.success && lendingResponse.data) {
        setMyLending(lendingResponse.data.data);
      }

    } catch (error) {
      console.error('Failed to load lending data:', error);
      toast.error('Failed to load lending data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFundLoan = async (loan: Loan) => {
    if (!lendingAmount || parseFloat(lendingAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(lendingAmount) > loan.amount) {
      toast.error('Amount cannot exceed loan request');
      return;
    }

    try {
      setIsFunding(true);
      
      // Mock funding process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Successfully funded ${lendingAmount} BTC to loan request`);
      setShowCreateModal(false);
      setSelectedLoan(null);
      setLendingAmount('');
      
      // Reload data
      await loadLendingData();
      
    } catch (error) {
      console.error('Failed to fund loan:', error);
      toast.error('Failed to fund loan');
    } finally {
      setIsFunding(false);
    }
  };

  const handleCreateLendingPool = async () => {
    try {
      // Mock creating lending pool
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Lending pool created successfully');
      setShowCreateModal(false);
      await loadLendingData();
    } catch (error) {
      console.error('Failed to create lending pool:', error);
      toast.error('Failed to create lending pool');
    }
  };

  const filteredLoans = availableLoans.filter(loan => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'high-risk' && loan.riskLevel === 'high') ||
      (selectedFilter === 'medium-risk' && loan.riskLevel === 'medium') ||
      (selectedFilter === 'low-risk' && loan.riskLevel === 'low');
    
    const matchesSearch = loan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    switch (sortBy) {
      case 'interestRate':
        return b.interestRate - a.interestRate;
      case 'amount':
        return b.amount - a.amount;
      case 'duration':
        return a.duration - b.duration;
      case 'reputation':
        return b.borrowerReputation - a.borrowerReputation;
      default:
        return 0;
    }
  });

  const lendingStats = [
    {
      label: 'Total Lent',
      value: '2.45 BTC',
      change: '+0.15 BTC',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      label: 'Active Loans',
      value: myLending.filter(loan => loan.status === 'active').length.toString(),
      change: '+2',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-blue-400'
    },
    {
      label: 'Total Earned',
      value: '0.125 BTC',
      change: '+0.025 BTC',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-yellow-400'
    },
    {
      label: 'Avg. APY',
      value: '5.8%',
      change: '+0.3%',
      changeType: 'positive' as const,
      icon: BarChart3,
      color: 'text-purple-400'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-300">Loading lending opportunities...</p>
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
            <h1 className="text-3xl font-bold text-white">Lend Bitcoin & Earn Interest</h1>
            <p className="text-gray-300 mt-1">
              Fund loans and earn competitive returns with our AI-powered risk assessment
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Lending Pool</span>
            </button>
            <button
              onClick={loadLendingData}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10"
            >
              <RefreshCw className="h-5 w-5 text-gray-400 hover:text-green-400 transition-colors" />
            </button>
          </div>
        </motion.div>

        {/* Lending Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {lendingStats.map((stat, index) => {
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Loans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Available Loans</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search loans..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    <option value="interestRate">Sort by APY</option>
                    <option value="amount">Sort by Amount</option>
                    <option value="duration">Sort by Duration</option>
                    <option value="reputation">Sort by Reputation</option>
                  </select>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-gray-400 text-sm">Filter:</span>
                {['all', 'low-risk', 'medium-risk', 'high-risk'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                      selectedFilter === filter
                        ? 'bg-gradient-to-r from-pink-500/20 to-green-500/20 text-white border border-pink-500/30'
                        : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {sortedLoans.length > 0 ? (
                  sortedLoans.map((loan) => (
                    <div
                      key={loan.id}
                      className="p-6 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            loan.riskLevel === 'low' ? 'bg-green-500/20' :
                            loan.riskLevel === 'medium' ? 'bg-yellow-500/20' :
                            'bg-red-500/20'
                          }`}>
                            <Shield className={`h-6 w-6 ${
                              loan.riskLevel === 'low' ? 'text-green-400' :
                              loan.riskLevel === 'medium' ? 'text-yellow-400' :
                              'text-red-400'
                            }`} />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{loan.amount} BTC</h3>
                            <p className="text-gray-400 text-sm">{loan.purpose} • {loan.duration} days</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold text-lg">{loan.interestRate}% APY</p>
                          <p className="text-gray-400 text-sm">Reputation: {loan.borrowerReputation}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4">{loan.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">Due: {new Date(loan.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">0/{loan.maxLenders} lenders</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedLoan(loan);
                            setShowCreateModal(true);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                        >
                          Fund Loan
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <DollarSign className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No Loans Available</h3>
                    <p className="text-gray-400 text-sm">Check back later for new lending opportunities</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* My Lending Portfolio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">My Lending Portfolio</h2>
              
              <div className="space-y-4">
                {myLending.length > 0 ? (
                  myLending.map((loan) => (
                    <div
                      key={loan.id}
                      className="p-4 bg-gray-800/30 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-medium">{loan.amount} BTC</span>
                        <div className="flex items-center space-x-1">
                          {loan.status === 'active' ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : loan.status === 'pending' ? (
                            <Clock className="h-4 w-4 text-yellow-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className={`text-sm ${
                            loan.status === 'active' ? 'text-green-400' :
                            loan.status === 'pending' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {loan.status}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">APY</span>
                          <span className="text-green-400">{loan.interestRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Earned</span>
                          <span className="text-white">0.025 BTC</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Due Date</span>
                          <span className="text-white">{new Date(loan.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No Active Lending</h3>
                    <p className="text-gray-400 text-sm mb-4">Start funding loans to earn interest</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Start Lending
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Fund Loan Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {selectedLoan ? 'Fund Loan' : 'Create Lending Pool'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedLoan(null);
                    setLendingAmount('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {selectedLoan ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{selectedLoan.amount} BTC</span>
                      <span className="text-green-400 font-semibold">{selectedLoan.interestRate}% APY</span>
                    </div>
                    <p className="text-gray-400 text-sm">{selectedLoan.description}</p>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Amount to Fund (BTC)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={lendingAmount}
                      onChange={(e) => setLendingAmount(e.target.value)}
                      placeholder="0.001"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Max: {selectedLoan.amount} BTC
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setSelectedLoan(null);
                        setLendingAmount('');
                      }}
                      className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleFundLoan(selectedLoan)}
                      disabled={isFunding || !lendingAmount}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isFunding ? 'Funding...' : 'Fund Loan'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    Create a lending pool to automatically fund loans that match your criteria.
                  </p>
                  <button
                    onClick={handleCreateLendingPool}
                    className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Create Lending Pool
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LendingPage;