import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { mainnet, arbitrum, polygon, base, optimism } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http } from 'viem'

// Get projectId from https://cloud.reown.com
export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || ''

if (!projectId) {
  throw new Error('Project ID is not defined. Please add VITE_REOWN_PROJECT_ID to your .env file')
}

// Create a metadata object - this will be used in the future
export const metadata = {
  name: 'P³ Lending',
  description: 'Decentralized Peer-to-Peer Bitcoin Lending Platform',
  url: 'https://p3lending.space',
  icons: ['/logo-p3.svg']
}

// Create wagmiConfig
export const wagmiConfig = {
  chains: [mainnet, arbitrum, polygon, base, optimism] as const,
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
  },
  projectId,
  metadata,
}

// Create the modal
export const appKit = createAppKit({
  adapters: [wagmiConfig],
  projectId,
  defaultNetwork: mainnet,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false, // Optional - defaults to true
    socials: ['google', 'x', 'github', 'discord'], // Optional - defaults to your Cloud configuration
    emailShowWallets: true, // Optional - defaults to your Cloud configuration
  },
  themeMode: 'light', // Optional - defaults to 'auto'
  themeVariables: {
    '--w3m-color-mix': '#667eea',
    '--w3m-color-mix-strength': 40,
  },
  enableNetworkView: true,
  enableAccountView: true,
  enableOnramp: true,
})

// Create a client
export const queryClient = new QueryClient()

// Export the providers
export const ReownProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
