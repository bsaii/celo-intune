/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
import { Server } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { styletron } from '../styletron';

const MyDocument = ({ stylesheets }: { stylesheets: any }) => {
  return (
    <Html>
      <Head>
        {stylesheets.map(
          (
            sheet: {
              css: any;
              attrs: { [x: string]: any; media: string | undefined };
            },
            i: React.Key | null | undefined
          ) => (
            <style
              key={i}
              className='_styletron_hydrate_'
              dangerouslySetInnerHTML={{ __html: sheet.css }}
              media={sheet.attrs.media}
              data-hydrate={sheet.attrs['data-hydrate']}
            />
          )
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const page = await ctx.renderPage({
    // eslint-disable-next-line react/display-name
    enhanceApp: (App: any) => (props: any) =>
      (
        <StyletronProvider value={styletron}>
          <App {...props} />
        </StyletronProvider>
      ),
  });
  const stylesheets = (styletron as unknown as Server).getStylesheets() || [];
  return { ...page, stylesheets };
};

export default MyDocument;
