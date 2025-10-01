#!/usr/bin/env node

// Test script for Slack webhook
// Usage: node scripts/test-slack-webhook.js

const { sendSlackNotification, runTests } = require('../slack-webhook-test.js');

const args = process.argv.slice(2);
const command = args[0];

console.log('🔧 Slack Webhook Test Script');
console.log('============================');

if (command === 'test') {
  console.log('Running all webhook tests...');
  await runTests();
} else if (command === 'message') {
  const message = args[1] || 'Test message from P³ Lending Platform';
  const type = args[2] || 'info';
  
  console.log(`Sending message: "${message}"`);
  console.log(`Type: ${type}`);
  
  const success = await sendSlackNotification(message, type);
  if (success) {
    console.log('✅ Message sent successfully!');
  } else {
    console.log('❌ Failed to send message');
  }
} else {
  console.log('Usage:');
  console.log('  node scripts/test-slack-webhook.js test                    # Run all tests');
  console.log('  node scripts/test-slack-webhook.js message "Hello World"   # Send custom message');
  console.log('  node scripts/test-slack-webhook.js message "Alert" error   # Send with type');
  console.log('');
  console.log('Available types: success, warning, error, info');
}
