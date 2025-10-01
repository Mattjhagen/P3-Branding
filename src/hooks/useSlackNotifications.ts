// React hook for Slack notifications
import { useCallback } from 'react';
import slackWebhook, { SlackNotification } from '../services/slackWebhook';

export const useSlackNotifications = () => {
  const sendNotification = useCallback(async (notification: SlackNotification) => {
    try {
      return await slackWebhook.sendNotification(notification);
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
      return false;
    }
  }, []);

  const notifyLoanCreated = useCallback(async (loanData: {
    amount: string;
    interestRate: string;
    borrower: string;
    loanId: string;
  }) => {
    return await slackWebhook.notifyLoanCreated(loanData);
  }, []);

  const notifyLoanFunded = useCallback(async (loanData: {
    amount: string;
    lender: string;
    loanId: string;
  }) => {
    return await slackWebhook.notifyLoanFunded(loanData);
  }, []);

  const notifyPaymentReceived = useCallback(async (paymentData: {
    amount: string;
    loanId: string;
    borrower: string;
  }) => {
    return await slackWebhook.notifyPaymentReceived(paymentData);
  }, []);

  const notifySecurityAlert = useCallback(async (alertData: {
    type: string;
    description: string;
    userId?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }) => {
    return await slackWebhook.notifySecurityAlert(alertData);
  }, []);

  const notifySystemStatus = useCallback(async (status: {
    component: string;
    status: 'up' | 'down' | 'degraded';
    message: string;
  }) => {
    return await slackWebhook.notifySystemStatus(status);
  }, []);

  return {
    sendNotification,
    notifyLoanCreated,
    notifyLoanFunded,
    notifyPaymentReceived,
    notifySecurityAlert,
    notifySystemStatus
  };
};
