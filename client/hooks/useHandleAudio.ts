import { useCallback, useEffect, useRef, useState } from 'react';

export function useHandleAudio(url: string) {
  const [audio, setAudio] = useState(url);
  const [trackIndex, setTrackIndex] = useState(0);
  const [newSong, setNewSong] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(new Audio()); // source of the audio

  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const isReady = useRef(false);

  const { duration } = audioRef.current;

  const toPrevTrack = useCallback(() => {
    if (trackIndex - 1 < 0) {
      setTrackIndex(audio.length - 1);
    } else {
      setTrackIndex(trackIndex - 1);
    }
  }, [audio.length, trackIndex]);

  const toNextTrack = useCallback(() => {
    if (trackIndex < audio.length - 1) {
      setTrackIndex(trackIndex + 1);
    } else {
      setTrackIndex(0);
    }
  }, [audio.length, trackIndex]);

  const toggle = useCallback(() => setIsPlaying(!isPlaying), [isPlaying]);

  const startTimer = useCallback(() => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        toNextTrack();
      } else {
        setTrackProgress(Math.round(audioRef.current.currentTime));
      }
    }, 1000);
  }, [toNextTrack]);

  const onSearch = (value: number) => {
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onSearchEnd = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  const onVolume = (vol: number) => {
    setVolume(vol);
    audioRef.current.volume = vol;
  };

  useEffect(() => {
    toggle();
    setAudio(url);
    if (trackIndex === 0) {
      setNewSong(newSong + 1);
    } else {
      setTrackIndex(0);
    }
  }, [newSong, toggle, trackIndex, url]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
    }
  }, [isPlaying, startTimer]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    setTrackProgress(Math.round(audioRef.current.currentTime));
    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      isReady.current = true;
    }
  }, [trackIndex, newSong, volume, startTimer]);

  return {
    isPlaying,
    duration,
    toggle,
    toNextTrack,
    toPrevTrack,
    trackProgress,
    onSearch,
    onSearchEnd,
    onVolume,
    trackIndex,
  };
}
