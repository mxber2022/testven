import {
  DisclaimerComponent,
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import {
  bitgetWallet,
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import binanceWallet from '@binance/w3w-rainbow-connector-v2'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ROUTES } from 'utils/constants'
import { WagmiProvider, createConfig, fallback, http } from 'wagmi'
import { arbitrum, base, mainnet } from 'wagmi/chains'
import AtomUpdater from './updaters/AtomUpdater'
import { WALLETCONNECT_PROJECT_ID, RPC_URLS, FALLBACK_RPC_URLS } from '../../config'

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        injectedWallet,
        metaMaskWallet,
        walletConnectWallet,
        coinbaseWallet,
        braveWallet,
        bitgetWallet,
        binanceWallet,
        rabbyWallet,
        safeWallet,
        ledgerWallet,
        rainbowWallet,
      ],
    },
  ],
  {
    appName: 'FinkFi',
    projectId: WALLETCONNECT_PROJECT_ID,
  }
)

export const wagmiConfig = createConfig({
  chains: [mainnet, base, arbitrum],
  connectors,
  transports: {
    [mainnet.id]: fallback([
      http(RPC_URLS.mainnet),
      ...FALLBACK_RPC_URLS.mainnet.map((url) => http(url)),
    ]),
    [base.id]: fallback([
      http(RPC_URLS.base),
      ...FALLBACK_RPC_URLS.base.map((url) => http(url)),
    ]),
    [arbitrum.id]: fallback([
      http(RPC_URLS.arbitrum),
      ...FALLBACK_RPC_URLS.arbitrum.map((url) => http(url)),
    ]),
  },
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false
    },
  }
})

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <div>
    By connecting a wallet, you agree to ABC Labs{' '}
    <a href={ROUTES.TERMS}>Terms of Service</a> and consent to its{' '}
    <a href={`${ROUTES.TERMS}?target=privacy`}>Privacy Policy</a>
  </div>
)

const ChainProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            borderRadius: 'medium',
          })}
          appInfo={{ appName: 'FinkFi', disclaimer: Disclaimer }}
        >
          <AtomUpdater />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ChainProvider
