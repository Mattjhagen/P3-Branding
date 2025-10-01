import { ethers } from 'ethers';
import { Web3Config, WalletConnection, Transaction } from '@/types';

// Web3 configuration
export const web3Config: Web3Config = {
  networkId: 1, // Ethereum mainnet
  rpcUrl: process.env.VITE_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo',
  chainId: 1,
  blockExplorer: 'https://etherscan.io',
  contracts: {
    loanEscrow: process.env.VITE_LOAN_ESCROW_ADDRESS || '',
    reputation: process.env.VITE_REPUTATION_ADDRESS || '',
    insurance: process.env.VITE_INSURANCE_ADDRESS || '',
    governance: process.env.VITE_GOVERNANCE_ADDRESS || '',
  }
};

// Web3 service class
export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private walletConnection: WalletConnection | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.walletConnection = {
        address: '',
        chainId: 0,
        isConnected: false,
        provider: this.provider
      };
    }
  }

  // Connect wallet
  async connectWallet(): Promise<WalletConnection> {
    if (!this.provider) {
      throw new Error('Web3 provider not available');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Get signer
      this.signer = await this.provider.getSigner();
      const address = await this.signer.getAddress();
      const network = await this.provider.getNetwork();

      this.walletConnection = {
        address,
        chainId: Number(network.chainId),
        isConnected: true,
        provider: this.provider,
        signer: this.signer
      };

      return this.walletConnection;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw new Error('Failed to connect wallet');
    }
  }

  // Disconnect wallet
  disconnectWallet() {
    this.signer = null;
    this.walletConnection = {
      address: '',
      chainId: 0,
      isConnected: false,
      provider: this.provider
    };
  }

  // Get current wallet connection
  getWalletConnection(): WalletConnection | null {
    return this.walletConnection;
  }

  // Check if wallet is connected
  isWalletConnected(): boolean {
    return this.walletConnection?.isConnected || false;
  }

  // Switch network
  async switchNetwork(chainId: number): Promise<void> {
    if (!window.ethereum) {
      throw new Error('Web3 provider not available');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        await this.addNetwork(chainId);
      } else {
        throw error;
      }
    }
  }

  // Add network
  private async addNetwork(chainId: number): Promise<void> {
    const networkConfig = this.getNetworkConfig(chainId);
    
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkConfig],
    });
  }

  // Get network configuration
  private getNetworkConfig(chainId: number) {
    const networks = {
      1: {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: [web3Config.rpcUrl],
        blockExplorerUrls: [web3Config.blockExplorer],
      },
      137: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://polygonscan.com'],
      },
      56: {
        chainId: '0x38',
        chainName: 'BSC Mainnet',
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
        },
        rpcUrls: ['https://bsc-dataseed.binance.org'],
        blockExplorerUrls: ['https://bscscan.com'],
      },
    };

    return networks[chainId as keyof typeof networks];
  }

  // Get balance
  async getBalance(address?: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Web3 provider not available');
    }

    const targetAddress = address || this.walletConnection?.address;
    if (!targetAddress) {
      throw new Error('No address provided');
    }

    const balance = await this.provider.getBalance(targetAddress);
    return ethers.formatEther(balance);
  }

  // Send transaction
  async sendTransaction(transaction: {
    to: string;
    value?: string;
    data?: string;
    gasLimit?: string;
    gasPrice?: string;
  }): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const tx = await this.signer.sendTransaction({
      to: transaction.to,
      value: transaction.value ? ethers.parseEther(transaction.value) : 0,
      data: transaction.data,
      gasLimit: transaction.gasLimit,
      gasPrice: transaction.gasPrice,
    });

    return tx;
  }

  // Wait for transaction confirmation
  async waitForTransaction(txHash: string, confirmations: number = 1): Promise<ethers.TransactionReceipt> {
    if (!this.provider) {
      throw new Error('Web3 provider not available');
    }

    return await this.provider.waitForTransaction(txHash, confirmations);
  }

  // Get transaction receipt
  async getTransactionReceipt(txHash: string): Promise<ethers.TransactionReceipt | null> {
    if (!this.provider) {
      throw new Error('Web3 provider not available');
    }

    return await this.provider.getTransactionReceipt(txHash);
  }

  // Get block number
  async getBlockNumber(): Promise<number> {
    if (!this.provider) {
      throw new Error('Web3 provider not available');
    }

    return await this.provider.getBlockNumber();
  }

  // Estimate gas
  async estimateGas(transaction: {
    to: string;
    value?: string;
    data?: string;
  }): Promise<bigint> {
    if (!this.provider) {
      throw new Error('Web3 provider not available');
    }

    return await this.provider.estimateGas({
      to: transaction.to,
      value: transaction.value ? ethers.parseEther(transaction.value) : 0,
      data: transaction.data,
    });
  }

  // Get gas price
  async getGasPrice(): Promise<bigint> {
    if (!this.provider) {
      throw new Error('Web3 provider not available');
    }

    return await this.provider.getGasPrice();
  }

  // Sign message
  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    return await this.signer.signMessage(message);
  }

  // Sign typed data (EIP-712)
  async signTypedData(domain: any, types: any, value: any): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    return await this.signer.signTypedData(domain, types, value);
  }

  // Listen for account changes
  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }

  // Listen for chain changes
  onChainChanged(callback: (chainId: string) => void): void {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback);
    }
  }

  // Remove event listeners
  removeAllListeners(): void {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
  }

  // Format address
  formatAddress(address: string, length: number = 6): string {
    if (!address) return '';
    return `${address.slice(0, length)}...${address.slice(-length)}`;
  }

  // Validate address
  isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  // Convert wei to ether
  formatEther(wei: string | bigint): string {
    return ethers.formatEther(wei);
  }

  // Convert ether to wei
  parseEther(ether: string): bigint {
    return ethers.parseEther(ether);
  }

  // Get contract instance
  getContract(address: string, abi: any): ethers.Contract {
    if (!this.provider) {
      throw new Error('Web3 provider not available');
    }

    return new ethers.Contract(address, abi, this.signer || this.provider);
  }

  // Get contract with signer
  getContractWithSigner(address: string, abi: any): ethers.Contract {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    return new ethers.Contract(address, abi, this.signer);
  }
}

// Create singleton instance
export const web3Service = new Web3Service();

// Utility functions
export const formatAddress = (address: string, length: number = 6): string => {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

export const formatCurrency = (amount: number, currency: string = 'BTC'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'BTC' ? 'USD' : currency,
    minimumFractionDigits: currency === 'BTC' ? 8 : 2,
    maximumFractionDigits: currency === 'BTC' ? 8 : 2,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

export const formatDuration = (days: number): string => {
  if (days < 30) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(days / 365);
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
};

// Error handling
export class Web3Error extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'Web3Error';
  }
}

export const handleWeb3Error = (error: any): string => {
  if (error.code === 4001) {
    return 'User rejected the transaction';
  } else if (error.code === -32602) {
    return 'Invalid parameters provided';
  } else if (error.code === -32603) {
    return 'Internal JSON-RPC error';
  } else if (error.message?.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  } else if (error.message?.includes('gas required exceeds allowance')) {
    return 'Gas limit too low';
  } else if (error.message?.includes('nonce too low')) {
    return 'Transaction nonce too low';
  } else {
    return error.message || 'An unknown error occurred';
  }
};
