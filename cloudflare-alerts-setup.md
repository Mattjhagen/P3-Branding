# Cloudflare Alerts Setup for P³ Lending Platform

## 1. Uptime Monitoring

### Create Uptime Check
1. Go to Cloudflare Dashboard → **Analytics & Logs** → **Uptime**
2. Click **"Create Monitor"**
3. Configure:
   - **Monitor Name**: `P3 Lending Platform`
   - **URL**: `https://247f0db7.p3-lending-platform.pages.dev`
   - **Method**: `GET`
   - **Expected Status Code**: `200`
   - **Check Interval**: `1 minute`
   - **Timeout**: `10 seconds`

### Set Up Alert
1. In the uptime monitor settings
2. Go to **"Notifications"**
3. Add webhook notification:
   - **Webhook URL**: `https://your-worker.your-subdomain.workers.dev/monitor`
   - **Method**: `POST`
   - **Headers**: `Content-Type: application/json`

## 2. Performance Monitoring

### Core Web Vitals
1. Go to **Analytics & Logs** → **Web Analytics**
2. Set up alerts for:
   - **Largest Contentful Paint** > 2.5s
   - **First Input Delay** > 100ms
   - **Cumulative Layout Shift** > 0.1

### Bandwidth Usage
1. Go to **Analytics & Logs** → **Traffic**
2. Set up alerts for:
   - **Bandwidth usage** > 100GB/month
   - **Request rate** > 10,000 requests/minute

## 3. Security Monitoring

### DDoS Protection
1. Go to **Security** → **DDoS Protection**
2. Set up alerts for:
   - **DDoS attacks detected**
   - **Rate limiting triggered**
   - **Bot management events**

### WAF Events
1. Go to **Security** → **WAF**
2. Set up alerts for:
   - **High severity security events**
   - **Blocked requests** > 100/hour

## 4. Custom Alert Webhook

### Webhook Payload Format
```json
{
  "alert_type": "uptime",
  "status": "down",
  "url": "https://247f0db7.p3-lending-platform.pages.dev",
  "timestamp": "2024-01-01T12:00:00Z",
  "message": "Website is down",
  "details": {
    "status_code": 500,
    "response_time": 30000
  }
}
```

### Worker Handler
```javascript
// Add this to your monitoring worker
async function handleCloudflareAlert(request, env) {
  const alert = await request.json();
  
  const slackMessage = {
    type: 'error',
    title: `🚨 ${alert.alert_type.toUpperCase()} Alert`,
    message: alert.message,
    fields: [
      { title: 'URL', value: alert.url, short: true },
      { title: 'Status', value: alert.status, short: true },
      { title: 'Timestamp', value: alert.timestamp, short: true }
    ]
  };
  
  if (alert.details) {
    Object.entries(alert.details).forEach(([key, value]) => {
      slackMessage.fields.push({
        title: key,
        value: String(value),
        short: true
      });
    });
  }
  
  await sendSlackAlert(env.SLACK_WEBHOOK_URL, slackMessage);
  
  return new Response('OK');
}
```

## 5. Deployment Commands

### Deploy Monitoring Worker
```bash
# Deploy the monitoring worker
cd workers
npx wrangler deploy

# Set up scheduled events
npx wrangler trigger schedule
```

### Test the Setup
```bash
# Test health check
curl https://your-worker.your-subdomain.workers.dev/health

# Test monitoring endpoint
curl https://your-worker.your-subdomain.workers.dev/monitor
```

## 6. Slack Channel Setup

### Create Dedicated Channel
1. Create a new Slack channel: `#p3-lending-alerts`
2. Add your bot to the channel
3. Update webhook configuration to post to this channel

### Alert Types
- 🚨 **Critical**: Website down, API failures
- ⚠️ **Warning**: Performance issues, high error rates
- ℹ️ **Info**: Maintenance notifications, deployments
- ✅ **Success**: Service recovery, successful deployments
