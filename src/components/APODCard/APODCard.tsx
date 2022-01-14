import React, { FC, useState, useEffect } from "react";
import "./APODCard.css";
import "../../index.css";
import APODCardProps from "../../types/APODCardProps";
import VideoEmbed from "../VideoEmbed/Video";
import AnimateHeight from "react-animate-height";
import loadingGif from "../../assets/LoadingEllipsis.gif";

const APODCard: FC<APODCardProps> = ({
  url,
  title,
  explanation,
  date,
  media_type,
}) => {
  useEffect(() => {
    if (media_type === "video") {
      setHeight("auto");
    }
  }, []);

  const [liked, setLiked] = useState(false);
  const [height, setHeight] = useState<number | string>(0);

  const clickLikeButton = () => {
    setLiked(!liked);
  };

  const imageLoaded = () => {
    setHeight("auto");
  };

  return (
    <div className='card-container background2'>
      <AnimateHeight duration={500} height={height}>
        {media_type === "image" ? (
          <img className='image' src={url} onLoad={imageLoaded} />
        ) : (
          <VideoEmbed url={url} />
        )}
        <div className='card-info'>
          <div className='card-info-stripe'>
            <div className='card-info-title-and-date'>
              <h3 className='text title'>{title}</h3>
              <h4 className='text date'>{date}</h4>
            </div>
            <button
              className='like-button'
              onClick={clickLikeButton}
              style={{ backgroundColor: liked ? "red" : "gray" }}
            >
              {liked ? "Unlike" : "Like"}
            </button>
          </div>
          <p className='text explanation'>{explanation}</p>
        </div>
      </AnimateHeight>
      <img className='loadingGif' src={loadingGif} hidden={height != 0} />
    </div>
  );
};

export default APODCard;
