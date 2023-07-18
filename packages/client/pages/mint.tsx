import { Button, ButtonProps, KIND, SHAPE, SIZE } from 'baseui/button';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { HeadingLarge, ParagraphXSmall } from 'baseui/typography';
import { ProgressSteps, Step } from 'baseui/progress-steps';
import React, { useEffect, useState } from 'react';
import { SongMetadata, uploadFileToIPFS, uploadJSONToIPFS } from '@/utils/ipfs';
import { useApproveCoin, useMintSong } from '@/hooks';
import { FileUploader } from 'baseui/file-uploader';
import { FormControl } from 'baseui/form-control';
import Head from 'next/head';
import { Input } from 'baseui/input';
import { formatDuration } from '@/utils';
import { toaster } from 'baseui/toast';
import { useAccount } from 'wagmi';
import { useAppContext } from '@/lib/context';
import { useRouter } from 'next/router';
import { useStyletron } from 'baseui';

interface MintSongValues {
  artist: string;
  coverImage: string;
  audio: string;
  title: string;
  duration: string;
}

export default function Mint() {
  const [current, setCurrent] = useState(0);
  const [uploadImgProg, setUploadImgProg] = useState(0);
  const [uploadAudioProg, setUploadAudioProg] = useState(0);
  const [fileUploadError, setFileUploadError] = useState('');
  const { dispatch } = useAppContext();

  const [css, theme] = useStyletron();

  const { control, handleSubmit, setValue, watch } = useForm<MintSongValues>({
    defaultValues: {
      artist: '',
      audio: '',
      coverImage: '',
      title: '',
      duration: '00:00',
    },
  });

  const watchFields = watch();
  const { artist, coverImage, audio, title } = watchFields;

  const { approveCoinData, approveCoinStatus, approveCoinWriteAsync } =
    useApproveCoin(0.35); // mint Fee
  const {
    isLoadingMintSongTxn,
    isMintSongTxnSuccess,
    mintSongStatus,
    mintSongWriteAsync,
  } = useMintSong();

  const { isConnected } = useAccount();
  const router = useRouter();
  const { push } = router;

  const fileMaxSize = 10000000; // 10 MB

  const onSubmit: SubmitHandler<MintSongValues> = async (data) => {
    console.log(data);

    if (!isConnected) {
      return toaster.info(<>Please connect your wallet.</>);
    }

    try {
      const { artist, audio, coverImage, duration, title } = data;
      const metadata: SongMetadata = {
        animation_url: audio,
        artist,
        duration,
        image: coverImage,
        name: title,
      };
      // upload metadata to IPFS
      const tokenUri = await uploadJSONToIPFS(metadata);
      if (tokenUri) {
        dispatch({ type: 'setTokenUri', payload: tokenUri });
      }

      // approve stable token
      await approveCoinWriteAsync?.();

      if (approveCoinData?.hash) {
        // mint song with the amount
        await mintSongWriteAsync?.();
      }
    } catch (error) {
      console.error('Failed to Mint Song.', error);
    }
  };

  const onError: SubmitErrorHandler<MintSongValues> = (errors) => {
    console.error(errors);
  };

  const isLoading =
    approveCoinStatus === 'loading' ||
    mintSongStatus === 'loading' ||
    isLoadingMintSongTxn;

  useEffect(() => {
    if (isMintSongTxnSuccess) {
      void push('/songs');
    }
  }, [isMintSongTxnSuccess, push]);

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
            <Controller
              name='artist'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl>
                  <Input placeholder='Artist' {...field} />
                </FormControl>
              )}
            />
            <FormControl label={() => 'Cover Image'}>
              <FileUploader
                accept={'image/*'}
                maxSize={fileMaxSize}
                onDrop={(acceptedFiles, rejectedFiles) => {
                  // handle file upload...
                  if (acceptedFiles.length > 0) {
                    void (async () => {
                      // duration
                      await uploadFileToIPFS(acceptedFiles[0], setUploadImgProg)
                        .then((res) => {
                          setValue('coverImage', res ?? '');
                        })
                        .catch((error) => {
                          setFileUploadError('Failed to upload File.');
                          console.error(error);
                        });
                    })();
                  }
                  if (rejectedFiles.length > 0) {
                    if (rejectedFiles[0].size > fileMaxSize) {
                      setFileUploadError('The file exceeds 10 MB.');
                    } else if (!rejectedFiles[0].type.includes('image')) {
                      setFileUploadError('The file is non-image');
                    } else {
                      setFileUploadError('Upload Failed');
                    }
                  }
                }}
                progressAmount={uploadImgProg}
                progressMessage={
                  uploadImgProg ? `Uploading... ${uploadImgProg}% of 100%` : ''
                }
                errorMessage={fileUploadError}
                onRetry={() => {
                  setUploadImgProg(0);
                  setFileUploadError('');
                }}
              />
            </FormControl>
            <SpacedButton disabled>Previous</SpacedButton>
            <SpacedButton
              disabled={!artist || !coverImage}
              onClick={() => {
                setCurrent(1);
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
            <Controller
              name='title'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl>
                  <Input placeholder='Title' {...field} />
                </FormControl>
              )}
            />
            <FormControl label={() => 'Audio File'}>
              <FileUploader
                accept={'audio/*'}
                maxSize={fileMaxSize}
                onDrop={(acceptedFiles, rejectedFiles) => {
                  // handle file upload...
                  if (acceptedFiles.length > 0) {
                    // duration
                    const audio = new Audio();
                    audio.src = URL.createObjectURL(acceptedFiles[0]);
                    audio.addEventListener('loadedmetadata', () => {
                      const durationInSeconds = audio.duration;
                      const formattedDuration =
                        formatDuration(durationInSeconds);
                      setValue('duration', formattedDuration);
                    });

                    void (async () => {
                      await uploadFileToIPFS(
                        acceptedFiles[0],
                        setUploadAudioProg
                      )
                        .then((res) => {
                          setValue('audio', res ?? '');
                        })
                        .catch((error) => {
                          setFileUploadError('Failed to upload File.');
                          console.error(error);
                        });
                    })();
                  }
                  if (rejectedFiles.length > 0) {
                    if (rejectedFiles[0].size > fileMaxSize) {
                      setFileUploadError('The file exceeds 10 MB.');
                    } else if (!rejectedFiles[0].type.includes('audio')) {
                      setFileUploadError('The file is non-audio');
                    } else {
                      setFileUploadError('Upload Failed');
                    }
                  }
                }}
                progressAmount={uploadAudioProg}
                progressMessage={
                  uploadAudioProg
                    ? `Uploading... ${uploadAudioProg}% of 100%`
                    : ''
                }
                errorMessage={fileUploadError}
                onRetry={() => {
                  setUploadAudioProg(0);
                  setFileUploadError('');
                }}
              />
            </FormControl>
            <ParagraphXSmall>
              Please ensure you have at least 0.35cUSD approved for minting.
            </ParagraphXSmall>
            <SpacedButton onClick={() => setCurrent(0)}>Previous</SpacedButton>
            <SpacedButton
              disabled={!title || !audio}
              onClick={() => {
                void handleSubmit(onSubmit, onError)();
              }}
              isLoading={isLoading}
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            marginLeft: $theme.sizing.scale200,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            marginRight: $theme.sizing.scale200,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            marginTop: $theme.sizing.scale800,
          }),
        },
      }}
    />
  );
}
