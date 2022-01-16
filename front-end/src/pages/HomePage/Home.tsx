import { FC, useState, useEffect } from "react";
import APODCard from "../../components/APODCard";
import HomeHeader from "../../components/HomeHeader";
import APODCardProps from "../../types/APODCardProps";
import UrlType from "../../types/UrlType";
import HomePageProps from "../../types/HomePageProps";
import ViewMode from "../../types/ViewMode";
import Masonry from "react-masonry-css";
import "./Home.css";
import { Box, Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

const axios = require("axios");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
  })
);

const Home: FC<HomePageProps> = ({ usrName }) => {
  const [cards, setCards] = useState<APODCardProps[]>([]);
  const [viewMode, setViewMode] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setCards([]);
    getAPODCards();
    console.log(cards.length);
  }, [viewMode]);

  const getAPODCards = async (): Promise<APODCardProps[]> => {
    setInProgress(true);
    if (
      viewMode === ViewMode.RandomPicture ||
      viewMode === ViewMode.MostRecent
    ) {
      const params: { count?: number; start_date?: string; end_date?: string } =
        {};
      if (viewMode === ViewMode.MostRecent) {
        params.start_date = "2021-04-01";
        params.end_date = "2021-04-10";
      } else {
        params.count = 10;
      }
      axios
        .get(
          "https://api.nasa.gov/planetary/apod?api_key=JeERhunvZLQ1Xmhv8ZT166RKxzzEbSjCuc4LaikG",
          { params: params }
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
                    urlType(card.hdurl) === UrlType.Other
                      ? card.url
                      : card.hdurl,
                  title: card.title,
                  explanation: card.explanation,
                  date: card.date,
                  media_type: card.media_type,
                };
              })
          );
          setInProgress(false);
        })
        .catch((err: any) => {
          console.log("Error when saving application data: " + err);
          console.log(err.response.data.error);
        });
    } else if (viewMode === ViewMode.Liked) {
      // get the likedAPODs from /getLiked endpoint
      // form them into APODCardProps type
      axios
        .get(
          "https://us-central1-spacestagram-b087a.cloudfunctions.net/api/getLiked",
          { params: { usrName: usrName } }
        )
        .then((res: any) => {
          console.log(res.data);
          if (res.data.length) {
            setCards(
              res.data.map((card: any) => {
                return {
                  url: card.url,
                  title: card.title,
                  explanation: card.explanation,
                  date: card.date,
                  media_type: card.media_type,
                };
              })
            );
          }
          setInProgress(false);
        })
        .catch((err: any) => {
          console.log("Error when saving application data: " + err);
          console.log(err.response.data.error);
        });
    }
    return [];
  };

  const urlType = (url: string): UrlType => {
    // if is a youtube url, return Youtube
    // if ends with .jpg, return Image
    if (!url) return UrlType.Other;
    if (url.includes("youtube.com")) return UrlType.Youtube;
    else if (url.includes(".jpg")) return UrlType.Image;
    return UrlType.Other;
  };

  const changeViewMode = (viewMode: number) => {
    setViewMode(viewMode);
  };

  const breakpoints = {
    default: 3,
    1100: 2,
    670: 1,
  };

  return (
    <Box>
      <HomeHeader
        usrName={usrName}
        inProgress={inProgress}
        onModeChange={changeViewMode}
      />
      <div className={classes.toolbar}></div>
      {cards.length && (
        <Masonry
          breakpointCols={breakpoints}
          className='my-masonry-grid'
          columnClassName='my-masonry-grid_column'
        >
          {cards.map((card: APODCardProps) => (
            <APODCard
              key={card.date}
              usrName={usrName}
              date={card.date}
              explanation={card.explanation}
              media_type={card.media_type}
              url={card.url}
              title={card.title}
            />
          ))}
        </Masonry>
      )}
    </Box>
  );
};

export default Home;
