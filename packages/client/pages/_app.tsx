import '@rainbow-me/rainbowkit/styles.css';
import { Alfajores, Celo } from '@celo/rainbowkit-celo/chains';
import { BaseProvider, LightTheme } from 'baseui';
import { PLACEMENT, ToasterContainer } from 'baseui/toast';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { AppContextProvider } from '@/lib/context';
import type { AppProps } from 'next/app';
import MainLayout from '@/layouts/MainLayout';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Provider as StyletronProvider } from 'styletron-react';
import celoGroups from '@celo/rainbowkit-celo/lists';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { styletron } from '../styletron';

const projectId =
  process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? 'celo-composer-project-id'; // get one at https://cloud.walletconnect.com/app

const { chains, publicClient } = configureChains(
  [Alfajores, Celo],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY ?? '' }),
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
    publicProvider(),
  ]
);

const connectors = celoGroups({
  chains,
  projectId,
  appName: (typeof document === 'object' && document.title) || 'Celo Intune',
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={LightTheme}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} coolMode>
            <AppContextProvider>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </AppContextProvider>
          </RainbowKitProvider>
        </WagmiConfig>
        <ToasterContainer
          placement={PLACEMENT.topLeft}
          autoHideDuration={3500}
        />
      </BaseProvider>
    </StyletronProvider>
  );
}

export default App;
