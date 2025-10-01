import React, { useState, useEffect } from 'react'
import { useReownWeb3 } from '@/services/reownWeb3'
import { 
  alchemySmartWalletService, 
  type SmartWalletType, 
  type SupportedChain,
  formatSmartWalletAddress,
  formatSmartWalletBalance,
  getSmartWalletTypeDisplayName,
  getChainDisplayName
} from '@/services/alchemySmartWallet'
import { motion } from 'framer-motion'
import { 
  Wallet, 
  Plus, 
  Settings, 
  Copy, 
  ExternalLink, 
  ChevronDown,
  Shield,
  Zap,
  Globe,
  Lock,
  CheckCircle,
  ArrowRight,
  Info
} from 'lucide-react'
import toast from 'react-hot-toast'

const SmartWalletPage: React.FC = () => {
  const {
    isConnected,
    address,
    chainId,
    formattedBalance,
    shortAddress
  } = useReownWeb3()

  const [selectedType, setSelectedType] = useState<SmartWalletType>('light')
  const [selectedChain, setSelectedChain] = useState<SupportedChain>('mainnet')
  const [isCreating, setIsCreating] = useState(false)
  const [smartWalletAddress, setSmartWalletAddress] = useState<string | null>(null)
  const [smartWalletBalance, setSmartWalletBalance] = useState<string>('0')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const smartWalletTypes = [
    {
      type: 'light' as SmartWalletType,
      name: 'Light Account',
      description: 'Simple, gas-efficient smart wallet perfect for beginners',
      features: ['Low gas costs', 'Simple setup', 'Basic functionality'],
      icon: Zap,
      color: 'text-blue-500'
    },
    {
      type: 'modular' as SmartWalletType,
      name: 'Modular Account',
      description: 'Flexible smart wallet with customizable modules',
      features: ['Modular design', 'Customizable', 'Advanced features'],
      icon: Settings,
      color: 'text-purple-500'
    },
    {
      type: 'kernel' as SmartWalletType,
      name: 'Kernel Account',
      description: 'Advanced smart wallet with session keys and automation',
      features: ['Session keys', 'Automation', 'Advanced security'],
      icon: Shield,
      color: 'text-green-500'
    },
    {
      type: 'zeroDev' as SmartWalletType,
      name: 'ZeroDev Account',
      description: 'Enterprise-grade smart wallet with full customization',
      features: ['Enterprise features', 'Full customization', 'Maximum security'],
      icon: Lock,
      color: 'text-red-500'
    }
  ]

  const chains = [
    { key: 'mainnet' as SupportedChain, name: 'Ethereum', icon: '🔷' },
    { key: 'arbitrum' as SupportedChain, name: 'Arbitrum', icon: '🔵' },
    { key: 'polygon' as SupportedChain, name: 'Polygon', icon: '🟣' },
    { key: 'base' as SupportedChain, name: 'Base', icon: '🔵' },
    { key: 'optimism' as SupportedChain, name: 'Optimism', icon: '🔴' }
  ]

  const createSmartWallet = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsCreating(true)
    try {
      const smartWalletClient = await alchemySmartWalletService.createSmartWallet({
        type: selectedType,
        chain: selectedChain,
        ownerAddress: address as any
      })

      alchemySmartWalletService.setCurrentClient(smartWalletClient)
      setSmartWalletAddress(smartWalletClient.address)
      
      // Get balance
      const balance = await alchemySmartWalletService.getBalance()
      setSmartWalletBalance(formatSmartWalletBalance(balance))

      toast.success(`${getSmartWalletTypeDisplayName(selectedType)} created successfully!`)
    } catch (error: any) {
      console.error('Failed to create smart wallet:', error)
      toast.error(`Failed to create smart wallet: ${error.message}`)
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopyAddress = () => {
    if (smartWalletAddress) {
      navigator.clipboard.writeText(smartWalletAddress)
      toast.success('Smart wallet address copied to clipboard')
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please connect your wallet to create a smart wallet
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Create Your Smart Wallet
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose from our selection of smart wallet types to enhance your Web3 experience 
            with advanced features and security.
          </p>
        </motion.div>

        {/* Connected Wallet Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Connected Wallet
              </h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                  {shortAddress}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  Balance: {formattedBalance} ETH
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                Connected
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Smart Wallet Types */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Smart Wallet Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {smartWalletTypes.map((wallet, index) => {
                const Icon = wallet.icon
                return (
                  <motion.div
                    key={wallet.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedType === wallet.type
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedType(wallet.type)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                        <Icon className={`h-6 w-6 ${wallet.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {wallet.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {wallet.description}
                        </p>
                        <ul className="space-y-1">
                          {wallet.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Configuration
              </h3>

              {/* Network Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Network
                </label>
                <select
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value as SupportedChain)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {chains.map((chain) => (
                    <option key={chain.key} value={chain.key}>
                      {chain.icon} {chain.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Advanced Options */}
              <div className="mb-6">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Advanced Options
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>
                
                {showAdvanced && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Advanced configuration options will be available here for power users.
                    </p>
                  </div>
                )}
              </div>

              {/* Create Button */}
              <button
                onClick={createSmartWallet}
                disabled={isCreating}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Create Smart Wallet</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Smart Wallet Info */}
              {smartWalletAddress && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                    Smart Wallet Created!
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-700 dark:text-green-300">Address:</span>
                      <button
                        onClick={handleCopyAddress}
                        className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                      >
                        <span className="font-mono">{formatSmartWalletAddress(smartWalletAddress)}</span>
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-700 dark:text-green-300">Balance:</span>
                      <span className="text-xs font-medium text-green-800 dark:text-green-200">
                        {smartWalletBalance} ETH
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-700 dark:text-green-300">Type:</span>
                      <span className="text-xs font-medium text-green-800 dark:text-green-200">
                        {getSmartWalletTypeDisplayName(selectedType)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartWalletPage
