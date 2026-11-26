import React from 'react';
import ReactPlayer from 'react-player';
import Image from 'next/image';

const playerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  backgroundColor: 'white',
};

interface VideoPlayerProps {
  videoUrl: string;
  handleError: React.ReactEventHandler<HTMLVideoElement>;
}

export default function VideoPlayer({
  videoUrl,
  handleError,
}: VideoPlayerProps) {
  if (!videoUrl) {
    return null;
  }

  const thumbnailUrl = () => {
    const ids = videoUrl.split('/');
    const videoId = ids[ids.length - 1];

    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <ReactPlayer
      src={videoUrl}
      light={thumbnailUrl()}
      playing
      controls
      width="100%"
      height="100%"
      style={playerStyle}
      playIcon={
        <Image
          src="/img/video-play.png"
          alt="кнопка воспроизведения видео"
          width={156}
          height={156}
          loading={'eager'}
        />
      }
      config={{
        youtube: {
          color: 'white',
        },
      }}
      onError={handleError}
    />
  );
}
