import { Card, StyledBody } from 'baseui/card';
import { Cell, Grid } from 'baseui/layout-grid';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { HeadingLarge, LabelMedium, ParagraphSmall } from 'baseui/typography';
import { Button } from 'baseui/button';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import { useStyletron } from 'baseui';

export default function Listings() {
  const [css, theme] = useStyletron();
  return (
    <>
      <Head>
        <title>Intune - Listings</title>
      </Head>

      <main>
        <HeadingLarge marginBottom='scale800'>
          Buy songs listed for sale on InTune
        </HeadingLarge>
        <ParagraphSmall>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum nisi
          aspernatur, recusandae nostrum dolor tenetur.
        </ParagraphSmall>

        <Grid>
          <Cell span={12}>
            {/* <div
              className={css({
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              })}
            >
              <div
                className={css({
                  width: '55%',
                  display: 'flex',
                  justifyContent: 'space-between',
                })}
              >
                <LabelMedium>Title</LabelMedium>
                <LabelMedium>Album</LabelMedium>
                <LabelMedium>Duration</LabelMedium>
                <LabelMedium>Plays</LabelMedium>
              </div>
            </div> */}
            <FlexGrid flexGridColumnCount={1} flexGridRowGap='scale800'>
              <FlexGridItem>
                <Card>
                  <StyledBody
                    className={css({ display: 'flex', alignItems: 'center' })}
                  >
                    <div className={css({ marginRight: '.75rem' })}>
                      <Button>Play</Button>
                    </div>
                    <Image
                      src='/album2.jpg'
                      alt='album2'
                      width={50}
                      height={50}
                      className={css({ borderRadius: '10%' })}
                    />
                    <div
                      className={css({
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                      })}
                    >
                      <LabelMedium>
                        <div>Title</div>
                        <div
                          className={css({
                            color: theme.colors.contentTertiary,
                          })}
                        >
                          Artist
                        </div>
                      </LabelMedium>
                      <LabelMedium>Album</LabelMedium>
                      <LabelMedium>2:31</LabelMedium>
                      <LabelMedium>34,243</LabelMedium>
                      <Button>Like</Button>
                    </div>
                  </StyledBody>
                </Card>
              </FlexGridItem>
            </FlexGrid>
          </Cell>
        </Grid>
      </main>
    </>
  );
}
