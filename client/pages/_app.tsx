// import '../styles/globals.css';
import { BaseProvider, LightTheme } from 'baseui';
import type { AppProps } from 'next/app';
import MainLayout from '../layouts/MainLayout';
import { Provider as StyletronProvider } from 'styletron-react';
import { styletron } from '../styletron';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={LightTheme}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </BaseProvider>
    </StyletronProvider>
  );
}
