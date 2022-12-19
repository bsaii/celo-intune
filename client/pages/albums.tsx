import { Card, StyledAction, StyledBody } from 'baseui/card';
import { Cell, Grid } from 'baseui/layout-grid';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import AlbumModal from '../components/AlbumModal';
import { Button } from 'baseui/button';
import Head from 'next/head';
import { HeadingLarge } from 'baseui/typography';
import Image from 'next/image';
import React from 'react';
import { useStyletron } from 'baseui';
import { useToggleModal } from '../hooks/useToggleModal';

export default function Albums() {
  const [css] = useStyletron();
  const { isModalOpen, toggleConfirm } = useToggleModal();

  function close() {
    toggleConfirm(false);
  }

  return (
    <>
      <Head>
        <title>Albums</title>
      </Head>

      <main>
        <HeadingLarge marginBottom='scale800'>
          Your minted Albums on InTune
        </HeadingLarge>

        <Grid>
          <Cell span={12}>
            <FlexGrid
              flexGridColumnCount={2}
              flexGridColumnGap='scale800'
              flexGridRowGap='scale800'
            >
              <FlexGridItem>
                <Card>
                  <StyledBody>
                    <div
                      className={css({
                        position: 'relative',
                        width: '100%',
                        height: '300px',
                        marginBottom: '.5rem',
                      })}
                    >
                      <Image
                        src='/album3.jpg'
                        alt='album1'
                        fill
                        className={css({ borderRadius: '5%' })}
                      />
                    </div>
                    <div
                      className={css({
                        fontWeight: 'bold',
                      })}
                    >
                      Locked In
                    </div>
                    Post Malone
                  </StyledBody>
                  <StyledAction
                    className={css({
                      display: 'flex',
                      justifyContent: 'flex-end',
                    })}
                  >
                    <Button onClick={() => toggleConfirm(true)}>PLAY</Button>
                  </StyledAction>
                </Card>
              </FlexGridItem>
            </FlexGrid>
          </Cell>
        </Grid>
        <AlbumModal isModalOpen={isModalOpen} close={close} />
      </main>
    </>
  );
}
