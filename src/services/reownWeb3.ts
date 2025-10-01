import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { WalletConnection } from '@/types'

// Custom hook for Reown Web3 integration
export const useReownWeb3 = () => {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount()
  const { connect, connectors, error, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { open } = useAppKit()

  // Convert to our WalletConnection type
  const walletConnection: WalletConnection | null = isConnected ? {
    address: address || '',
    chainId: chainId,
    isConnected: isConnected,
    provider: null, // Reown handles provider internally
    balance: balance ? balance.formatted : '0'
  } : null

  // Connect wallet using Reown modal
  const connectWallet = async () => {
    try {
      open()
    } catch (error) {
      console.error('Failed to open Reown modal:', error)
      throw error
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    disconnect()
  }

  // Switch network
  const switchNetwork = async (newChainId: number) => {
    try {
      await switchChain({ chainId: newChainId })
    } catch (error) {
      console.error('Failed to switch network:', error)
      throw error
    }
  }

  // Get formatted balance
  const getFormattedBalance = () => {
    if (!balance) return '0'
    return `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
  }

  // Get short address
  const getShortAddress = (length: number = 6) => {
    if (!address) return ''
    return `${address.slice(0, length)}...${address.slice(-length)}`
  }

  return {
    // Connection state
    isConnected,
    isConnecting,
    isDisconnected,
    walletConnection,
    
    // Account info
    address,
    chainId,
    balance: balance ? balance.formatted : '0',
    formattedBalance: getFormattedBalance(),
    shortAddress: getShortAddress(),
    
    // Actions
    connectWallet,
    disconnectWallet,
    switchNetwork,
    
    // Utils
    getShortAddress,
    
    // Error handling
    error,
    isPending
  }
}

// Utility functions for Reown integration
export const formatAddress = (address: string, length: number = 6): string => {
  if (!address) return ''
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

export const formatBalance = (balance: string, decimals: number = 4): string => {
  if (!balance) return '0'
  return parseFloat(balance).toFixed(decimals)
}

export const formatCurrency = (amount: number, currency: string = 'ETH'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'ETH' ? 'USD' : currency,
    minimumFractionDigits: currency === 'ETH' ? 4 : 2,
    maximumFractionDigits: currency === 'ETH' ? 4 : 2,
  }).format(amount)
}

// Network configurations for Reown
export const SUPPORTED_NETWORKS = {
  1: {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/demo',
    blockExplorer: 'https://etherscan.io',
    icon: '/networks/ethereum.svg'
  },
  137: {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    icon: '/networks/polygon.svg'
  },
  42161: {
    id: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    icon: '/networks/arbitrum.svg'
  },
  8453: {
    id: 8453,
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    icon: '/networks/base.svg'
  },
  10: {
    id: 10,
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
    icon: '/networks/optimism.svg'
  }
}

// Get network info by chain ID
export const getNetworkInfo = (chainId: number) => {
  return SUPPORTED_NETWORKS[chainId as keyof typeof SUPPORTED_NETWORKS] || null
}

// Error handling for Reown
export class ReownError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'ReownError'
  }
}

export const handleReownError = (error: any): string => {
  if (error.code === 4001) {
    return 'User rejected the connection request'
  } else if (error.code === -32602) {
    return 'Invalid parameters provided'
  } else if (error.code === -32603) {
    return 'Internal JSON-RPC error'
  } else if (error.message?.includes('User rejected')) {
    return 'Connection was rejected by user'
  } else if (error.message?.includes('Already processing')) {
    return 'Connection request already in progress'
  } else {
    return error.message || 'An unknown error occurred'
  }
}
