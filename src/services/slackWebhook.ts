// Slack Webhook Service for P³ Lending Platform
// Handles event notifications to Slack channels

export interface SlackNotification {
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  fields?: Array<{
    title: string;
    value: string;
    short?: boolean;
  }>;
  actionUrl?: string;
}

export interface SlackWebhookConfig {
  webhookUrl: string;
  channel?: string;
  username?: string;
  iconEmoji?: string;
}

class SlackWebhookService {
  private config: SlackWebhookConfig;

  constructor(config: SlackWebhookConfig) {
    this.config = config;
  }

  private getColorForType(type: string): string {
    const colors = {
      success: '#36a64f',  // Green
      warning: '#ff9500',  // Orange
      error: '#ff0000',    // Red
      info: '#36a64f'      // Blue
    };
    return colors[type as keyof typeof colors] || colors.info;
  }

  private getEmojiForType(type: string): string {
    const emojis = {
      success: '✅',
      warning: '⚠️',
      error: '🚨',
      info: 'ℹ️'
    };
    return emojis[type as keyof typeof emojis] || emojis.info;
  }

  async sendNotification(notification: SlackNotification): Promise<boolean> {
    const payload = {
      channel: this.config.channel,
      username: this.config.username || 'P³ Lending Bot',
      icon_emoji: this.config.iconEmoji || ':robot_face:',
      text: `${this.getEmojiForType(notification.type)} P³ Lending Notification`,
      attachments: [
        {
          color: this.getColorForType(notification.type),
          title: notification.title || 'P³ Lending Platform',
          title_link: notification.actionUrl || 'https://p3lending.space',
          text: notification.message,
          fields: notification.fields || [],
          footer: 'P³ Lending Platform',
          footer_icon: 'https://p3lending.space/logo.jpeg',
          ts: Math.floor(Date.now() / 1000)
        }
      ]
    };

    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('✅ Slack notification sent successfully');
        return true;
      } else {
        console.error('❌ Failed to send Slack notification:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending Slack notification:', error);
      return false;
    }
  }

  // Predefined notification methods for common events
  async notifyLoanCreated(loanData: {
    amount: string;
    interestRate: string;
    borrower: string;
    loanId: string;
  }): Promise<boolean> {
    return this.sendNotification({
      message: `New loan request created`,
      type: 'info',
      title: 'New Loan Request',
      fields: [
        { title: 'Amount', value: loanData.amount, short: true },
        { title: 'Interest Rate', value: loanData.interestRate, short: true },
        { title: 'Borrower', value: loanData.borrower, short: true },
        { title: 'Loan ID', value: loanData.loanId, short: true }
      ],
      actionUrl: `https://p3lending.space/loans/${loanData.loanId}`
    });
  }

  async notifyLoanFunded(loanData: {
    amount: string;
    lender: string;
    loanId: string;
  }): Promise<boolean> {
    return this.sendNotification({
      message: `Loan has been funded successfully`,
      type: 'success',
      title: 'Loan Funded',
      fields: [
        { title: 'Amount', value: loanData.amount, short: true },
        { title: 'Lender', value: loanData.lender, short: true },
        { title: 'Loan ID', value: loanData.loanId, short: true }
      ],
      actionUrl: `https://p3lending.space/loans/${loanData.loanId}`
    });
  }

  async notifyPaymentReceived(paymentData: {
    amount: string;
    loanId: string;
    borrower: string;
  }): Promise<boolean> {
    return this.sendNotification({
      message: `Payment received for loan`,
      type: 'success',
      title: 'Payment Received',
      fields: [
        { title: 'Amount', value: paymentData.amount, short: true },
        { title: 'Borrower', value: paymentData.borrower, short: true },
        { title: 'Loan ID', value: paymentData.loanId, short: true }
      ],
      actionUrl: `https://p3lending.space/loans/${paymentData.loanId}`
    });
  }

  async notifySecurityAlert(alertData: {
    type: string;
    description: string;
    userId?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }): Promise<boolean> {
    return this.sendNotification({
      message: `Security alert: ${alertData.description}`,
      type: 'error',
      title: `Security Alert - ${alertData.type}`,
      fields: [
        { title: 'Severity', value: alertData.severity.toUpperCase(), short: true },
        { title: 'Type', value: alertData.type, short: true },
        ...(alertData.userId ? [{ title: 'User ID', value: alertData.userId, short: true }] : [])
      ]
    });
  }

  async notifySystemStatus(status: {
    component: string;
    status: 'up' | 'down' | 'degraded';
    message: string;
  }): Promise<boolean> {
    const type = status.status === 'up' ? 'success' : 
                 status.status === 'down' ? 'error' : 'warning';
    
    return this.sendNotification({
      message: `System status update: ${status.message}`,
      type,
      title: `System Status - ${status.component}`,
      fields: [
        { title: 'Component', value: status.component, short: true },
        { title: 'Status', value: status.status.toUpperCase(), short: true }
      ]
    });
  }
}

// Create singleton instance
const slackWebhook = new SlackWebhookService({
  webhookUrl: import.meta.env.VITE_SLACK_WEBHOOK_URL || '',
  channel: import.meta.env.VITE_SLACK_CHANNEL,
  username: 'P³ Lending Bot',
  iconEmoji: ':robot_face:'
});

export default slackWebhook;
export { SlackWebhookService };
