import '@rainbow-me/rainbowkit/styles.css';
import { Alfajores, Celo } from '@celo/rainbowkit-celo/chains';
import { BaseProvider, LightTheme } from 'baseui';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import type { AppProps } from 'next/app';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Provider as StyletronProvider } from 'styletron-react';
import celoGroups from '@celo/rainbowkit-celo/lists';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { styletron } from '../styletron';

const projectId = 'celo-composer-project-id'; // get one at https://cloud.walletconnect.com/app

const { chains, publicClient } = configureChains(
  [Alfajores, Celo],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);

const connectors = celoGroups({
  chains,
  projectId,
  appName: (typeof document === 'object' && document.title) || 'Your App Name',
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
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </BaseProvider>
    </StyletronProvider>
  );
}

export default App;
