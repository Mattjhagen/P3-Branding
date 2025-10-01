// Slack Webhook Handler Page for P³ Lending Platform
// Handles incoming webhook requests from Slack

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import slackCommands from '../services/slackCommands';

const SlackWebhookPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleWebhook = async () => {
      try {
        // Get command data from URL parameters (Slack sends this as form data)
        const commandData = {
          token: searchParams.get('token') || '',
          team_id: searchParams.get('team_id') || '',
          team_domain: searchParams.get('team_domain') || '',
          channel_id: searchParams.get('channel_id') || '',
          channel_name: searchParams.get('channel_name') || '',
          user_id: searchParams.get('user_id') || '',
          user_name: searchParams.get('user_name') || '',
          command: searchParams.get('command') || '',
          text: searchParams.get('text') || '',
          response_url: searchParams.get('response_url') || '',
          trigger_id: searchParams.get('trigger_id') || ''
        };

        if (!commandData.command) {
          setStatus('error');
          setMessage('No command received');
          return;
        }

        // Process the command
        await slackCommands.processCommand(commandData);
        
        setStatus('success');
        setMessage('Command processed successfully');
      } catch (error) {
        console.error('Webhook error:', error);
        setStatus('error');
        setMessage('Failed to process command');
      }
    };

    handleWebhook();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="mb-4">
            {status === 'processing' && (
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            )}
            {status === 'success' && (
              <div className="inline-block rounded-full h-12 w-12 bg-green-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="inline-block rounded-full h-12 w-12 bg-red-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {status === 'processing' && 'Processing Command...'}
            {status === 'success' && 'Command Processed'}
            {status === 'error' && 'Error Processing Command'}
          </h2>
          
          <p className="text-gray-600 mb-4">
            {message}
          </p>
          
          <div className="text-sm text-gray-500">
            <p>P³ Lending Platform</p>
            <p>Slack Integration</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlackWebhookPage;
