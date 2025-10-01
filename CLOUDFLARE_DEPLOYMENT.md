# Cloudflare Pages Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Connect Repository to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Select **"Connect to Git"**
4. Choose **GitHub** and authorize access
5. Select repository: `Mattjhagen/p3-netlify`

### 2. Build Configuration

```yaml
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: / (leave empty)
Node.js version: 18
```

### 3. Environment Variables

Add these in Cloudflare Pages → Settings → Environment variables:

#### Required Variables
```env
# API Configuration
VITE_API_BASE_URL=https://api.p3lending.com
VITE_WS_URL=wss://api.p3lending.com/ws

# Web3 Configuration
VITE_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
VITE_LOAN_ESCROW_ADDRESS=0x...
VITE_REPUTATION_ADDRESS=0x...

# OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GITHUB_CLIENT_ID=your-github-client-id

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Plaid Configuration
VITE_PLAID_CLIENT_ID=your-plaid-client-id
```

### 4. Custom Domain Setup

1. In Pages project → **Custom domains**
2. Add domain: `p3lending.space`
3. Cloudflare will automatically:
   - Provision SSL certificate
   - Configure DNS records
   - Enable HTTPS

### 5. Automatic Deployments

- **Production**: Deploys from `main` branch
- **Preview**: Deploys from pull requests
- **Manual**: Deploy specific commits

## 🔧 Advanced Configuration

### Build Optimization

The `wrangler.toml` file is already configured for optimal deployment:

```toml
[env.production]
name = "p3-lending"
compatibility_date = "2024-01-01"
```

### Performance Features

- **Automatic HTTPS**: SSL/TLS handled by Cloudflare
- **Global CDN**: Fast loading worldwide
- **Edge Caching**: Optimized asset delivery
- **Image Optimization**: Automatic image compression
- **Minification**: CSS/JS automatically minified

### Security Features

- **DDoS Protection**: Built-in protection
- **WAF**: Web Application Firewall
- **Bot Management**: Advanced bot protection
- **Rate Limiting**: API protection

## 📊 Monitoring & Analytics

### Built-in Analytics
- Page views and unique visitors
- Core Web Vitals
- Error rates and performance
- Geographic distribution

### Custom Analytics
- Google Analytics integration ready
- Custom event tracking
- Performance monitoring

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (use 18)
   - Verify all dependencies in package.json
   - Check build command and output directory

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names (case-sensitive)
   - Verify API keys are valid

3. **Custom Domain Issues**
   - Verify DNS records are correct
   - Check domain ownership
   - Ensure SSL certificate is provisioned

### Debug Commands

```bash
# Test build locally
npm run build

# Preview production build
npm run preview

# Check environment variables
echo $VITE_API_BASE_URL
```

## 🔄 Deployment Workflow

### Automatic Deployments
1. Push to `main` branch → Production deployment
2. Create pull request → Preview deployment
3. Merge PR → Production deployment

### Manual Deployments
1. Go to Pages project
2. Click "Deployments" tab
3. Click "Retry deployment" or "Redeploy"

## 📈 Performance Optimization

### Recommended Settings
- **Caching**: Aggressive caching for static assets
- **Compression**: Gzip/Brotli compression enabled
- **HTTP/2**: Automatic HTTP/2 support
- **HTTP/3**: HTTP/3 support enabled

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

## 🛡️ Security Best Practices

1. **Environment Variables**
   - Never commit secrets to repository
   - Use Cloudflare Pages environment variables
   - Rotate API keys regularly

2. **Content Security Policy**
   - Configure CSP headers
   - Restrict resource loading
   - Prevent XSS attacks

3. **HTTPS Only**
   - Force HTTPS redirects
   - HSTS headers enabled
   - Secure cookies only

## 📞 Support

### Cloudflare Support
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Community Forum](https://community.cloudflare.com/)
- [Status Page](https://www.cloudflarestatus.com/)

### Project Support
- GitHub Issues: [P3-Lending Issues](https://github.com/Mattjhagen/P3-Lending/issues)
- Email: Matty@vibecodes.space

---

**Ready to deploy?** Follow the steps above and your P³ Lending platform will be live on Cloudflare Pages with automatic SSL, global CDN, and enterprise-grade security! 🚀
