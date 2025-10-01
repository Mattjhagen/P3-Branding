#!/usr/bin/env node

// Simple health check script for P³ Lending Platform
// Can be run as a cron job or scheduled task

const https = require('https');
const http = require('http');

// Configuration
const CONFIG = {
  website: 'https://247f0db7.p3-lending-platform.pages.dev',
  api: 'https://api.p3lending.com/health',
  slackWebhook: process.env.SLACK_WEBHOOK_URL,
  timeout: 10000, // 10 seconds
  retries: 3
};

// Colors for Slack messages
const COLORS = {
  success: '#36a64f',
  warning: '#ff9500',
  error: '#ff0000',
  info: '#36a64f'
};

async function checkWebsite(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, { timeout: CONFIG.timeout }, (res) => {
      const responseTime = Date.now() - startTime;
      resolve({
        name: 'Website',
        url,
        status: res.statusCode === 200 ? 'healthy' : 'unhealthy',
        statusCode: res.statusCode,
        responseTime,
        error: null
      });
    });
    
    req.on('error', (error) => {
      resolve({
        name: 'Website',
        url,
        status: 'unhealthy',
        statusCode: null,
        responseTime: null,
        error: error.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: 'Website',
        url,
        status: 'unhealthy',
        statusCode: null,
        responseTime: null,
        error: 'Request timeout'
      });
    });
  });
}

async function checkAPI(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const req = https.get(url, { timeout: CONFIG.timeout }, (res) => {
      const responseTime = Date.now() - startTime;
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            name: 'API',
            url,
            status: jsonData.healthy ? 'healthy' : 'unhealthy',
            statusCode: res.statusCode,
            responseTime,
            error: null,
            details: jsonData
          });
        } catch (error) {
          resolve({
            name: 'API',
            url,
            status: 'unhealthy',
            statusCode: res.statusCode,
            responseTime,
            error: 'Invalid JSON response'
          });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({
        name: 'API',
        url,
        status: 'unhealthy',
        statusCode: null,
        responseTime: null,
        error: error.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: 'API',
        url,
        status: 'unhealthy',
        statusCode: null,
        responseTime: null,
        error: 'Request timeout'
      });
    });
  });
}

async function sendSlackAlert(webhookUrl, alert) {
  if (!webhookUrl) {
    console.error('Slack webhook URL not configured');
    return;
  }
  
  const payload = {
    channel: '#alerts',
    username: 'P³ Lending Monitor',
    icon_emoji: ':robot_face:',
    text: `${alert.type === 'error' ? '🚨' : 'ℹ️'} P³ Lending Platform Alert`,
    attachments: [
      {
        color: COLORS[alert.type] || COLORS.info,
        title: alert.title,
        text: alert.message,
        fields: alert.fields || [],
        footer: 'P³ Lending Platform Monitor',
        footer_icon: 'https://p3lending.space/logo.jpeg',
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
      console.log('✅ Slack alert sent successfully');
    } else {
      console.error('❌ Failed to send Slack alert:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Error sending Slack alert:', error);
  }
}

async function performHealthCheck() {
  console.log('🔍 Starting health check...');
  
  const checks = await Promise.all([
    checkWebsite(CONFIG.website),
    checkAPI(CONFIG.api)
  ]);
  
  const unhealthyChecks = checks.filter(check => check.status === 'unhealthy');
  
  console.log('📊 Health Check Results:');
  checks.forEach(check => {
    const status = check.status === 'healthy' ? '✅' : '❌';
    console.log(`${status} ${check.name}: ${check.status}`);
    if (check.error) {
      console.log(`   Error: ${check.error}`);
    }
  });
  
  if (unhealthyChecks.length > 0) {
    const alert = {
      type: 'error',
      title: '🚨 P³ Lending Platform Alert',
      message: `${unhealthyChecks.length} service(s) are down`,
      fields: unhealthyChecks.map(check => ({
        title: check.name,
        value: check.error || `Status: ${check.statusCode}`,
        short: true
      }))
    };
    
    await sendSlackAlert(CONFIG.slackWebhook, alert);
    process.exit(1); // Exit with error code
  } else {
    console.log('✅ All services are healthy');
    process.exit(0); // Exit with success code
  }
}

// Run health check if this script is executed directly
if (require.main === module) {
  performHealthCheck().catch(error => {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  });
}

module.exports = { performHealthCheck, checkWebsite, checkAPI };
