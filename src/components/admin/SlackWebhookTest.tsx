// Slack Webhook Test Component for Admin Panel
import React, { useState } from 'react';
import { useSlackNotifications } from '../../hooks/useSlackNotifications';

const SlackWebhookTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const { 
    sendNotification, 
    notifyLoanCreated, 
    notifyLoanFunded, 
    notifyPaymentReceived,
    notifySecurityAlert,
    notifySystemStatus 
  } = useSlackNotifications();

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBasicNotification = async () => {
    setIsLoading(true);
    try {
      const success = await sendNotification({
        message: "This is a test notification from P³ Lending Platform",
        type: 'info',
        title: 'Test Notification',
        fields: [
          { title: 'Test Type', value: 'Basic Notification', short: true },
          { title: 'Status', value: 'Working', short: true }
        ]
      });
      addResult(success ? '✅ Basic notification sent successfully' : '❌ Basic notification failed');
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLoanCreated = async () => {
    setIsLoading(true);
    try {
      const success = await notifyLoanCreated({
        amount: '0.5 BTC',
        interestRate: '8.5% APR',
        borrower: '0x1234...5678',
        loanId: 'LOAN-001'
      });
      addResult(success ? '✅ Loan created notification sent' : '❌ Loan created notification failed');
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLoanFunded = async () => {
    setIsLoading(true);
    try {
      const success = await notifyLoanFunded({
        amount: '0.5 BTC',
        lender: '0x9876...5432',
        loanId: 'LOAN-001'
      });
      addResult(success ? '✅ Loan funded notification sent' : '❌ Loan funded notification failed');
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testPaymentReceived = async () => {
    setIsLoading(true);
    try {
      const success = await notifyPaymentReceived({
        amount: '0.1 BTC',
        loanId: 'LOAN-001',
        borrower: '0x1234...5678'
      });
      addResult(success ? '✅ Payment received notification sent' : '❌ Payment received notification failed');
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSecurityAlert = async () => {
    setIsLoading(true);
    try {
      const success = await notifySecurityAlert({
        type: 'Unusual Activity',
        description: 'Multiple failed login attempts detected',
        userId: '0x1234...5678',
        severity: 'high'
      });
      addResult(success ? '✅ Security alert sent' : '❌ Security alert failed');
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSystemStatus = async () => {
    setIsLoading(true);
    try {
      const success = await notifySystemStatus({
        component: 'Smart Contract',
        status: 'up',
        message: 'All systems operational'
      });
      addResult(success ? '✅ System status notification sent' : '❌ System status notification failed');
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Slack Webhook Test Panel</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Setup Instructions</h3>
        <ol className="list-decimal list-inside text-blue-800 space-y-1">
          <li>Go to your Slack API settings and navigate to "Incoming Webhooks"</li>
          <li>Activate Incoming Webhooks and add a new webhook to your workspace</li>
          <li>Copy the webhook URL and add it to your environment variables</li>
          <li>Set <code className="bg-blue-100 px-1 rounded">VITE_SLACK_WEBHOOK_URL</code> in your .env file</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <button
          onClick={testBasicNotification}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Basic Notification
        </button>
        
        <button
          onClick={testLoanCreated}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Test Loan Created
        </button>
        
        <button
          onClick={testLoanFunded}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Test Loan Funded
        </button>
        
        <button
          onClick={testPaymentReceived}
          disabled={isLoading}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
        >
          Test Payment Received
        </button>
        
        <button
          onClick={testSecurityAlert}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          Test Security Alert
        </button>
        
        <button
          onClick={testSystemStatus}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Test System Status
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
        <button
          onClick={clearResults}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Clear Results
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
        {testResults.length === 0 ? (
          <p className="text-gray-500 italic">No test results yet. Click a test button above to start testing.</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Sending notification...</span>
        </div>
      )}
    </div>
  );
};

export default SlackWebhookTest;
