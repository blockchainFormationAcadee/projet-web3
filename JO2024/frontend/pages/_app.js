import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
//import { mainnet, optimism } from 'wagmi/chains'
import { hardhat, polygonMumbai } from 'wagmi/chains'

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react'

import { apiKeyAlchemyProvider } from 'config/constants';
import Header from 'components/Header'

const { chains, provider } = configureChains(
  [hardhat, polygonMumbai],
  [
    alchemyProvider({ apiKey: apiKeyAlchemyProvider }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'JO Paris 2024',
  chains
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider
})

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          < Header />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  )
}
