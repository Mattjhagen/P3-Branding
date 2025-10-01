// Tip Service for P³ Lending Platform
// Handles micro-transactions between users

export interface TipTransaction {
  id: string;
  sender: string;
  recipient: string;
  amount: string;
  message?: string;
  txId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

export interface CreateTipRequest {
  recipient: string;
  amount: string;
  message?: string;
  sender: string;
}

class TipService {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.p3lending.com';
  }

  // Create a new tip transaction
  async createTip(request: CreateTipRequest): Promise<TipTransaction> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/tips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${request.sender}` // You'll need proper auth
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create tip');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating tip:', error);
      throw error;
    }
  }

  // Get tip history for a user
  async getTipHistory(userId: string, type: 'sent' | 'received' = 'sent'): Promise<TipTransaction[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/tips/history?userId=${userId}&type=${type}`, {
        headers: {
          'Authorization': `Bearer ${userId}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tip history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tip history:', error);
      throw error;
    }
  }

  // Get tip statistics for a user
  async getTipStats(userId: string): Promise<{
    totalSent: number;
    totalReceived: number;
    totalTips: number;
    averageTip: number;
  }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/tips/stats?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${userId}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tip stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tip stats:', error);
      throw error;
    }
  }

  // Validate tip amount
  validateAmount(amount: string): { isValid: boolean; error?: string } {
    const num = parseFloat(amount);
    
    if (isNaN(num)) {
      return { isValid: false, error: 'Amount must be a valid number' };
    }
    
    if (num <= 0) {
      return { isValid: false, error: 'Amount must be greater than 0' };
    }
    
    if (num < 0.00001) {
      return { isValid: false, error: 'Minimum tip amount is 0.00001 BTC (100 sats)' };
    }
    
    if (num > 1) {
      return { isValid: false, error: 'Maximum tip amount is 1 BTC' };
    }
    
    return { isValid: true };
  }

  // Format amount for display
  formatAmount(amount: string): string {
    const num = parseFloat(amount);
    
    if (num < 0.001) {
      return `${(num * 100000000).toFixed(0)} sats`;
    } else if (num < 1) {
      return `${(num * 1000).toFixed(3)} mBTC`;
    } else {
      return `${num.toFixed(6)} BTC`;
    }
  }

  // Convert between different units
  convertAmount(amount: string, fromUnit: 'btc' | 'sats' | 'mbtc', toUnit: 'btc' | 'sats' | 'mbtc'): string {
    const num = parseFloat(amount);
    let btcAmount: number;

    // Convert to BTC first
    switch (fromUnit) {
      case 'btc':
        btcAmount = num;
        break;
      case 'sats':
        btcAmount = num / 100000000;
        break;
      case 'mbtc':
        btcAmount = num / 1000;
        break;
      default:
        btcAmount = num;
    }

    // Convert to target unit
    switch (toUnit) {
      case 'btc':
        return btcAmount.toFixed(8);
      case 'sats':
        return (btcAmount * 100000000).toFixed(0);
      case 'mbtc':
        return (btcAmount * 1000).toFixed(3);
      default:
        return btcAmount.toFixed(8);
    }
  }
}

export default new TipService();
