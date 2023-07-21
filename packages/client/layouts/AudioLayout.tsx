import { Card, StyledBody } from 'baseui/card';
import { Cell, Grid } from 'baseui/layout-grid';
import { ProgressBar, SIZE } from 'baseui/progress-bar';
import React, { useRef, useState } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { formatDuration, truncateString } from '@/utils';
import { Button } from 'baseui/button';
import Image from 'next/image';
import { LabelMedium } from 'baseui/typography';
import { Slider } from 'baseui/slider';
import { useAppContext } from '@/lib/context';
import { useStyletron } from 'baseui';

export const AudioLayout = () => {
  const [css, theme] = useStyletron();

  const [vol, setVol] = useState([80]);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [loop, setLoop] = useState(false);
  const [seeking, setSeeking] = useState(false);

  const player = useRef<ReactPlayer | null>(null);

  const { dispatch, state } = useAppContext();
  const { audioUrl, played, song } = state;

  const handlePlayPause = () => setPlaying(!playing);

  const handleStop = () => {
    dispatch({ type: 'setAudioUrl', payload: '' });
    setPlaying(false);
  };

  const handleToggleMuted = () => setMuted(!muted);

  const handlePlay = () => {
    console.log('onPlay');
    setPlaying(true);
  };

  const handlePause = () => {
    console.log('onPause');
    setPlaying(false);
  };

  const handleToggleLoop = () => setLoop(!loop);

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: { target: { value: string } }) => {
    dispatch({ type: 'setPlayed', payload: parseFloat(e.target.value) });
  };

  const handleSeekMouseUp = (e: { target: { value: string } }) => {
    setSeeking(false);
    player.current?.seekTo(parseFloat(e.target.value));
  };

  const handleProgress: ReactPlayerProps['onProgress'] = (state) => {
    console.log('onProgress', state);
    // We only want to update time slider if we are not currently seeking
    if (!seeking) {
      dispatch({
        type: 'setPlayed',
        payload: state.played,
      });
    }
  };

  const handleEnded = () => {
    console.log('onEnded');
    // No Loop
    setPlaying(false);
  };

  const handleDuration: ReactPlayerProps['onDuration'] = (duration) => {
    console.log('onDuration', duration);
    setDuration(duration);
  };

  return (
    <>
      <div
        className={css({
          display: 'none',
        })}
      >
        <ReactPlayer
          ref={player}
          width='100%'
          height='100%'
          url={audioUrl}
          playing={playing}
          loop={loop}
          volume={parseFloat((vol[0] / 100).toFixed(1))}
          muted={muted}
          onReady={() => console.log('onReady')}
          onStart={() => console.log('onStart')}
          onPlay={handlePlay}
          onPause={handlePause}
          onBuffer={() => console.log('onBuffer')}
          onSeek={(seconds) => console.log('onSeek', seconds)}
          onEnded={handleEnded}
          onError={(error) => console.error('onError.', error)}
          onProgress={handleProgress}
          onDuration={handleDuration}
        />
      </div>
      <Grid
        overrides={{
          Grid: {
            style: {
              postition: 'fixed',
              width: '100%',
              marginTop: '1rem',
            },
          },
        }}
      >
        <Cell span={12}>
          <Card>
            <StyledBody
              className={css({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
              })}
            >
              <div className={css({ display: 'flex', alignItems: 'center' })}>
                <Image
                  src={song.cover || '/JPG/1-track.jpg'}
                  alt='track cover'
                  width={65}
                  height={65}
                  className={css({ borderRadius: '10%' })}
                />
                <LabelMedium className={css({ marginLeft: '.5rem' })}>
                  <div>{truncateString(song.title, 6) || 'Title'}</div>
                  <div
                    className={css({
                      fontWeight: 'lighter',
                    })}
                  >
                    {truncateString(song.artist, 7) || 'Artist'}
                  </div>
                </LabelMedium>
              </div>

              <div
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '1.75rem',
                })}
              >
                <Button onClick={handleStop}>Stop</Button>
                <Button onClick={handlePlayPause}>
                  {playing ? 'Pause' : 'Play'}
                </Button>
                <Button
                  kind={loop ? 'primary' : 'secondary'}
                  onClick={handleToggleLoop}
                >
                  Loop
                </Button>
              </div>
              <div
                className={css({
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginLeft: '1.75rem',
                })}
              >
                <span>
                  <Duration seconds={duration * played} />
                </span>
                <span className={css({ width: '100%' })}>
                  <ProgressBar value={played} maxValue={1} size={SIZE.medium} />
                </span>
                <span>
                  <Duration seconds={duration} />
                </span>
              </div>
              <div
                className={css({
                  width: '20rem',
                  marginLeft: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                })}
              >
                <div>Vol</div>
                <Slider
                  value={vol}
                  onChange={({ value }) => value.length > 0 && setVol(value)}
                  onFinalChange={({ value }) => console.log(value[0] / 100)}
                  step={10}
                  min={10}
                  max={100}
                  overrides={{
                    Root: {
                      style: {
                        marginTop: '.75rem',
                      },
                    },
                    InnerThumb: () => null,
                    ThumbValue: ({ $value }) => (
                      <div
                        className={css({
                          position: 'absolute',
                          top: `-${theme.sizing.scale800}`,
                          ...theme.typography.font200,
                          backgroundColor: 'transparent',
                        })}
                      >
                        {$value}
                      </div>
                    ),
                    Tick: () => null,
                    Thumb: {
                      style: {
                        height: '.75rem',
                        width: '.75rem',
                      },
                    },
                  }}
                />
              </div>
            </StyledBody>
          </Card>
        </Cell>
      </Grid>
    </>
  );
};

function Duration({ seconds }: { seconds: number }) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`}>{formatDuration(seconds)}</time>
  );
}
