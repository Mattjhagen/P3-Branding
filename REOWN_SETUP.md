# Reown (WalletConnect) Integration Setup

This guide will help you set up Reown AppKit for Web3 wallet connections in P³ Lending.

## 1. Get Your Reown Project ID

1. Go to [https://cloud.reown.com](https://cloud.reown.com)
2. Sign up or log in to your account
3. Create a new project
4. Copy your Project ID

## 2. Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
VITE_REOWN_PROJECT_ID=your_reown_project_id_here
```

## 3. Install Dependencies

The following packages need to be installed:

```bash
npm install @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query
```

## 4. Features Included

### Wallet Connection
- Support for 300+ wallets
- Mobile wallet support via QR codes
- Social login options (Google, X, GitHub, Discord)
- Email wallet creation

### Network Support
- Ethereum Mainnet
- Polygon
- Arbitrum
- Base
- Optimism

### Components
- `WalletConnect` - Main wallet connection component
- `ReownWeb3Provider` - Provider wrapper for the app
- `useReownWeb3` - Custom hook for wallet functionality

## 5. Usage

### Basic Wallet Connection
```tsx
import { WalletConnect } from '@/components/WalletConnect'

function App() {
  return (
    <WalletConnect 
      showBalance={true}
      showNetwork={true}
    />
  )
}
```

### Using the Hook
```tsx
import { useReownWeb3 } from '@/services/reownWeb3'

function MyComponent() {
  const {
    isConnected,
    address,
    chainId,
    connectWallet,
    disconnectWallet
  } = useReownWeb3()

  return (
    <div>
      {isConnected ? (
        <p>Connected: {address}</p>
      ) : (
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  )
}
```

## 6. Configuration

The Reown configuration is in `src/config/reown.ts`. You can customize:

- Supported networks
- Theme colors
- Social login options
- Email wallet settings
- Analytics

## 7. Error Handling

The integration includes comprehensive error handling:

```tsx
import { handleReownError } from '@/services/reownWeb3'

try {
  await connectWallet()
} catch (error) {
  const errorMessage = handleReownError(error)
  toast.error(errorMessage)
}
```

## 8. Network Switching

Users can switch between supported networks:

```tsx
const { switchNetwork } = useReownWeb3()

// Switch to Polygon
await switchNetwork(137)
```

## 9. Styling

The components use Tailwind CSS and are fully customizable. You can override styles by passing className props:

```tsx
<WalletConnect 
  className="my-custom-styles"
  showBalance={false}
  showNetwork={true}
/>
```

## 10. Troubleshooting

### Common Issues

1. **Project ID not found**: Make sure `VITE_REOWN_PROJECT_ID` is set in your environment variables
2. **Wallet not connecting**: Check that the wallet is supported and properly installed
3. **Network errors**: Ensure the network is supported in the configuration

### Debug Mode

Enable debug mode by adding to your environment:

```bash
VITE_REOWN_DEBUG=true
```

## 11. Production Deployment

For production deployment:

1. Update your Reown project settings with your production domain
2. Ensure all environment variables are set in your deployment platform
3. Test wallet connections on your production domain

## 12. Security Considerations

- Never expose your Project ID in client-side code (it's safe to use in environment variables)
- Use HTTPS in production
- Validate all wallet interactions on your backend
- Implement proper error handling and user feedback

## Support

For more information, visit:
- [Reown Documentation](https://docs.reown.com)
- [WalletConnect Documentation](https://docs.walletconnect.com)
- [Wagmi Documentation](https://wagmi.sh)
