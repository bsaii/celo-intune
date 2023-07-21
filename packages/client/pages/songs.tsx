import { Card, StyledAction, StyledBody } from 'baseui/card';
import { Cell, Grid } from 'baseui/layout-grid';
import { DisplayMedium, HeadingLarge } from 'baseui/typography';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Button } from 'baseui/button';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import { Skeleton } from 'baseui/skeleton';
import { SongsData } from './api/songs';
import { fetcher } from '@/lib/fetcher';
import { useAccount } from 'wagmi';
import { useAppContext } from '@/lib/context';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useStyletron } from 'baseui';

export default function Songs() {
  const [css] = useStyletron();
  const { dispatch } = useAppContext();
  const {
    data: songs,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    error: songsError,
    isLoading: isLoadingSongs,
  } = useSWR('/api/songs', fetcher<SongsData>);
  const { address } = useAccount();
  const router = useRouter();

  const userSongs = Array.isArray(songs?.data)
    ? songs?.data.filter((song) => song.owner === address)
    : [];

  if (songsError)
    return (
      <>
        <Head>
          <title>Intune - Songs</title>
        </Head>

        <main
          className={css({
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          })}
        >
          <DisplayMedium marginBottom='scale800'>
            Failed to load Songs
          </DisplayMedium>
          <Button onClick={() => router.reload()}>Try Again</Button>
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title>Intune - Songs</title>
      </Head>

      <main>
        <HeadingLarge marginBottom='scale800'>
          Your minted Songs on InTune
        </HeadingLarge>

        <Grid>
          <Cell span={12}>
            <FlexGrid
              flexGridColumnCount={2}
              flexGridColumnGap='scale800'
              flexGridRowGap='scale800'
            >
              {isLoadingSongs ? (
                <div
                  className={css({
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  })}
                >
                  <Skeleton rows={0} height='300px' width='300px' animation />
                  <Skeleton rows={0} height='300px' width='300px' animation />
                  <Skeleton rows={0} height='300px' width='300px' animation />
                  <Skeleton rows={0} height='300px' width='300px' animation />
                </div>
              ) : userSongs && userSongs.length > 0 ? (
                <>
                  {userSongs.map((song, index) => (
                    <FlexGridItem key={index}>
                      <Card
                        overrides={{
                          Root: {
                            style: {
                              width: '335px',
                            },
                          },
                        }}
                      >
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
                              src={song.metadata.image}
                              alt={song.metadata.name}
                              fill
                              className={css({ borderRadius: '5%' })}
                            />
                          </div>
                          <div
                            className={css({
                              fontWeight: 'bold',
                            })}
                          >
                            {song.metadata.name}
                          </div>
                          {song.metadata.artist}
                        </StyledBody>
                        <StyledAction
                          className={css({
                            display: 'flex',
                            justifyContent: 'flex-end',
                          })}
                        >
                          <Button onClick={() => console.log('sell')}>
                            Sell
                          </Button>
                          <Button
                            onClick={() => {
                              dispatch({
                                type: 'setAudioUrl',
                                payload: song.metadata.animation_url,
                              });
                              dispatch({
                                type: 'setPlayed',
                                payload: 0,
                              });
                              dispatch({
                                type: 'setSong',
                                payload: {
                                  artist: song.metadata.artist,
                                  cover: song.metadata.image,
                                  title: song.metadata.name,
                                },
                              });
                            }}
                          >
                            PLAY
                          </Button>
                        </StyledAction>
                      </Card>
                    </FlexGridItem>
                  ))}
                </>
              ) : (
                <div
                  className={css({
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  })}
                >
                  <DisplayMedium marginBottom='scale800'>
                    No minted songs
                  </DisplayMedium>
                  <Button onClick={() => router.push('/mint')}>Mint one</Button>
                </div>
              )}
            </FlexGrid>
          </Cell>
        </Grid>
      </main>
    </>
  );
}
