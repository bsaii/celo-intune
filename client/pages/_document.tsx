import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { Server } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { sheetT } from 'styletron-engine-atomic/lib/server/server';
import { styletron } from '../styletron';

class MyDocument extends Document<{ stylesheets: sheetT[] }> {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps & { stylesheets: sheetT[] }> {
    const page = ctx.renderPage;

    // Run the React rendering logic synchronously
    ctx.renderPage = () =>
      page({
        // Useful for wrapping the whole react tree
        enhanceApp: (App) => (props) =>
          (
            <StyletronProvider value={styletron}>
              <App {...props} />
            </StyletronProvider>
          ),
      });

    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx);
    const stylesheets = (styletron as Server).getStylesheets() || [];

    return { ...initialProps, stylesheets };
  }

  // eslint-disable-next-line no-undef
  render(): JSX.Element {
    return (
      <Html lang='en'>
        <Head>
          {this.props.stylesheets.map((sheet, i) => (
            <style
              className='_styletron_hydrate_'
              dangerouslySetInnerHTML={{ __html: sheet.css }}
              media={sheet.attrs.media}
              data-hydrate={sheet.attrs['data-hydrate']}
              key={i}
            />
          ))}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
