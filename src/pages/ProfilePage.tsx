import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Star,
  TrendingUp,
  TrendingDown,
  Settings,
  Edit,
  Save,
  X,
  Camera,
  Upload,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  DollarSign,
  CreditCard,
  Users,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Globe,
  Lock,
  Unlock,
  Bell,
  Download,
  Trash2
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileData, setProfileData] = useState({
    personalInfo: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      email: user?.email || '',
      phone: user?.profile?.phone || '',
      dateOfBirth: user?.profile?.dateOfBirth || '',
      bio: user?.profile?.bio || '',
      location: user?.profile?.location || '',
      website: user?.profile?.website || ''
    },
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
        marketing: false
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
        showLocation: true
      },
      security: {
        twoFactor: false,
        biometric: false,
        sessionTimeout: 30
      }
    },
    password: {
      current: '',
      new: '',
      confirm: ''
    }
  });
  const [profileStats, setProfileStats] = useState({
    reputationScore: user?.reputationScore || 0,
    totalLoans: 12,
    totalLent: 2.45,
    totalBorrowed: 1.8,
    successRate: 95.5,
    joinDate: new Date('2024-01-15'),
    lastActive: new Date()
  });
  const [activityHistory, setActivityHistory] = useState<any[]>([]);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      
      // Mock profile data loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock activity history
      setActivityHistory([
        {
          id: '1',
          type: 'loan_completed',
          description: 'Successfully completed loan repayment',
          timestamp: new Date(Date.now() - 3600000),
          amount: 0.5
        },
        {
          id: '2',
          type: 'reputation_increase',
          description: 'Reputation score increased by 5 points',
          timestamp: new Date(Date.now() - 86400000),
          amount: 5
        },
        {
          id: '3',
          type: 'kyc_verified',
          description: 'Identity verification completed',
          timestamp: new Date(Date.now() - 172800000),
          amount: null
        },
        {
          id: '4',
          type: 'loan_funded',
          description: 'Funded a loan request',
          timestamp: new Date(Date.now() - 259200000),
          amount: 0.25
        }
      ]);
      
    } catch (error) {
      console.error('Failed to load profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      // Mock save
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user in store
      if (user) {
        setUser({
          ...user,
          profile: {
            ...user.profile,
            ...profileData.personalInfo
          }
        });
      }
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
      
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileData.password.new !== profileData.password.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (profileData.password.new.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Mock password change
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Password changed successfully');
      setShowPasswordForm(false);
      setProfileData(prev => ({
        ...prev,
        password: { current: '', new: '', confirm: '' }
      }));
      
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsSaving(true);
      
      // Mock account deletion
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success('Account deleted successfully');
      // In real app, this would redirect to login or home
      
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('Failed to delete account');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (file: File) => {
    // Mock file upload
    toast.success('Profile picture updated successfully');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'loan_completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'reputation_increase':
        return <TrendingUp className="h-5 w-5 text-blue-400" />;
      case 'kyc_verified':
        return <Shield className="h-5 w-5 text-purple-400" />;
      case 'loan_funded':
        return <DollarSign className="h-5 w-5 text-yellow-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const stats = [
    {
      label: 'Reputation Score',
      value: profileStats.reputationScore.toString(),
      change: '+5',
      changeType: 'positive' as const,
      icon: Star,
      color: 'text-yellow-400'
    },
    {
      label: 'Total Loans',
      value: profileStats.totalLoans.toString(),
      change: '+2',
      changeType: 'positive' as const,
      icon: CreditCard,
      color: 'text-blue-400'
    },
    {
      label: 'Success Rate',
      value: `${profileStats.successRate}%`,
      change: '+2.5%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      label: 'Member Since',
      value: profileStats.joinDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      change: null,
      changeType: 'neutral' as const,
      icon: Calendar,
      color: 'text-purple-400'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-300">Loading profile...</p>
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
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            <p className="text-gray-300 mt-1">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadProfileData}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10"
            >
              <RefreshCw className="h-5 w-5 text-gray-400 hover:text-green-400 transition-colors" />
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </motion.div>

        {/* Profile Stats */}
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
                  {stat.change && (
                    <div className={`flex items-center space-x-1 text-sm ${
                      stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <TrendingUp className="h-4 w-4" />
                      <span>{stat.change}</span>
                    </div>
                  )}
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
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                {isEditing && (
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                  </button>
                )}
              </div>

              {/* Profile Picture */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-600 transition-colors">
                      <Camera className="h-4 w-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {profileData.personalInfo.firstName} {profileData.personalInfo.lastName}
                  </h3>
                  <p className="text-gray-400">{profileData.personalInfo.email}</p>
                  <p className="text-gray-500 text-sm">Member since {profileStats.joinDate.toLocaleDateString()}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">First Name</label>
                  <input
                    type="text"
                    value={profileData.personalInfo.firstName}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profileData.personalInfo.lastName}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your last name"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.personalInfo.email}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profileData.personalInfo.phone}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={profileData.personalInfo.dateOfBirth}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Location</label>
                  <input
                    type="text"
                    value={profileData.personalInfo.location}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, location: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your location"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">Bio</label>
                  <textarea
                    value={profileData.personalInfo.bio}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, bio: e.target.value }
                    }))}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings & Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-3"
                >
                  <Lock className="h-5 w-5" />
                  <span>Change Password</span>
                </button>
                <button
                  onClick={() => window.location.href = '/kyc'}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-3"
                >
                  <Shield className="h-5 w-5" />
                  <span>KYC Verification</span>
                </button>
                <button
                  onClick={() => window.location.href = '/smart-wallet'}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-3"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Wallet Settings</span>
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center space-x-3"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {activityHistory.slice(0, 4).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700"
                  >
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{activity.description}</p>
                      <p className="text-gray-400 text-xs">
                        {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {activity.amount && (
                      <span className="text-green-400 text-sm font-medium">
                        {activity.amount} BTC
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Change Password Modal */}
        {showPasswordForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Change Password</h3>
                <button
                  onClick={() => setShowPasswordForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Current Password</label>
                  <input
                    type="password"
                    value={profileData.password.current}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      password: { ...prev.password, current: e.target.value }
                    }))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">New Password</label>
                  <input
                    type="password"
                    value={profileData.password.new}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      password: { ...prev.password, new: e.target.value }
                    }))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={profileData.password.confirm}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      password: { ...prev.password, confirm: e.target.value }
                    }))}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Delete Account</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-400 mx-auto mb-2" />
                  <p className="text-red-400 text-sm text-center">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                </div>

                <p className="text-gray-400 text-sm">
                  Are you sure you want to delete your account? This will remove all your:
                </p>
                <ul className="text-gray-400 text-sm space-y-1 ml-4">
                  <li>• Profile information</li>
                  <li>• Loan history</li>
                  <li>• Reputation score</li>
                  <li>• Wallet data</li>
                </ul>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isSaving}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;