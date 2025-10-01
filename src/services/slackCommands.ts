// Slack Commands Service for P³ Lending Platform
// Handles slash command processing and responses

export interface SlackCommandRequest {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  response_url: string;
  trigger_id: string;
}

export interface TipRequest {
  recipient: string;
  amount: string;
  message?: string;
  sender: string;
}

export interface LoanStatusRequest {
  loanId: string;
  userId: string;
}

class SlackCommandsService {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.p3lending.com';
  }

  // Process incoming slash commands
  async processCommand(request: SlackCommandRequest): Promise<any> {
    const { command, text, user_id, user_name, response_url } = request;

    try {
      switch (command) {
        case '/loan-status':
          return await this.handleLoanStatus(text, user_id, response_url);
        
        case '/tip':
          return await this.handleTip(text, user_id, user_name, response_url);
        
        case '/create-loan':
          return await this.handleCreateLoan(text, user_id, user_name, response_url);
        
        case '/portfolio':
          return await this.handlePortfolio(text, user_id, response_url);
        
        case '/reputation':
          return await this.handleReputation(text, user_id, response_url);
        
        case '/market':
          return await this.handleMarket(text, user_id, response_url);
        
        default:
          return this.sendErrorResponse('Unknown command', response_url);
      }
    } catch (error) {
      console.error('Error processing command:', error);
      return this.sendErrorResponse('An error occurred processing your command', response_url);
    }
  }

  // Handle /loan-status command
  private async handleLoanStatus(loanId: string, userId: string, responseUrl: string) {
    if (!loanId.trim()) {
      return this.sendErrorResponse('Please provide a loan ID. Usage: `/loan-status LOAN-001`', responseUrl);
    }

    try {
      // Fetch loan data from your API
      const response = await fetch(`${this.apiBaseUrl}/loans/${loanId}`, {
        headers: {
          'Authorization': `Bearer ${userId}`, // You'll need to implement proper auth
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return this.sendErrorResponse(`Loan ${loanId} not found or access denied`, responseUrl);
      }

      const loan = await response.json();
      
      const message = {
        response_type: 'in_channel',
        text: `📊 Loan Status: ${loanId}`,
        attachments: [
          {
            color: this.getLoanStatusColor(loan.status),
            fields: [
              { title: 'Amount', value: loan.amount, short: true },
              { title: 'Interest Rate', value: loan.interestRate, short: true },
              { title: 'Status', value: loan.status.toUpperCase(), short: true },
              { title: 'Borrower', value: loan.borrower, short: true },
              { title: 'Lender', value: loan.lender || 'Not funded', short: true },
              { title: 'Created', value: new Date(loan.createdAt).toLocaleDateString(), short: true }
            ],
            footer: 'P³ Lending Platform',
            footer_icon: 'https://p3lending.space/logo.jpeg',
            ts: Math.floor(Date.now() / 1000)
          }
        ]
      };

      return this.sendResponse(message, responseUrl);
    } catch (error) {
      return this.sendErrorResponse('Failed to fetch loan information', responseUrl);
    }
  }

  // Handle /tip command
  private async handleTip(text: string, userId: string, userName: string, responseUrl: string) {
    const parts = text.trim().split(' ');
    
    if (parts.length < 2) {
      return this.sendErrorResponse(
        'Usage: `/tip @user amount [message]`\nExample: `/tip @john 0.001 Thanks for the help!`',
        responseUrl
      );
    }

    const recipient = parts[0];
    const amount = parts[1];
    const message = parts.slice(2).join(' ') || '';

    // Validate amount
    if (!this.isValidAmount(amount)) {
      return this.sendErrorResponse('Invalid amount. Please use format like 0.001 or 1000 sats', responseUrl);
    }

    try {
      // Process the tip transaction
      const tipData: TipRequest = {
        recipient: recipient.replace('@', ''),
        amount,
        message,
        sender: userId
      };

      const response = await fetch(`${this.apiBaseUrl}/tips`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tipData)
      });

      if (!response.ok) {
        const error = await response.json();
        return this.sendErrorResponse(error.message || 'Failed to process tip', responseUrl);
      }

      const result = await response.json();

      const successMessage = {
        response_type: 'in_channel',
        text: `💰 Tip sent successfully!`,
        attachments: [
          {
            color: '#36a64f',
            fields: [
              { title: 'From', value: userName, short: true },
              { title: 'To', value: recipient, short: true },
              { title: 'Amount', value: `${amount} BTC`, short: true },
              { title: 'Transaction ID', value: result.txId, short: false },
              ...(message ? [{ title: 'Message', value: message, short: false }] : [])
            ],
            footer: 'P³ Lending Platform',
            footer_icon: 'https://p3lending.space/logo.jpeg',
            ts: Math.floor(Date.now() / 1000)
          }
        ]
      };

      return this.sendResponse(successMessage, responseUrl);
    } catch (error) {
      return this.sendErrorResponse('Failed to process tip transaction', responseUrl);
    }
  }

  // Handle /create-loan command
  private async handleCreateLoan(text: string, userId: string, userName: string, responseUrl: string) {
    const parts = text.trim().split(' ');
    
    if (parts.length < 3) {
      return this.sendErrorResponse(
        'Usage: `/create-loan amount interest-rate duration`\nExample: `/create-loan 0.5 8.5% 30days`',
        responseUrl
      );
    }

    const amount = parts[0];
    const interestRate = parts[1];
    const duration = parts[2];

    try {
      const loanData = {
        amount,
        interestRate,
        duration,
        borrower: userId,
        borrowerName: userName
      };

      const response = await fetch(`${this.apiBaseUrl}/loans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loanData)
      });

      if (!response.ok) {
        const error = await response.json();
        return this.sendErrorResponse(error.message || 'Failed to create loan', responseUrl);
      }

      const result = await response.json();

      const successMessage = {
        response_type: 'in_channel',
        text: `💰 New loan request created!`,
        attachments: [
          {
            color: '#36a64f',
            fields: [
              { title: 'Loan ID', value: result.loanId, short: true },
              { title: 'Amount', value: amount, short: true },
              { title: 'Interest Rate', value: interestRate, short: true },
              { title: 'Duration', value: duration, short: true },
              { title: 'Borrower', value: userName, short: true },
              { title: 'Status', value: 'PENDING', short: true }
            ],
            footer: 'P³ Lending Platform',
            footer_icon: 'https://p3lending.space/logo.jpeg',
            ts: Math.floor(Date.now() / 1000)
          }
        ]
      };

      return this.sendResponse(successMessage, responseUrl);
    } catch (error) {
      return this.sendErrorResponse('Failed to create loan request', responseUrl);
    }
  }

  // Handle /portfolio command
  private async handlePortfolio(text: string, userId: string, responseUrl: string) {
    const type = text.trim().toLowerCase() || 'all';
    
    if (!['lending', 'borrowing', 'all'].includes(type)) {
      return this.sendErrorResponse(
        'Usage: `/portfolio [type]`\nTypes: lending, borrowing, or all\nExample: `/portfolio lending`',
        responseUrl
      );
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/portfolio?userId=${userId}&type=${type}`, {
        headers: {
          'Authorization': `Bearer ${userId}`
        }
      });

      if (!response.ok) {
        return this.sendErrorResponse('Failed to fetch portfolio data', responseUrl);
      }

      const portfolio = await response.json();

      const message = {
        response_type: 'ephemeral',
        text: `📊 Your ${type} Portfolio`,
        attachments: [
          {
            color: '#36a64f',
            fields: [
              { title: 'Total Value', value: portfolio.totalValue, short: true },
              { title: 'Active Loans', value: portfolio.activeLoans.toString(), short: true },
              { title: 'Completed Loans', value: portfolio.completedLoans.toString(), short: true },
              { title: 'Total Earned', value: portfolio.totalEarned, short: true },
              { title: 'Total Borrowed', value: portfolio.totalBorrowed, short: true },
              { title: 'Success Rate', value: `${portfolio.successRate}%`, short: true }
            ],
            footer: 'P³ Lending Platform',
            footer_icon: 'https://p3lending.space/logo.jpeg',
            ts: Math.floor(Date.now() / 1000)
          }
        ]
      };

      return this.sendResponse(message, responseUrl);
    } catch (error) {
      return this.sendErrorResponse('Failed to fetch portfolio information', responseUrl);
    }
  }

  // Handle /reputation command
  private async handleReputation(text: string, userId: string, responseUrl: string) {
    const userAddress = text.trim();
    
    if (!userAddress) {
      return this.sendErrorResponse(
        'Usage: `/reputation [user-address]`\nExample: `/reputation 0x1234...5678`',
        responseUrl
      );
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/reputation/${userAddress}`, {
        headers: {
          'Authorization': `Bearer ${userId}`
        }
      });

      if (!response.ok) {
        return this.sendErrorResponse('User not found or reputation data unavailable', responseUrl);
      }

      const reputation = await response.json();

      const color = reputation.score >= 80 ? '#36a64f' : 
                   reputation.score >= 60 ? '#ff9500' : '#ff0000';

      const message = {
        response_type: 'in_channel',
        text: `⭐ Reputation Score`,
        attachments: [
          {
            color,
            fields: [
              { title: 'User', value: userAddress, short: true },
              { title: 'Score', value: `${reputation.score}/100`, short: true },
              { title: 'Level', value: reputation.level, short: true },
              { title: 'Total Loans', value: reputation.totalLoans.toString(), short: true },
              { title: 'Successful Loans', value: reputation.successfulLoans.toString(), short: true },
              { title: 'Default Rate', value: `${reputation.defaultRate}%`, short: true }
            ],
            footer: 'P³ Lending Platform',
            footer_icon: 'https://p3lending.space/logo.jpeg',
            ts: Math.floor(Date.now() / 1000)
          }
        ]
      };

      return this.sendResponse(message, responseUrl);
    } catch (error) {
      return this.sendErrorResponse('Failed to fetch reputation information', responseUrl);
    }
  }

  // Handle /market command
  private async handleMarket(text: string, userId: string, responseUrl: string) {
    const filter = text.trim().toLowerCase() || 'available';
    
    if (!['available', 'funded', 'all'].includes(filter)) {
      return this.sendErrorResponse(
        'Usage: `/market [filter]`\nFilters: available, funded, or all\nExample: `/market available`',
        responseUrl
      );
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/market?filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${userId}`
        }
      });

      if (!response.ok) {
        return this.sendErrorResponse('Failed to fetch market data', responseUrl);
      }

      const market = await response.json();

      const message = {
        response_type: 'in_channel',
        text: `📈 Market Overview - ${filter.toUpperCase()}`,
        attachments: [
          {
            color: '#36a64f',
            fields: [
              { title: 'Total Loans', value: market.totalLoans.toString(), short: true },
              { title: 'Average Rate', value: market.averageRate, short: true },
              { title: 'Total Volume', value: market.totalVolume, short: true },
              { title: 'Active Lenders', value: market.activeLenders.toString(), short: true },
              { title: 'Active Borrowers', value: market.activeBorrowers.toString(), short: true },
              { title: 'Success Rate', value: `${market.successRate}%`, short: true }
            ],
            footer: 'P³ Lending Platform',
            footer_icon: 'https://p3lending.space/logo.jpeg',
            ts: Math.floor(Date.now() / 1000)
          }
        ]
      };

      // Add top loans if available
      if (market.topLoans && market.topLoans.length > 0) {
        const topLoansText = market.topLoans
          .slice(0, 3)
          .map((loan: any, index: number) => 
            `${index + 1}. ${loan.amount} @ ${loan.interestRate} (${loan.duration})`
          )
          .join('\n');

        message.attachments.push({
          color: '#ff9500',
          title: 'Top Available Loans',
          text: topLoansText,
          footer: 'P³ Lending Platform',
          footer_icon: 'https://p3lending.space/logo.jpeg',
          ts: Math.floor(Date.now() / 1000)
        });
      }

      return this.sendResponse(message, responseUrl);
    } catch (error) {
      return this.sendErrorResponse('Failed to fetch market information', responseUrl);
    }
  }

  // Helper methods
  private getLoanStatusColor(status: string): string {
    const colors = {
      'pending': '#ff9500',
      'funded': '#36a64f',
      'active': '#36a64f',
      'completed': '#36a64f',
      'defaulted': '#ff0000',
      'cancelled': '#808080'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  }

  private isValidAmount(amount: string): boolean {
    // Check if amount is a valid number and positive
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
  }

  private async sendResponse(message: any, responseUrl: string) {
    try {
      const response = await fetch(responseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        console.error('Failed to send Slack response:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending Slack response:', error);
    }
  }

  private async sendErrorResponse(errorMessage: string, responseUrl: string) {
    const errorResponse = {
      response_type: 'ephemeral', // Only visible to the user who sent the command
      text: `❌ Error: ${errorMessage}`
    };

    return this.sendResponse(errorResponse, responseUrl);
  }
}

export default new SlackCommandsService();
