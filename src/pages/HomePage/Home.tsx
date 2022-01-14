import React, { useState, useEffect } from "react";
import APODCard from "../../components/APODCard/APODCard";
import HomeHeader from "../../components/HomeHeader/HomeHeader";
import APODCardProps from "../../types/APODCardProps";
import UrlType from "../../types/UrlType";
import Masonry from "react-masonry-css";
import "./Home.css";

const axios = require("axios");

export default function Home() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://api.nasa.gov/planetary/apod?api_key=JeERhunvZLQ1Xmhv8ZT166RKxzzEbSjCuc4LaikG&count=10" //&start_date=2021-03-01&end_date=2021-03-20"
      )
      .then((response: any) => {
        console.log(response.data);
        // get all the cards can be displayed
        // form them into APODCardProps type
        setCards(
          response.data
            .filter((card: any) => {
              if (
                urlType(card.hdurl) === UrlType.Other &&
                urlType(card.url) === UrlType.Other
              ) {
                return false;
              }
              return true;
            })
            .map((card: any) => {
              return {
                url:
                  urlType(card.hdurl) === UrlType.Other ? card.url : card.hdurl,
                title: card.title,
                explanation: card.explanation,
                date: card.date,
                media_type: card.media_type,
              };
            })
        );
      });
  }, []);

  const urlType = (url: string): UrlType => {
    // if is a youtube url, return Youtube
    // if ends with .jpg, return Image
    if (!url) return UrlType.Other;
    if (url.includes("youtube.com")) return UrlType.Youtube;
    else if (url.includes(".jpg")) return UrlType.Image;
    return UrlType.Other;
  };

  const breakpoints = {
    default: 3,
    1100: 2,
    670: 1,
  };

  return (
    <React.Fragment>
      <HomeHeader />
      <Masonry
        breakpointCols={breakpoints}
        className='my-masonry-grid'
        columnClassName='my-masonry-grid_column'
      >
        {cards.map((card: APODCardProps) => (
          <APODCard
            key={card.date}
            date={card.date}
            explanation={card.explanation}
            media_type={card.media_type}
            url={card.url}
            title={card.title}
          />
        ))}
      </Masonry>
    </React.Fragment>
  );
}
