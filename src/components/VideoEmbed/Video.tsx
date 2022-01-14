import React, { FC } from "react";
import "./Video.css";

interface VideoProps {
  url: string;
}

const VideoEmbed: FC<VideoProps> = ({ url }) => (
  <div className='video-responsive'>
    <iframe
      width='853'
      height='480'
      src={url}
      frameBorder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      allowFullScreen
      title='Embedded video'
    />
  </div>
);

export default VideoEmbed;
