# Discord Application URLs for P³ Lending Platform

## 🔗 Required Discord URLs

### **1. Interactions Endpoint URL**
```
https://p3lending.space/api/discord/interactions
```
**Purpose**: Discord sends HTTP POST requests here when users interact with your bot (slash commands, buttons, etc.)

### **2. Linked Roles Verification URL**
```
https://p3lending.space/discord/verify-role
```
**Purpose**: Discord redirects users here to verify their P³ Lending status for server roles

### **3. Terms of Service URL**
```
https://p3lending.space/terms-of-service.html
```
**Purpose**: Legal terms and conditions for using the P³ Lending platform

### **4. Privacy Policy URL**
```
https://p3lending.space/privacy-policy.html
```
**Purpose**: Information on how P³ Lending collects, uses, and protects user data

## 📋 Discord Developer Portal Configuration

### **Application Settings**
- **Application ID**: `1422775579010269208` (This is your Client ID)
- **Public Key**: `5d8a9223f90661287339bb81b0fef3336fc1bb1ff3510aa29c87513d06ce8016`

### **OAuth2 Settings**
- **Client ID**: `1422775579010269208`
- **Client Secret**: [Get from Discord Developer Portal]
- **Redirect URIs**:
  - `https://p3lending.space/auth/discord/callback`
  - `https://p3-lending.pages.dev/auth/discord/callback`
  - `http://localhost:3000/auth/discord/callback` (development)

### **General Information**
- **Application Name**: P³ Lending Platform
- **Application Description**: Revolutionary peer-to-peer Bitcoin lending platform with AI risk analysis and smart contracts
- **Application Icon**: [Upload P³ Lending logo]

## 🚀 Next Steps

1. **Add URLs to Discord Developer Portal**:
   - Go to your Discord application settings
   - Add the four URLs listed above
   - Save the configuration

2. **Get Client Secret**:
   - In OAuth2 section, copy the Client Secret
   - Add to your environment variables

3. **Environment Variables**:
   ```env
   VITE_DISCORD_CLIENT_ID=1422775579010269208
   VITE_DISCORD_CLIENT_SECRET=your-discord-client-secret
   ```

4. **Test Integration**:
   - Deploy to Cloudflare Pages
   - Test OAuth flow
   - Verify all URLs are accessible

## 📁 Files Created

- `public/terms-of-service.html` - Complete Terms of Service
- `public/privacy-policy.html` - Comprehensive Privacy Policy
- Both files are styled to match P³ Lending branding

## 🔧 Implementation Notes

### **Interactions Endpoint**
- Will need backend API endpoint to handle Discord interactions
- Should validate Discord signatures for security
- Respond with appropriate interaction responses

### **Linked Roles Verification**
- Will need authentication flow for Discord users
- Should verify user's P³ Lending account status
- Return verification status to Discord

### **Legal Pages**
- Terms of Service covers platform usage, smart contracts, reputation system
- Privacy Policy covers data collection, blockchain transparency, user rights
- Both are GDPR and CCPA compliant

---

**Ready for Discord Integration!** 🎯
