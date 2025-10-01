// Tip Component for P³ Lending Platform
// Allows users to send micro-transactions to each other

import React, { useState } from 'react';
import tipService from '../services/tipService';
import { useSlackNotifications } from '../hooks/useSlackNotifications';

interface TipComponentProps {
  recipient?: string;
  onTipSent?: (tip: any) => void;
}

const TipComponent: React.FC<TipComponentProps> = ({ recipient: initialRecipient = '', onTipSent }) => {
  const [recipient, setRecipient] = useState(initialRecipient);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { notifyPaymentReceived } = useSlackNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate amount
    const validation = tipService.validateAmount(amount);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid amount');
      return;
    }

    if (!recipient.trim()) {
      setError('Please enter a recipient');
      return;
    }

    setIsLoading(true);

    try {
      const tipData = {
        recipient: recipient.trim(),
        amount,
        message: message.trim() || undefined,
        sender: 'current-user-id' // You'll need to get this from auth context
      };

      const result = await tipService.createTip(tipData);
      
      setSuccess(`Tip of ${tipService.formatAmount(amount)} sent successfully!`);
      setAmount('');
      setMessage('');

      // Send Slack notification
      await notifyPaymentReceived({
        amount: tipService.formatAmount(amount),
        loanId: result.id,
        borrower: recipient
      });

      if (onTipSent) {
        onTipSent(result);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to send tip');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">💰 Send Tip</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="@username or wallet address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.001"
              step="0.00000001"
              min="0.00000001"
              max="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-gray-500 text-sm">BTC</span>
            </div>
          </div>
          {amount && (
            <p className="text-xs text-gray-500 mt-1">
              ≈ {tipService.formatAmount(amount)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message (optional)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Thanks for the help!"
            rows={3}
            maxLength={200}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            {message.length}/200 characters
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !amount || !recipient}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending Tip...
            </div>
          ) : (
            'Send Tip'
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>💡 Tips are processed instantly using Bitcoin Lightning Network</p>
        <p>🔒 All transactions are secure and transparent</p>
      </div>
    </div>
  );
};

export default TipComponent;
