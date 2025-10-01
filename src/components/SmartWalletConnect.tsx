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
import { Wallet, Plus, Settings, Copy, ExternalLink, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

interface SmartWalletConnectProps {
  className?: string
  showBalance?: boolean
  showNetwork?: boolean
}

export const SmartWalletConnect: React.FC<SmartWalletConnectProps> = ({ 
  className = '', 
  showBalance = true, 
  showNetwork = true 
}) => {
  const {
    isConnected,
    isConnecting,
    address,
    chainId,
    formattedBalance,
    shortAddress,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    error
  } = useReownWeb3()

  const [smartWalletType, setSmartWalletType] = useState<SmartWalletType>('light')
  const [selectedChain, setSelectedChain] = useState<SupportedChain>('mainnet')
  const [isCreatingSmartWallet, setIsCreatingSmartWallet] = useState(false)
  const [showSmartWalletOptions, setShowSmartWalletOptions] = useState(false)
  const [smartWalletAddress, setSmartWalletAddress] = useState<string | null>(null)
  const [smartWalletBalance, setSmartWalletBalance] = useState<string>('0')

  // Create smart wallet when regular wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      createSmartWallet()
    } else {
      setSmartWalletAddress(null)
      setSmartWalletBalance('0')
    }
  }, [isConnected, address, smartWalletType, selectedChain])

  const createSmartWallet = async () => {
    if (!isConnected || !address) return

    setIsCreatingSmartWallet(true)
    try {
      const smartWalletClient = await alchemySmartWalletService.createSmartWallet({
        type: smartWalletType,
        chain: selectedChain,
        ownerAddress: address as any
      })

      alchemySmartWalletService.setCurrentClient(smartWalletClient)
      setSmartWalletAddress(smartWalletClient.address)
      
      // Get balance
      const balance = await alchemySmartWalletService.getBalance()
      setSmartWalletBalance(formatSmartWalletBalance(balance))

      toast.success(`${getSmartWalletTypeDisplayName(smartWalletType)} created successfully!`)
    } catch (error: any) {
      console.error('Failed to create smart wallet:', error)
      toast.error(`Failed to create smart wallet: ${error.message}`)
    } finally {
      setIsCreatingSmartWallet(false)
    }
  }

  const handleConnect = async () => {
    try {
      await connectWallet()
      toast.success('Wallet connected successfully!')
    } catch (error: any) {
      console.error('Connection error:', error)
      toast.error('Failed to connect wallet')
    }
  }

  const handleDisconnect = () => {
    alchemySmartWalletService.disconnect()
    disconnectWallet()
    toast.success('Wallet disconnected')
  }

  const handleCopyAddress = () => {
    const addressToCopy = smartWalletAddress || address
    if (addressToCopy) {
      navigator.clipboard.writeText(addressToCopy)
      toast.success('Address copied to clipboard')
    }
  }

  const handleSwitchNetwork = async (newChainId: number) => {
    try {
      await switchNetwork(newChainId)
      toast.success('Network switched successfully')
    } catch (error: any) {
      console.error('Network switch error:', error)
      toast.error('Failed to switch network')
    }
  }

  const handleSmartWalletTypeChange = (type: SmartWalletType) => {
    setSmartWalletType(type)
    setShowSmartWalletOptions(false)
  }

  const handleChainChange = (chain: SupportedChain) => {
    setSelectedChain(chain)
    setShowSmartWalletOptions(false)
  }

  if (isConnecting || isCreatingSmartWallet) {
    return (
      <button
        disabled
        className={`${className} flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg cursor-not-allowed`}
      >
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span>{isCreatingSmartWallet ? 'Creating Smart Wallet...' : 'Connecting...'}</span>
      </button>
    )
  }

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        className={`${className} flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors`}
      >
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </button>
    )
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Network Badge */}
      {showNetwork && (
        <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {getChainDisplayName(selectedChain)}
          </span>
        </div>
      )}

      {/* Smart Wallet Type Selector */}
      <div className="relative">
        <button
          onClick={() => setShowSmartWalletOptions(!showSmartWalletOptions)}
          className="flex items-center space-x-2 px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
        >
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
            {getSmartWalletTypeDisplayName(smartWalletType)}
          </span>
          <ChevronDown className="h-3 w-3 text-purple-600 dark:text-purple-400" />
        </button>

        {showSmartWalletOptions && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
                Smart Wallet Type
              </div>
              {alchemySmartWalletService.getSmartWalletTypes().map((type) => (
                <button
                  key={type}
                  onClick={() => handleSmartWalletTypeChange(type)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    smartWalletType === type
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {getSmartWalletTypeDisplayName(type)}
                </button>
              ))}
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
                Network
              </div>
              {Object.keys(alchemySmartWalletService.getSupportedChains()).map((chain) => (
                <button
                  key={chain}
                  onClick={() => handleChainChange(chain as SupportedChain)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedChain === chain
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {getChainDisplayName(chain as SupportedChain)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Balance */}
      {showBalance && smartWalletAddress && (
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {smartWalletBalance} ETH
        </div>
      )}

      {/* Smart Wallet Address */}
      {smartWalletAddress && (
        <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full">
          <span className="text-sm font-mono text-green-700 dark:text-green-300">
            {formatSmartWalletAddress(smartWalletAddress)}
          </span>
          <button
            onClick={handleCopyAddress}
            className="p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded transition-colors"
            title="Copy smart wallet address"
          >
            <Copy className="h-3 w-3 text-green-600 dark:text-green-400" />
          </button>
        </div>
      )}

      {/* Regular Wallet Address */}
      <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
        <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
          {shortAddress}
        </span>
        <button
          onClick={handleCopyAddress}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Copy owner address"
        >
          <Copy className="h-3 w-3 text-gray-500" />
        </button>
      </div>

      {/* Disconnect Button */}
      <button
        onClick={handleDisconnect}
        className="flex items-center space-x-1 px-3 py-1 border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Settings className="h-4 w-4" />
        <span>Disconnect</span>
      </button>
    </div>
  )
}

export default SmartWalletConnect
