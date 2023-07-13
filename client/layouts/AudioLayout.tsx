import { Card, StyledBody } from 'baseui/card';
import { Cell, Grid } from 'baseui/layout-grid';
import { ProgressBar, SIZE } from 'baseui/progress-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'baseui/button';
import Image from 'next/image';
import { LabelMedium } from 'baseui/typography';
import { Slider } from 'baseui/slider';
import { useStyletron } from 'baseui';

export const AudioLayout = () => {
  const [css, theme] = useStyletron();

  const [progress, setProgress] = useState(0);
  const [vol, setVol] = useState([10]);

  useInterval(() => {
    if (progress < 100) {
      setProgress(progress + 10);
    } else {
      setProgress(0);
    }
  }, 1000);

  return (
    <>
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
                  src='/album2.jpg'
                  alt='album2'
                  width={65}
                  height={65}
                  className={css({ borderRadius: '10%' })}
                />
                <LabelMedium className={css({ marginLeft: '.5rem' })}>
                  <div>Artist</div>
                  <div
                    className={css({
                      fontWeight: 'lighter',
                    })}
                  >
                    Title
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
                <Button>Prev</Button>
                <Button>Play</Button>
                <Button>Next</Button>
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
                <span>0:03</span>
                <span className={css({ width: '100%' })}>
                  <ProgressBar value={progress} size={SIZE.medium} />
                </span>
                <span>2:45</span>
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
                  onChange={({ value }) => value && setVol(value)}
                  onFinalChange={({ value }) => console.log(value)}
                  step={10}
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

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(() => {});
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect((): any => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
