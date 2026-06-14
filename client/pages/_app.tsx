import '@celo/react-celo/lib/styles.css';
// import '../styles/globals.css';
import { Alfajores, CeloProvider, NetworkNames } from '@celo/react-celo';
import { BaseProvider, LightTheme } from 'baseui';
import type { AppProps } from 'next/app';
import MainLayout from '../layouts/MainLayout';
import { Provider as StyletronProvider } from 'styletron-react';
import { styletron } from '../styletron';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CeloProvider
      dapp={{
        name: 'Celo Intune dApp',
        description: 'Turn your songs to NFTs',
        url: 'https://example.com',
        icon: '',
      }}
      networks={[Alfajores]}
      network={{
        name: NetworkNames.Alfajores,
        rpcUrl: 'https://alfajores-forno.celo-testnet.org',
        graphQl: 'https://alfajores-blockscout.celo-testnet.org/graphiql',
        explorer: 'https://alfajores-blockscout.celo-testnet.org',
        chainId: 44787,
      }}
    >
      <StyletronProvider value={styletron}>
        <BaseProvider theme={LightTheme}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </BaseProvider>
      </StyletronProvider>
    </CeloProvider>
  );
}
