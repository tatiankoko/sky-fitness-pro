import React from 'react';
import ReactPlayer from 'react-player';
import Image from 'next/image';

interface VideoPlayerProps {
  videoUrl: string;
  handleError: (err: any) => void;
}

export default function VideoPlayer({
  videoUrl,
  handleError,
}: VideoPlayerProps) {
  if (!videoUrl) {
    return;
  }

  const thumbnailUrl = () => {
    if (!videoUrl) {
      return '';
    }
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
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'white',
      }}
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
