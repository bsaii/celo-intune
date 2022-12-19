import React, { useEffect, useRef, useState } from 'react';
import { FileUploader } from 'baseui/file-uploader';

const FileUpload = () => {
  const [progressAmount, startFakeProgress, stopFakeProgress] =
    useFakeProgress();

  return (
    <FileUploader
      onCancel={stopFakeProgress}
      onDrop={(acceptedFiles, rejectedFiles) => {
        // handle file upload...
        console.log(acceptedFiles, rejectedFiles);
        startFakeProgress();
      }}
      // progressAmount is a number from 0 - 100 which indicates the percent of file transfer completed
      progressAmount={progressAmount}
      progressMessage={
        progressAmount ? `Uploading... ${progressAmount}% of 100%` : ''
      }
    />
  );
};

export default FileUpload;

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
