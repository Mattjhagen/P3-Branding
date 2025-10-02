import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Calculator, 
  FileText, 
  Clock,
  DollarSign,
  TrendingUp,
  Shield,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Minus,
  Eye,
  EyeOff,
  BarChart3,
  PieChart,
  Target,
  Zap,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLoanStore } from '@/store/loanStore';
import { apiService } from '@/services/api';
import { Loan } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const BorrowingPage: React.FC = () => {
  const { user } = useAuthStore();
  const { userLoans, setUserLoans } = useLoanStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loanForm, setLoanForm] = useState({
    amount: '',
    purpose: '',
    duration: '',
    description: '',
    interestRate: 0
  });
  const [myLoans, setMyLoans] = useState<Loan[]>([]);
  const [loanHistory, setLoanHistory] = useState<Loan[]>([]);
  const [borrowingStats, setBorrowingStats] = useState({
    totalBorrowed: 0,
    activeLoans: 0,
    totalPaid: 0,
    reputationScore: 0
  });

  useEffect(() => {
    loadBorrowingData();
  }, []);

  const loadBorrowingData = async () => {
    try {
      setIsLoading(true);
      
      // Load user's loan requests
      const loansResponse = await apiService.getLoans({ 
        borrowerId: user?.id,
        limit: 50 
      });
      if (loansResponse.success && loansResponse.data) {
        setMyLoans(loansResponse.data.data);
        setUserLoans(loansResponse.data.data);
      }

      // Load loan history
      const historyResponse = await apiService.getLoans({ 
        borrowerId: user?.id,
        status: 'completed',
        limit: 50 
      });
      if (historyResponse.success && historyResponse.data) {
        setLoanHistory(historyResponse.data.data);
      }

      // Calculate borrowing stats
      const activeLoans = myLoans.filter(loan => loan.status === 'active');
      const totalBorrowed = myLoans.reduce((sum, loan) => sum + loan.amount, 0);
      const totalPaid = loanHistory.reduce((sum, loan) => sum + loan.amount, 0);
      
      setBorrowingStats({
        totalBorrowed,
        activeLoans: activeLoans.length,
        totalPaid,
        reputationScore: user?.reputationScore || 0
      });

    } catch (error) {
      console.error('Failed to load borrowing data:', error);
      toast.error('Failed to load borrowing data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loanForm.amount || !loanForm.purpose || !loanForm.duration || !loanForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(loanForm.amount) <= 0) {
      toast.error('Loan amount must be greater than 0');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Mock loan submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newLoan: Loan = {
        id: Date.now().toString(),
        amount: parseFloat(loanForm.amount),
        purpose: loanForm.purpose,
        duration: parseInt(loanForm.duration),
        description: loanForm.description,
        interestRate: loanForm.interestRate,
        status: 'pending',
        borrowerId: user?.id || '',
        borrowerReputation: user?.reputationScore || 0,
        riskLevel: 'medium',
        dueDate: new Date(Date.now() + parseInt(loanForm.duration) * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        maxLenders: 5
      };

      setMyLoans(prev => [newLoan, ...prev]);
      setUserLoans(prev => [newLoan, ...prev]);
      
      toast.success('Loan request submitted successfully!');
      setShowLoanForm(false);
      setLoanForm({
        amount: '',
        purpose: '',
        duration: '',
        description: '',
        interestRate: 0
      });
      
    } catch (error) {
      console.error('Failed to submit loan:', error);
      toast.error('Failed to submit loan request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateInterestRate = (amount: number, duration: number, reputation: number) => {
    // Base rate calculation based on amount, duration, and reputation
    let baseRate = 8.0; // 8% base rate
    
    // Adjust based on amount (larger loans get better rates)
    if (amount >= 1.0) baseRate -= 1.0;
    else if (amount >= 0.5) baseRate -= 0.5;
    else if (amount >= 0.1) baseRate -= 0.2;
    
    // Adjust based on duration (longer terms get slightly higher rates)
    if (duration > 180) baseRate += 0.5;
    else if (duration > 90) baseRate += 0.2;
    
    // Adjust based on reputation (higher reputation gets better rates)
    if (reputation >= 80) baseRate -= 2.0;
    else if (reputation >= 60) baseRate -= 1.0;
    else if (reputation >= 40) baseRate -= 0.5;
    else if (reputation < 20) baseRate += 1.0;
    
    return Math.max(3.0, Math.min(15.0, baseRate)); // Clamp between 3% and 15%
  };

  const handleFormChange = (field: string, value: string) => {
    setLoanForm(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalculate interest rate when amount or duration changes
      if (field === 'amount' || field === 'duration') {
        const amount = field === 'amount' ? parseFloat(value) : parseFloat(prev.amount);
        const duration = field === 'duration' ? parseInt(value) : parseInt(prev.duration);
        
        if (amount > 0 && duration > 0) {
          updated.interestRate = calculateInterestRate(amount, duration, user?.reputationScore || 0);
        }
      }
      
      return updated;
    });
  };

  const stats = [
    {
      label: 'Total Borrowed',
      value: `${borrowingStats.totalBorrowed.toFixed(3)} BTC`,
      change: '+0.5 BTC',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-blue-400'
    },
    {
      label: 'Active Loans',
      value: borrowingStats.activeLoans.toString(),
      change: '+1',
      changeType: 'positive' as const,
      icon: CreditCard,
      color: 'text-green-400'
    },
    {
      label: 'Total Paid',
      value: `${borrowingStats.totalPaid.toFixed(3)} BTC`,
      change: '+0.2 BTC',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'text-purple-400'
    },
    {
      label: 'Reputation Score',
      value: borrowingStats.reputationScore.toString(),
      change: '+5',
      changeType: 'positive' as const,
      icon: Star,
      color: 'text-yellow-400'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-300">Loading borrowing data...</p>
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
            <h1 className="text-3xl font-bold text-white">Borrow Bitcoin with Competitive Rates</h1>
            <p className="text-gray-300 mt-1">
              Get the Bitcoin you need with our reputation-based lending system
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowLoanForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Request Loan</span>
            </button>
            <button
              onClick={loadBorrowingData}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10"
            >
              <RefreshCw className="h-5 w-5 text-gray-400 hover:text-green-400 transition-colors" />
            </button>
          </div>
        </motion.div>

        {/* Borrowing Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => {
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
          {/* Loan Request Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Request a Loan</h2>
              
              <form onSubmit={handleSubmitLoan} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Loan Amount (BTC)</label>
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      value={loanForm.amount}
                      onChange={(e) => handleFormChange('amount', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                      placeholder="0.001"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Loan Duration (days)</label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={loanForm.duration}
                      onChange={(e) => handleFormChange('duration', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                      placeholder="30"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Loan Purpose</label>
                  <select
                    value={loanForm.purpose}
                    onChange={(e) => handleFormChange('purpose', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                    required
                  >
                    <option value="">Select purpose</option>
                    <option value="business">Business</option>
                    <option value="personal">Personal</option>
                    <option value="investment">Investment</option>
                    <option value="education">Education</option>
                    <option value="emergency">Emergency</option>
                    <option value="debt-consolidation">Debt Consolidation</option>
                    <option value="home-improvement">Home Improvement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description</label>
                  <textarea
                    value={loanForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors h-24 resize-none"
                    placeholder="Tell lenders about your loan purpose and how you plan to repay..."
                    required
                  />
                </div>

                {/* Interest Rate Display */}
                {loanForm.amount && loanForm.duration && (
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Estimated Interest Rate</p>
                        <p className="text-2xl font-bold text-green-400">{loanForm.interestRate.toFixed(1)}% APY</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Monthly Payment</p>
                        <p className="text-lg font-semibold text-white">
                          {loanForm.amount ? (parseFloat(loanForm.amount) * (1 + loanForm.interestRate / 100 / 12)).toFixed(4) : '0.0000'} BTC
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Submit Loan Request</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* My Loans & History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* My Active Loans */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">My Active Loans</h3>
              <div className="space-y-4">
                {myLoans.filter(loan => loan.status === 'active').length > 0 ? (
                  myLoans.filter(loan => loan.status === 'active').map((loan) => (
                    <div
                      key={loan.id}
                      className="p-4 bg-gray-800/30 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-medium">{loan.amount} BTC</span>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-green-400 text-sm">Active</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Interest Rate</span>
                          <span className="text-green-400">{loan.interestRate}% APY</span>
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
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">No Active Loans</h4>
                    <p className="text-gray-400 text-sm">Submit a loan request to get started</p>
                  </div>
                )}
              </div>
            </div>

            {/* Loan History */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Loan History</h3>
              <div className="space-y-4">
                {loanHistory.length > 0 ? (
                  loanHistory.slice(0, 3).map((loan) => (
                    <div
                      key={loan.id}
                      className="p-4 bg-gray-800/30 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{loan.amount} BTC</span>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-green-400 text-sm">Completed</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Purpose</span>
                        <span className="text-white">{loan.purpose}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Completed</span>
                        <span className="text-white">{new Date(loan.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">No Loan History</h4>
                    <p className="text-gray-400 text-sm">Your completed loans will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BorrowingPage;