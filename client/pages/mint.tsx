import { Button, ButtonProps, KIND, SHAPE, SIZE } from 'baseui/button';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ProgressSteps, Step } from 'baseui/progress-steps';
import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { FormControl } from 'baseui/form-control';
import Head from 'next/head';
import { HeadingLarge } from 'baseui/typography';
import { Input } from 'baseui/input';
import { useStyletron } from 'baseui';

interface MintFormInput {
  album: string;
  artist: string;
  albumImage: string;
  songs: {
    name: string;
    duration: string;
    audio: string;
  };
}

interface Songs {
  name: string;
  duration: string;
  audio: string;
}

export default function Mint() {
  const [current, setCurrent] = useState(0);
  const [allSongs, setAllSongs] = useState<Songs[]>([]);
  const [css, theme] = useStyletron();
  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm<MintFormInput>();

  const onSubmit: SubmitHandler<MintFormInput> = (data) => {
    console.log(data);
  };

  function addAnother(data: Songs) {
    if (!!data.audio && !!data.duration && !!data.name) return;
    setAllSongs([...allSongs, data]);
    console.log(allSongs);
  }

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
          <Step title='Create Album'>
            <div
              className={css({
                ...theme.typography.ParagraphSmall,
                marginBottom: '24px',
              })}
            >
              Here is some step content
            </div>
            <Controller
              control={control}
              name='album'
              defaultValue=''
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <FormControl>
                  <Input
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(event.currentTarget.value)
                    }
                    placeholder='Album Name'
                    error={!!fieldState.error}
                  />
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='artist'
              defaultValue=''
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <FormControl>
                  <Input
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(event.currentTarget.value)
                    }
                    placeholder='Artist'
                    error={!!fieldState.error}
                  />
                </FormControl>
              )}
            />
            <FormControl label={() => 'Album Image'}>
              <FileUpload />
            </FormControl>
            <SpacedButton disabled>Previous</SpacedButton>
            <SpacedButton
              onClick={() => {
                if (!errors.album) {
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
              Add the songs of your album
            </div>
            <Controller
              control={control}
              name='songs.name'
              defaultValue=''
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <FormControl>
                  <Input
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(event.currentTarget.value)
                    }
                    placeholder='Song'
                    error={!!fieldState.error}
                  />
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='songs.duration'
              defaultValue=''
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <FormControl>
                  <Input
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(event.currentTarget.value)
                    }
                    placeholder='Duration'
                    error={!!fieldState.error}
                  />
                </FormControl>
              )}
            />
            <FormControl label={() => 'Audio File'}>
              <FileUpload />
            </FormControl>
            <Button
              onClick={() => {
                const songsValues = getValues('songs');
                addAnother(songsValues);
                // reset({
                //   songs: {
                //     name: '',
                //     duration: '',
                //     audio: '',
                //   },
                // });
              }}
            >
              Add Another
            </Button>
            <SpacedButton onClick={() => setCurrent(0)}>Previous</SpacedButton>
            <SpacedButton disabled>Next</SpacedButton>
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
