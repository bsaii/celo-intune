import { Button, SHAPE, SIZE } from 'baseui/button';
import { Card, StyledBody } from 'baseui/card';
import { Cell, Grid } from 'baseui/layout-grid';
import { ChevronLeft, ChevronRight } from 'baseui/icon';
import { DisplayXSmall, LabelMedium } from 'baseui/typography';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { ButtonGroup } from 'baseui/button-group';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import { useStyletron } from 'baseui';

export const sum = (a: number, b: number) => a + b;

export default function Home() {
  const [css] = useStyletron();
  return (
    <>
      <div>
        <Head>
          <title>InTune</title>
          <meta name='Celo InTune' content='A web3 music application' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main>
          {/* MOST POPULAR */}
          <Grid>
            <Cell span={12}>
              <div className={css({ display: 'flex', alignItems: 'center' })}>
                <DisplayXSmall marginBottom='scale600'>
                  Most Popular
                </DisplayXSmall>
                <div className={css({ marginLeft: 'auto' })}>
                  <ButtonGroup size={SIZE.mini} shape={SHAPE.circle}>
                    <Button>
                      <ChevronLeft size={20} />
                    </Button>
                    <Button>
                      <ChevronRight size={20} />
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
              <FlexGrid
                flexGridColumnCount={3}
                flexGridColumnGap='scale300'
                flexGridRowGap='scale300'
              >
                <FlexGridItem>
                  <Card>
                    <StyledBody>
                      <div
                        className={css({
                          position: 'relative',
                          width: '100%',
                          height: '200px',
                          marginBottom: '.5rem',
                        })}
                      >
                        <Image
                          src='/album3.jpg'
                          alt='album1'
                          // width={200}
                          // height={200}
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
                  </Card>
                </FlexGridItem>
              </FlexGrid>
            </Cell>
          </Grid>

          {/* RECENTLY ADDES & MOST PLAYED */}
          <Grid
            overrides={{
              Grid: {
                style: {
                  marginTop: '1.5rem',
                },
              },
            }}
          >
            <Cell span={6}>
              <DisplayXSmall marginBottom='scale600'>
                Recently Added
              </DisplayXSmall>
              <FlexGrid flexGridColumnCount={1} flexGridRowGap='scale600'>
                <FlexGridItem>
                  <Card>
                    <StyledBody
                      className={css({ display: 'flex', alignItems: 'center' })}
                    >
                      <Image
                        src='/album2.jpg'
                        alt='album2'
                        width={50}
                        height={50}
                        className={css({ borderRadius: '10%' })}
                      />
                      <div className={css({ marginLeft: '1rem' })}>
                        <LabelMedium>Album</LabelMedium>
                      </div>
                    </StyledBody>
                  </Card>
                </FlexGridItem>
              </FlexGrid>
            </Cell>
            <Cell span={6}>
              <DisplayXSmall marginBottom='scale600'>
                Mostly Played{' '}
                <span className={css({ fontSize: '1.25rem' })}>❤</span>
              </DisplayXSmall>
              <FlexGrid flexGridColumnCount={1} flexGridRowGap='scale600'>
                <FlexGridItem>
                  <Card>
                    <StyledBody
                      className={css({ display: 'flex', alignItems: 'center' })}
                    >
                      <div className={css({ marginRight: '.75rem' })}>
                        <LabelMedium>01</LabelMedium>
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
                        })}
                      >
                        <LabelMedium>Album</LabelMedium>
                        <LabelMedium color='contentTertiary'>
                          Artist
                        </LabelMedium>
                        <LabelMedium>2:31</LabelMedium>
                      </div>
                    </StyledBody>
                  </Card>
                </FlexGridItem>
              </FlexGrid>
            </Cell>
          </Grid>
        </main>
      </div>
    </>
  );
}
