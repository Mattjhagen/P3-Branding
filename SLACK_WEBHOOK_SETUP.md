# Slack Webhook Setup for P³ Lending

This guide will help you set up Slack webhook notifications for the P³ Lending platform.

## Prerequisites

- A Slack workspace where you have admin permissions
- Access to the P³ Lending codebase

## Step 1: Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **"Create New App"** → **"From scratch"**
3. Enter app name: `P³ Lending Bot`
4. Select your workspace
5. Click **"Create App"**

## Step 2: Configure Incoming Webhooks

1. In your app settings, go to **"Incoming Webhooks"** in the left sidebar
2. Toggle **"Activate Incoming Webhooks"** to **On**
3. Click **"Add New Webhook to Workspace"**
4. Choose the channel where you want notifications (e.g., `#general`, `#alerts`, `#p3-lending`)
5. Click **"Allow"**
6. Copy the webhook URL (starts with `https://hooks.slack.com/services/...`)

## Step 3: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `env.example`)
2. Add your webhook URL:

```bash
# Slack Webhook Configuration
VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/ACTUAL/WEBHOOK/URL
VITE_SLACK_CHANNEL=#your-channel-name
VITE_SLACK_USERNAME=P³ Lending Bot
VITE_SLACK_ICON_EMOJI=:robot_face:
```

## Step 4: Configure Slash Commands

### Create Slash Commands

1. **Go to "Slash Commands"** in your Slack app settings
2. **Click "Create New Command"**

#### Command 1: Loan Status
- **Command**: `/loan-status`
- **Request URL**: `https://p3lending.space/slack/webhook`
- **Short Description**: `Check loan status and details`
- **Usage Hint**: `[loan-id]`

#### Command 2: Tip
- **Command**: `/tip`
- **Request URL**: `https://p3lending.space/slack/webhook`
- **Short Description**: `Send micro-transaction tip to another user`
- **Usage Hint**: `[@user] [amount] [message]`

3. **Save each command**

## Step 5: Test Your Webhook

### Option A: Using the Admin Panel

1. Add the `SlackWebhookTest` component to your admin page
2. Use the UI buttons to test different notification types

### Option B: Using Command Line

```bash
# Test a simple message
node scripts/test-slack-webhook.js message "Hello from P³ Lending!" info

# Run all test notifications
node scripts/test-slack-webhook.js test
```

### Option C: Using Node.js directly

```bash
# Set your webhook URL as an environment variable
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/ACTUAL/WEBHOOK/URL"

# Run the test script
node slack-webhook-test.js
```

## Available Notification Types

The webhook system supports these notification types:

### 1. Loan Events
- **Loan Created**: New loan request
- **Loan Funded**: Loan has been funded
- **Payment Received**: Payment made on a loan

### 2. Security Events
- **Security Alerts**: Unusual activity, failed logins, etc.

### 3. System Events
- **System Status**: Component up/down/degraded status

### 4. Slash Commands
- **Loan Status**: Check loan details and status
- **Tip**: Send micro-transactions between users

### 5. Custom Notifications
- **General**: Any custom message with different severity levels

## Usage in Your Application

### Using the React Hook

```typescript
import { useSlackNotifications } from './hooks/useSlackNotifications';

const MyComponent = () => {
  const { notifyLoanCreated, notifySecurityAlert } = useSlackNotifications();

  const handleLoanCreated = async (loanData) => {
    await notifyLoanCreated({
      amount: '0.5 BTC',
      interestRate: '8.5% APR',
      borrower: '0x1234...5678',
      loanId: 'LOAN-001'
    });
  };

  const handleSecurityAlert = async () => {
    await notifySecurityAlert({
      type: 'Unusual Activity',
      description: 'Multiple failed login attempts',
      userId: '0x1234...5678',
      severity: 'high'
    });
  };
};
```

### Using the Service Directly

```typescript
import slackWebhook from './services/slackWebhook';

// Send a custom notification
await slackWebhook.sendNotification({
  message: 'Custom notification message',
  type: 'info',
  title: 'Custom Title',
  fields: [
    { title: 'Field 1', value: 'Value 1', short: true },
    { title: 'Field 2', value: 'Value 2', short: true }
  ]
});
```

### Using Slash Commands

Users can now use these commands in Slack:

```bash
# Check loan status
/loan-status LOAN-001

# Send a tip
/tip @john 0.001 Thanks for the help!
```

### Using the Tip Component

```typescript
import TipComponent from './components/TipComponent';

// In your React component
<TipComponent 
  recipient="@username" 
  onTipSent={(tip) => console.log('Tip sent:', tip)} 
/>
```

## Notification Colors and Emojis

- **Success** (Green): ✅ - Loan funded, payment received
- **Warning** (Orange): ⚠️ - System degraded, market volatility
- **Error** (Red): 🚨 - Security alerts, system down
- **Info** (Blue): ℹ️ - General information, new loans

## Troubleshooting

### Common Issues

1. **"Invalid webhook URL"**
   - Check that your webhook URL is correct
   - Ensure the webhook is activated in your Slack app

2. **"Channel not found"**
   - Verify the channel name in your environment variables
   - Make sure the bot has access to the channel

3. **"No notifications received"**
   - Check your browser's network tab for failed requests
   - Verify environment variables are loaded correctly
   - Test with the command-line script first

### Debug Mode

Enable debug logging by adding this to your environment:

```bash
VITE_DEBUG_SLACK=true
```

## Security Considerations

- Never commit your webhook URL to version control
- Use environment variables for all sensitive configuration
- Consider using different webhooks for different environments (dev, staging, prod)
- Regularly rotate webhook URLs if compromised

## Next Steps

1. Set up different channels for different types of notifications
2. Configure notification filtering based on severity
3. Add more specific notification types for your use case
4. Set up monitoring for webhook delivery failures

## Support

If you encounter issues:
1. Check the Slack API documentation
2. Verify your webhook URL is correct
3. Test with the provided test scripts
4. Check the browser console for error messages
