import { useEffect, useRef } from 'react';

const MusicPlayer = ({ isPlaying }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  return (
    <audio ref={audioRef} loop>
      <source src="/music/calm-meditation.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default MusicPlayer;
