import React from 'react'
import { useReownWeb3 } from '@/services/reownWeb3'
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

interface WalletConnectProps {
  className?: string
  showBalance?: boolean
  showNetwork?: boolean
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ 
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
    disconnectWallet()
    toast.success('Wallet disconnected')
  }

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
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

  if (isConnecting) {
    return (
      <button
        disabled
        className={`${className} flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg cursor-not-allowed`}
      >
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span>Connecting...</span>
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
            {chainId === 1 ? 'Ethereum' : 
             chainId === 137 ? 'Polygon' :
             chainId === 42161 ? 'Arbitrum' :
             chainId === 8453 ? 'Base' :
             chainId === 10 ? 'Optimism' : `Chain ${chainId}`}
          </span>
        </div>
      )}

      {/* Balance */}
      {showBalance && (
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {formattedBalance}
        </div>
      )}

      {/* Address */}
      <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
        <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
          {shortAddress}
        </span>
        <button
          onClick={handleCopyAddress}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Copy address"
        >
          <Copy className="h-3 w-3 text-gray-500" />
        </button>
      </div>

      {/* Disconnect Button */}
      <button
        onClick={handleDisconnect}
        className="flex items-center space-x-1 px-3 py-1 border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
      >
        <LogOut className="h-4 w-4" />
        <span>Disconnect</span>
      </button>
    </div>
  )
}

export default WalletConnect
