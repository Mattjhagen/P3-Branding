# OAuth Setup Guide for P³ Lending Platform

## 🔐 OAuth Configuration

### **Production URLs (Cloudflare Pages)**
- **Primary Domain**: `https://p3lending.space`
- **Cloudflare Pages**: `https://p3-lending.pages.dev` (backup)

### **Development URLs (Local)**
- **Local Development**: `http://localhost:3000`

---

## 🔵 Google OAuth Setup

### **1. Google Cloud Console Configuration**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: **"P³ Lending Platform"**
3. Enable APIs:
   - Google+ API
   - Google Identity API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**

### **2. OAuth Client Configuration**
```
Application type: Web application
Name: P³ Lending Platform

Authorized JavaScript origins:
- https://p3lending.space
- https://p3-lending.pages.dev
- http://localhost:3000 (development)

Authorized redirect URIs:
- https://p3lending.space/auth/google/callback
- https://p3-lending.pages.dev/auth/google/callback
- http://localhost:3000/auth/google/callback (development)
```

### **3. Environment Variables**
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
VITE_GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

---

## 🐙 GitHub OAuth Setup

### **1. GitHub Developer Settings**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**

### **2. OAuth App Configuration**
```
Application name: P³ Lending Platform
Homepage URL: https://p3lending.space
Application description: Revolutionary peer-to-peer Bitcoin lending platform with AI risk analysis and smart contracts
Authorization callback URL: https://p3lending.space/auth/github/callback
```

### **3. Environment Variables**
```env
VITE_GITHUB_CLIENT_ID=your-github-client-id-here
VITE_GITHUB_CLIENT_SECRET=your-github-client-secret-here
```

---

## 🔗 Discord OAuth Setup (Optional)

### **1. Discord Developer Portal**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application: **"P³ Lending Platform"**

### **2. OAuth Configuration**
```
Redirect URIs:
- https://p3lending.space/auth/discord/callback
- https://p3-lending.pages.dev/auth/discord/callback
- http://localhost:3000/auth/discord/callback (development)

Scopes:
- identify
- email
```

### **3. Environment Variables**
```env
VITE_DISCORD_CLIENT_ID=your-discord-client-id-here
VITE_DISCORD_CLIENT_SECRET=your-discord-client-secret-here
```

---

## 🚀 Cloudflare Pages Environment Variables

### **Required Environment Variables**
Add these in Cloudflare Pages → Settings → Environment variables:

```env
# OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GITHUB_CLIENT_ID=your-github-client-id
VITE_DISCORD_CLIENT_ID=your-discord-client-id

# API Configuration
VITE_API_BASE_URL=https://api.p3lending.com
VITE_WS_URL=wss://api.p3lending.com/ws

# Web3 Configuration
VITE_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key
VITE_LOAN_ESCROW_ADDRESS=0x...
VITE_REPUTATION_ADDRESS=0x...

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Plaid Configuration
VITE_PLAID_CLIENT_ID=your-plaid-client-id
```

---

## 🔧 OAuth Implementation

### **Callback Routes**
The platform expects these callback routes:
- `/auth/google/callback`
- `/auth/github/callback`
- `/auth/discord/callback`

### **OAuth Flow**
1. User clicks "Sign in with Google/GitHub"
2. Redirected to OAuth provider
3. User authorizes application
4. Redirected back to callback URL
5. Platform exchanges code for access token
6. User authenticated and redirected to dashboard

---

## 🛡️ Security Considerations

### **Client-Side Security**
- Only store Client IDs in environment variables
- Never expose Client Secrets in frontend code
- Use HTTPS for all production URLs
- Implement CSRF protection

### **Server-Side Security**
- Store Client Secrets securely on backend
- Validate state parameters
- Implement rate limiting
- Log authentication attempts

---

## 📱 Mobile App Considerations

### **Deep Links (Future)**
```
Custom URL Scheme: p3lending://
Universal Links: https://p3lending.space/auth/mobile/callback
```

### **OAuth for Mobile**
- Use PKCE (Proof Key for Code Exchange)
- Implement secure token storage
- Handle app state restoration

---

## 🔄 Testing OAuth

### **Local Development**
1. Set up local OAuth apps with `localhost:3000` URLs
2. Use development environment variables
3. Test all OAuth flows
4. Verify callback handling

### **Production Testing**
1. Deploy to Cloudflare Pages
2. Test with production OAuth apps
3. Verify HTTPS redirects
4. Test error handling

---

## 📞 Support

### **OAuth Provider Support**
- **Google**: [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- **GitHub**: [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- **Discord**: [Discord OAuth Documentation](https://discord.com/developers/docs/topics/oauth2)

### **Platform Support**
- **Email**: Matty@vibecodes.space
- **GitHub**: [P3-Lending Issues](https://github.com/Mattjhagen/P3-Lending/issues)

---

**Ready to set up OAuth?** Follow the steps above and your P³ Lending platform will have secure, professional authentication! 🚀
