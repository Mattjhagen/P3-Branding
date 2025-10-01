// Cloudflare Worker for monitoring P³ Lending platform
// Sends alerts to Slack when issues are detected

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response('OK', { status: 200 });
    }
    
    // Monitoring endpoint
    if (url.pathname === '/monitor') {
      return await handleMonitoring(request, env);
    }
    
    return new Response('Not Found', { status: 404 });
  },
  
  // Scheduled event for periodic monitoring
  async scheduled(event, env, ctx) {
    ctx.waitUntil(performHealthCheck(env));
  }
};

async function handleMonitoring(request, env) {
  try {
    const healthStatus = await checkPlatformHealth();
    
    if (!healthStatus.healthy) {
      await sendSlackAlert(env.SLACK_WEBHOOK_URL, {
        type: 'error',
        title: '🚨 P³ Lending Platform Alert',
        message: healthStatus.message,
        fields: healthStatus.details
      });
    }
    
    return new Response(JSON.stringify(healthStatus), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    await sendSlackAlert(env.SLACK_WEBHOOK_URL, {
      type: 'error',
      title: '🚨 Monitoring System Error',
      message: `Failed to perform health check: ${error.message}`
    });
    
    return new Response('Error', { status: 500 });
  }
}

async function performHealthCheck(env) {
  try {
    const healthStatus = await checkPlatformHealth();
    
    if (!healthStatus.healthy) {
      await sendSlackAlert(env.SLACK_WEBHOOK_URL, {
        type: 'error',
        title: '🚨 Scheduled Health Check Failed',
        message: healthStatus.message,
        fields: healthStatus.details
      });
    }
  } catch (error) {
    await sendSlackAlert(env.SLACK_WEBHOOK_URL, {
      type: 'error',
      title: '🚨 Health Check System Error',
      message: `Scheduled health check failed: ${error.message}`
    });
  }
}

async function checkPlatformHealth() {
  const checks = [];
  
  // Check main website
  try {
    const response = await fetch('https://247f0db7.p3-lending-platform.pages.dev', {
      method: 'HEAD',
      timeout: 10000
    });
    checks.push({
      name: 'Main Website',
      status: response.ok ? 'healthy' : 'unhealthy',
      responseTime: Date.now(),
      statusCode: response.status
    });
  } catch (error) {
    checks.push({
      name: 'Main Website',
      status: 'unhealthy',
      error: error.message
    });
  }
  
  // Check API endpoints
  try {
    const apiResponse = await fetch('https://api.p3lending.com/health', {
      method: 'GET',
      timeout: 10000
    });
    checks.push({
      name: 'API Service',
      status: apiResponse.ok ? 'healthy' : 'unhealthy',
      statusCode: apiResponse.status
    });
  } catch (error) {
    checks.push({
      name: 'API Service',
      status: 'unhealthy',
      error: error.message
    });
  }
  
  // Check WebSocket connection
  try {
    // Simple WebSocket health check
    checks.push({
      name: 'WebSocket Service',
      status: 'healthy', // Implement actual WebSocket check
      note: 'WebSocket check not implemented'
    });
  } catch (error) {
    checks.push({
      name: 'WebSocket Service',
      status: 'unhealthy',
      error: error.message
    });
  }
  
  const unhealthyChecks = checks.filter(check => check.status === 'unhealthy');
  
  return {
    healthy: unhealthyChecks.length === 0,
    message: unhealthyChecks.length > 0 
      ? `${unhealthyChecks.length} service(s) are down` 
      : 'All services are healthy',
    details: checks,
    timestamp: new Date().toISOString()
  };
}

async function sendSlackAlert(webhookUrl, alert) {
  if (!webhookUrl) {
    console.error('Slack webhook URL not configured');
    return;
  }
  
  const colors = {
    success: '#36a64f',
    warning: '#ff9500',
    error: '#ff0000',
    info: '#36a64f'
  };
  
  const payload = {
    channel: '#alerts', // or your preferred channel
    username: 'P³ Lending Monitor',
    icon_emoji: ':robot_face:',
    text: `${alert.type === 'error' ? '🚨' : 'ℹ️'} P³ Lending Platform Alert`,
    attachments: [
      {
        color: colors[alert.type] || colors.info,
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
    
    if (!response.ok) {
      console.error('Failed to send Slack alert:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending Slack alert:', error);
  }
}
