// Slack Webhook Test for P³ Lending
// Replace with your actual webhook URL from Slack API settings

const webhookUrl = process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL';

async function sendSlackNotification(message, type = 'info') {
  const colors = {
    success: '#36a64f',  // Green
    warning: '#ff9500',  // Orange
    error: '#ff0000',    // Red
    info: '#36a64f'      // Blue
  };

  const payload = {
    text: "P³ Lending Notification",
    attachments: [
      {
        color: colors[type],
        title: "P³ Lending Platform",
        title_link: "https://p3lending.space",
        text: message,
        footer: "P³ Lending",
        footer_icon: "https://p3lending.space/logo.jpeg",
        ts: Math.floor(Date.now() / 1000)
      }
    ]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('✅ Slack notification sent successfully');
    } else {
      console.error('❌ Failed to send Slack notification:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Error sending Slack notification:', error);
  }
}

// Test notifications - run these to test your webhook
async function runTests() {
  console.log('🧪 Testing Slack webhook notifications...');
  
  await sendSlackNotification("🚀 P³ Lending platform is now live! Join our community for secure Bitcoin lending.", "success");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  
  await sendSlackNotification("⚠️ High volatility detected in Bitcoin markets. Please review your loan positions.", "warning");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await sendSlackNotification("💰 New loan request available: 0.5 BTC at 8.5% APR", "info");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await sendSlackNotification("🔒 Security alert: Unusual activity detected on account #12345", "error");
  
  console.log('✅ All tests completed!');
}

// Export functions for use in other scripts
module.exports = {
  sendSlackNotification,
  runTests
};

// Uncomment the line below to run tests
// runTests();
