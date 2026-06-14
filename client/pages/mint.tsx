import { Button, ButtonProps, KIND, SHAPE, SIZE } from 'baseui/button';
import { IERC20, Intune } from '../types/web3-v1-contracts';
import { MintSong, mintSong, uploadFileToWebStorage } from '../utils/methods';
import { ProgressSteps, Step } from 'baseui/progress-steps';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  useCUSDContractWithSigner,
  useIntuneContractWithSigner,
} from '../hooks';
import { FileUploader } from 'baseui/file-uploader';
import { FormControl } from 'baseui/form-control';
import Head from 'next/head';
import { HeadingLarge } from 'baseui/typography';
import { Input } from 'baseui/input';
import { useCelo } from '@celo/react-celo';
import { useStyletron } from 'baseui';

export default function Mint() {
  const [artist, setArtist] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [audio, setAudio] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [current, setCurrent] = useState(0);

  const [css, theme] = useStyletron();
  const intuneContractWithSigner = useIntuneContractWithSigner();
  const cUsdContractWithSigner = useCUSDContractWithSigner();
  const [progressAmount, startFakeProgress, stopFakeProgress] =
    useFakeProgress();
  const { performActions } = useCelo();

  const _mintSong = useCallback(async () => {
    const data: MintSong = {
      animation_url: audio,
      artist,
      duration: '0',
      image: coverImage,
      title,
    };
    try {
      await mintSong(
        intuneContractWithSigner as Intune,
        cUsdContractWithSigner as IERC20,
        performActions,
        data,
      ).then((res) => console.log(res));
    } catch (error) {
      console.error(error);
    }
  }, [
    artist,
    audio,
    cUsdContractWithSigner,
    coverImage,
    intuneContractWithSigner,
    performActions,
    title,
  ]);

  return (
    <div>
      <Head>
        <title>Mint</title>
      </Head>

      <main>
        <HeadingLarge marginBottom='scale800'>
          Turn your music into NFT on InTune
        </HeadingLarge>
        <ProgressSteps current={current}>
          <Step title='Get started'>
            <div
              className={css({
                ...theme.typography.ParagraphSmall,
                marginBottom: '24px',
              })}
            >
              Artist and cover image.
            </div>
            <FormControl>
              <Input
                value={artist}
                onChange={(event) => {
                  setArtist(event.target.value);
                }}
                placeholder='Artist'
              />
            </FormControl>
            <FormControl label={() => 'Cover Image'}>
              <FileUploader
                onCancel={stopFakeProgress}
                onDrop={(acceptedFiles, rejectedFiles) => {
                  // handle file upload...
                  console.log(acceptedFiles, rejectedFiles);
                  if (acceptedFiles.length > 0) {
                    void (async () => {
                      await uploadFileToWebStorage(acceptedFiles).then(
                        (res) => {
                          setCoverImage(res);
                        },
                      );
                    })();
                  }
                  startFakeProgress();
                }}
                // progressAmount is a number from 0 - 100 which indicates the percent of file transfer completed
                progressAmount={progressAmount}
                progressMessage={
                  progressAmount
                    ? `Uploading... ${progressAmount}% of 100%`
                    : ''
                }
              />
            </FormControl>
            <SpacedButton disabled>Previous</SpacedButton>
            <SpacedButton
              disabled={!artist || !coverImage}
              onClick={() => {
                if (artist && coverImage) {
                  setCurrent(1);
                }
              }}
            >
              Next
            </SpacedButton>
          </Step>
          <Step title='Add Song'>
            <div
              className={css({
                ...theme.typography.ParagraphSmall,
                marginBottom: '24px',
              })}
            >
              Song title and audio file.
            </div>
            <FormControl>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder='Title'
              />
            </FormControl>
            <FormControl label={() => 'Audio File'}>
              <FileUploader
                onCancel={stopFakeProgress}
                onDrop={(acceptedFiles, rejectedFiles) => {
                  // handle file upload...
                  console.log(acceptedFiles, rejectedFiles);
                  if (acceptedFiles.length > 0) {
                    void (async () => {
                      await uploadFileToWebStorage(acceptedFiles).then(
                        (res) => {
                          setAudio(res);
                        },
                      );
                    })();
                  }
                  startFakeProgress();
                }}
                // progressAmount is a number from 0 - 100 which indicates the percent of file transfer completed
                progressAmount={progressAmount}
                progressMessage={
                  progressAmount
                    ? `Uploading... ${progressAmount}% of 100%`
                    : ''
                }
              />
            </FormControl>
            <SpacedButton onClick={() => setCurrent(0)}>Previous</SpacedButton>
            <SpacedButton
              onClick={() => {
                void _mintSong();
              }}
            >
              Mint
            </SpacedButton>
          </Step>
        </ProgressSteps>
      </main>
    </div>
  );
}

function SpacedButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      shape={SHAPE.pill}
      kind={KIND.secondary}
      size={SIZE.compact}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => ({
            marginLeft: $theme.sizing.scale200,
            marginRight: $theme.sizing.scale200,
            marginTop: $theme.sizing.scale800,
          }),
        },
      }}
    />
  );
}

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: any, delay: number | null) {
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

// useFakeProgress is an elaborate way to show a fake file transfer for illustrative purposes. You
// don't need this is your application. Use metadata from your upload destination if it's available,
// or don't provide progress.
function useFakeProgress(): [number, () => void, () => void] {
  const [fakeProgress, setFakeProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  function stopFakeProgress() {
    setIsActive(false);
    setFakeProgress(0);
  }
  function startFakeProgress() {
    setIsActive(true);
  }
  useInterval(
    () => {
      if (fakeProgress >= 100) {
        stopFakeProgress();
      } else {
        setFakeProgress(fakeProgress + 10);
      }
    },
    isActive ? 500 : null,
  );
  return [fakeProgress, startFakeProgress, stopFakeProgress];
}
