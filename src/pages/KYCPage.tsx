import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Camera, 
  Upload,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Shield,
  User,
  CreditCard,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Star,
  Target,
  Zap,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const KYCPage: React.FC = () => {
  const { user } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState<'not_started' | 'in_progress' | 'pending' | 'approved' | 'rejected'>('not_started');
  const [currentStep, setCurrentStep] = useState(1);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycData, setKycData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: ''
    },
    identity: {
      documentType: '',
      documentNumber: '',
      documentFront: null as File | null,
      documentBack: null as File | null,
      selfie: null as File | null
    },
    verification: {
      emailVerified: false,
      phoneVerified: false,
      identityVerified: false,
      addressVerified: false
    }
  });
  const [kycScore, setKycScore] = useState(0);
  const [verificationHistory, setVerificationHistory] = useState<any[]>([]);

  useEffect(() => {
    loadKycData();
  }, []);

  const loadKycData = async () => {
    try {
      setIsLoading(true);
      
      // Mock KYC data loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate different KYC statuses based on user
      const mockStatus = user?.id ? 'in_progress' : 'not_started';
      setKycStatus(mockStatus);
      setCurrentStep(mockStatus === 'in_progress' ? 2 : 1);
      
      // Mock verification history
      setVerificationHistory([
        {
          id: '1',
          type: 'email_verification',
          status: 'completed',
          timestamp: new Date(Date.now() - 86400000),
          description: 'Email address verified'
        },
        {
          id: '2',
          type: 'phone_verification',
          status: 'completed',
          timestamp: new Date(Date.now() - 172800000),
          description: 'Phone number verified'
        },
        {
          id: '3',
          type: 'identity_verification',
          status: 'pending',
          timestamp: new Date(Date.now() - 259200000),
          description: 'Identity document under review'
        }
      ]);
      
      // Calculate KYC score
      const completedVerifications = verificationHistory.filter(v => v.status === 'completed').length;
      setKycScore((completedVerifications / 4) * 100);
      
    } catch (error) {
      console.error('Failed to load KYC data:', error);
      toast.error('Failed to load KYC data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (field: string, file: File) => {
    setKycData(prev => ({
      ...prev,
      identity: {
        ...prev.identity,
        [field]: file
      }
    }));
    toast.success('File uploaded successfully');
  };

  const handleSubmitStep = async (step: number) => {
    try {
      setIsSubmitting(true);
      
      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (step === 1) {
        setCurrentStep(2);
        toast.success('Personal information saved');
      } else if (step === 2) {
        setCurrentStep(3);
        setKycStatus('pending');
        toast.success('Documents submitted for review');
      }
      
    } catch (error) {
      console.error('Failed to submit step:', error);
      toast.error('Failed to submit information');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteKyc = async () => {
    try {
      setIsSubmitting(true);
      
      // Mock completion
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setKycStatus('approved');
      setKycScore(100);
      toast.success('KYC verification completed successfully!');
      
    } catch (error) {
      console.error('Failed to complete KYC:', error);
      toast.error('Failed to complete KYC verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const kycSteps = [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Provide your basic personal details',
      icon: User,
      completed: currentStep > 1
    },
    {
      id: 2,
      title: 'Identity Verification',
      description: 'Upload your identity documents',
      icon: FileText,
      completed: currentStep > 2
    },
    {
      id: 3,
      title: 'Review & Approval',
      description: 'Wait for verification approval',
      icon: Shield,
      completed: kycStatus === 'approved'
    }
  ];

  const verificationItems = [
    {
      title: 'Email Verification',
      description: 'Verify your email address',
      status: kycData.verification.emailVerified ? 'completed' : 'pending',
      icon: Mail
    },
    {
      title: 'Phone Verification',
      description: 'Verify your phone number',
      status: kycData.verification.phoneVerified ? 'completed' : 'pending',
      icon: Phone
    },
    {
      title: 'Identity Verification',
      description: 'Upload and verify identity documents',
      status: kycData.verification.identityVerified ? 'completed' : 'pending',
      icon: CreditCard
    },
    {
      title: 'Address Verification',
      description: 'Verify your residential address',
      status: kycData.verification.addressVerified ? 'completed' : 'pending',
      icon: MapPin
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-300">Loading KYC information...</p>
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
            <h1 className="text-3xl font-bold text-white">KYC Verification</h1>
            <p className="text-gray-300 mt-1">
              Complete your identity verification to access all platform features
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-gray-400 text-sm">KYC Score</p>
              <p className="text-2xl font-bold text-white">{kycScore.toFixed(0)}%</p>
            </div>
            <button
              onClick={loadKycData}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10"
            >
              <RefreshCw className="h-5 w-5 text-gray-400 hover:text-green-400 transition-colors" />
            </button>
          </div>
        </motion.div>

        {/* KYC Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`p-6 rounded-xl border ${
            kycStatus === 'approved' ? 'bg-green-500/10 border-green-500/30' :
            kycStatus === 'pending' ? 'bg-yellow-500/10 border-yellow-500/30' :
            kycStatus === 'rejected' ? 'bg-red-500/10 border-red-500/30' :
            'bg-gray-900/50 border-gray-800'
          }`}
        >
          <div className="flex items-center space-x-4">
            {getStatusIcon(kycStatus)}
            <div>
              <h2 className={`text-xl font-semibold ${getStatusColor(kycStatus)}`}>
                {kycStatus === 'approved' ? 'KYC Verified' :
                 kycStatus === 'pending' ? 'KYC Under Review' :
                 kycStatus === 'rejected' ? 'KYC Rejected' :
                 'KYC Not Started'}
              </h2>
              <p className="text-gray-400 text-sm">
                {kycStatus === 'approved' ? 'Your identity has been verified successfully' :
                 kycStatus === 'pending' ? 'Your documents are being reviewed by our team' :
                 kycStatus === 'rejected' ? 'Please review and resubmit your documents' :
                 'Complete the verification process to access all features'}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KYC Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Verification Steps</h2>
              
              <div className="space-y-6">
                {kycSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.id}
                      className={`p-6 rounded-lg border transition-all duration-200 ${
                        step.id === currentStep ? 'bg-pink-500/10 border-pink-500/30' :
                        step.completed ? 'bg-green-500/10 border-green-500/30' :
                        'bg-gray-800/30 border-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          step.id === currentStep ? 'bg-pink-500/20' :
                          step.completed ? 'bg-green-500/20' :
                          'bg-gray-700/50'
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            step.id === currentStep ? 'text-pink-400' :
                            step.completed ? 'text-green-400' :
                            'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{step.title}</h3>
                          <p className="text-gray-400 text-sm">{step.description}</p>
                        </div>
                        {step.completed && (
                          <CheckCircle className="h-6 w-6 text-green-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step Content */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-gray-800/30 rounded-lg border border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">First Name</label>
                      <input
                        type="text"
                        value={kycData.personalInfo.firstName}
                        onChange={(e) => setKycData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Last Name</label>
                      <input
                        type="text"
                        value={kycData.personalInfo.lastName}
                        onChange={(e) => setKycData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={kycData.personalInfo.dateOfBirth}
                        onChange={(e) => setKycData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Nationality</label>
                      <select
                        value={kycData.personalInfo.nationality}
                        onChange={(e) => setKycData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, nationality: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                      >
                        <option value="">Select nationality</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                        <option value="SG">Singapore</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={kycData.personalInfo.phone}
                        onChange={(e) => setKycData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Country</label>
                      <select
                        value={kycData.personalInfo.country}
                        onChange={(e) => setKycData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, country: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                      >
                        <option value="">Select country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                        <option value="SG">Singapore</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-gray-400 text-sm mb-2">Address</label>
                    <input
                      type="text"
                      value={kycData.personalInfo.address}
                      onChange={(e) => setKycData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, address: e.target.value }
                      }))}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                      placeholder="Enter your full address"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">City</label>
                      <input
                        type="text"
                        value={kycData.personalInfo.city}
                        onChange={(e) => setKycData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, city: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                        placeholder="Enter your city"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={kycData.personalInfo.postalCode}
                        onChange={(e) => setKycData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, postalCode: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                        placeholder="Enter postal code"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleSubmitStep(1)}
                    disabled={isSubmitting}
                    className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save & Continue'}
                  </button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-gray-800/30 rounded-lg border border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Identity Verification</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Document Type</label>
                      <select
                        value={kycData.identity.documentType}
                        onChange={(e) => setKycData(prev => ({
                          ...prev,
                          identity: { ...prev.identity, documentType: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                      >
                        <option value="">Select document type</option>
                        <option value="passport">Passport</option>
                        <option value="drivers_license">Driver's License</option>
                        <option value="national_id">National ID</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Document Number</label>
                      <input
                        type="text"
                        value={kycData.identity.documentNumber}
                        onChange={(e) => setKycData(prev => ({
                          ...prev,
                          identity: { ...prev.identity, documentNumber: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                        placeholder="Enter document number"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Document Front</label>
                        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">Upload front of document</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files && handleFileUpload('documentFront', e.target.files[0])}
                            className="hidden"
                            id="documentFront"
                          />
                          <label
                            htmlFor="documentFront"
                            className="mt-2 inline-block px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                          >
                            Choose File
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Document Back</label>
                        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">Upload back of document</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files && handleFileUpload('documentBack', e.target.files[0])}
                            className="hidden"
                            id="documentBack"
                          />
                          <label
                            htmlFor="documentBack"
                            className="mt-2 inline-block px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                          >
                            Choose File
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Selfie Photo</label>
                      <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors">
                        <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Take a selfie with your document</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files && handleFileUpload('selfie', e.target.files[0])}
                          className="hidden"
                          id="selfie"
                        />
                        <label
                          htmlFor="selfie"
                          className="mt-2 inline-block px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          Take Photo
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSubmitStep(2)}
                    disabled={isSubmitting}
                    className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                  </button>
                </motion.div>
              )}

              {currentStep === 3 && kycStatus === 'pending' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-gray-800/30 rounded-lg border border-gray-700 text-center"
                >
                  <Clock className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Under Review</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Your documents are being reviewed by our verification team. This usually takes 1-3 business days.
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                    <span className="text-yellow-400 text-sm">Review in progress...</span>
                  </div>
                </motion.div>
              )}

              {kycStatus === 'approved' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-green-500/10 rounded-lg border border-green-500/30 text-center"
                >
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Verification Complete</h3>
                  <p className="text-gray-400 text-sm">
                    Your identity has been successfully verified. You now have access to all platform features.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Verification Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Verification Status</h2>
              
              <div className="space-y-4">
                {verificationItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700"
                    >
                      <Icon className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{item.title}</p>
                        <p className="text-gray-400 text-xs">{item.description}</p>
                      </div>
                      {getStatusIcon(item.status)}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Overall Progress</span>
                  <span className="text-white font-semibold">{kycScore.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${kycScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default KYCPage;