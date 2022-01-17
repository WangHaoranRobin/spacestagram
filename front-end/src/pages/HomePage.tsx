import React, { useState, useEffect, useContext, useRef } from "react";
import APODCard from "../components/APODCard";
import HomeHeader from "../components/HomeHeader";
import APODCardProps from "../types/APODCardProps";
import UrlType from "../types/UrlType";
import ViewMode from "../types/ViewMode";
import Context from "../context/ContextConfig";
import Masonry from "react-masonry-css";
import "./HomePage.css";
import { Box, Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { format, addDays, subDays } from "date-fns";
import { useNavigate } from "react-router-dom";

const axios = require("axios");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    endOfScroll: {
      height: "10px",
      backgroundColor: "red",
      width: "100%",
    },
  })
);

const Home = () => {
  const [cards, setCards] = useState<APODCardProps[]>([]);
  const [viewMode, setViewMode] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [startDate, setStartDate] = useState(subDays(new Date(), 5));
  const listInnerRef = useRef<any>();
  const {
    UserNameContext: [userName, setUserName],
    ModeDisabledContext: [isModeButtonsDisabled, setIsModeButtonsDisabled],
  } = useContext(Context);
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userName) {
      if (localStorage.getItem("userName")) {
        setUserName(localStorage.getItem("userName") || "");
      } else {
        navigate("/login");
      }
    }
  }, []);

  useEffect(() => {
    setStartDate(subDays(new Date(), 5));
    setCards([]);
    window.addEventListener("scroll", async () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        if (viewMode != ViewMode.Liked && !inProgress) {
          setInProgress(true);
        }
      }
    });
    return () => {
      window.removeEventListener("scroll", function () {});
    };
  }, [viewMode]);

  useEffect(() => {
    if (cards.length == 0) {
      if (!inProgress) {
        setInProgress(true);
      }
    }
  }, [cards]);

  useEffect(() => {
    if (inProgress) {
      getAPODCards();
    }
  }, [inProgress]);

  const getAPODCards = async (): Promise<APODCardProps[]> => {
    setIsModeButtonsDisabled(true);
    if (
      viewMode === ViewMode.RandomPicture ||
      viewMode === ViewMode.MostRecent
    ) {
      const params: { count?: number; start_date?: string; end_date?: string } =
        {};
      if (viewMode === ViewMode.MostRecent) {
        params.start_date = format(startDate, "yyyy-MM-dd");
        params.end_date = format(addDays(startDate, 5), "yyyy-MM-dd");
        setStartDate(subDays(startDate, 6));
      } else {
        params.count = 6;
      }
      axios
        .get(
          "https://api.nasa.gov/planetary/apod?api_key=JeERhunvZLQ1Xmhv8ZT166RKxzzEbSjCuc4LaikG",
          { params: params }
        )
        .then((response: any) => {
          // get all the cards can be displayed
          // form them into APODCardProps type
          setCards([
            ...cards,
            ...response.data
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
              .reverse(),
          ]);
          setInProgress(false);
          setIsModeButtonsDisabled(false);
        })
        .catch((err: any) => {
          setInProgress(false);
          setIsModeButtonsDisabled(false);
          console.log("Error when saving application data: " + err);
          console.log(err.response.data.error);
        });
    } else if (viewMode === ViewMode.Liked) {
      // get the likedAPODs from /getLiked endpoint
      // form them into APODCardProps type
      axios
        .get(
          "https://us-central1-spacestagram-b087a.cloudfunctions.net/api/getLiked",
          { params: { usrName: userName } }
        )
        .then((res: any) => {
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
          setIsModeButtonsDisabled(false);
        })
        .catch((err: any) => {
          setInProgress(false);
          setIsModeButtonsDisabled(false);
          console.log("Error when saving application data: " + err);
          console.log(err.response.data.error);
        });
    }
    return [];
  };

  // const addAPODCards = async (): Promise<APODCardProps[]> => {
  //   setInProgress(true);
  //   setIsModeButtonsDisabled(true);
  //   if (
  //     viewMode === ViewMode.RandomPicture ||
  //     viewMode === ViewMode.MostRecent
  //   ) {
  //     const params: { count?: number; start_date?: string; end_date?: string } =
  //       {};
  //     if (viewMode === ViewMode.MostRecent) {
  //       params.start_date = format(startDate, "yyyy-MM-dd");
  //       params.end_date = format(addDays(startDate, 5), "yyyy-MM-dd");
  //       setStartDate(subDays(startDate, 6));
  //     } else {
  //       params.count = 6;
  //     }
  //     axios
  //       .get(
  //         "https://api.nasa.gov/planetary/apod?api_key=JeERhunvZLQ1Xmhv8ZT166RKxzzEbSjCuc4LaikG",
  //         { params: params }
  //       )
  //       .then((response: any) => {
  //         // get all the cards can be displayed
  //         // form them into APODCardProps type
  //         setCards(
  //           response.data
  //             .filter((card: any) => {
  //               if (
  //                 urlType(card.hdurl) === UrlType.Other &&
  //                 urlType(card.url) === UrlType.Other
  //               ) {
  //                 return false;
  //               }
  //               return true;
  //             })
  //             .map((card: any) => {
  //               return {
  //                 url:
  //                   urlType(card.hdurl) === UrlType.Other
  //                     ? card.url
  //                     : card.hdurl,
  //                 title: card.title,
  //                 explanation: card.explanation,
  //                 date: card.date,
  //                 media_type: card.media_type,
  //               };
  //             })
  //         );
  //         setInProgress(false);
  //         setIsModeButtonsDisabled(false);
  //       })
  //       .catch((err: any) => {
  //         setInProgress(false);
  //         setIsModeButtonsDisabled(false);
  //         console.log("Error when saving application data: " + err);
  //         console.log(err.response.data.error);
  //       });
  //   }
  //   return [];
  // }

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

  const onScroll = () => {
    console.log("scroll");
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        console.log("reached bottom");
      }
    }
  };

  const breakpoints = {
    default: 3,
    1100: 2,
    670: 1,
  };

  return (
    <React.Fragment>
      <HomeHeader
        usrName={userName}
        inProgress={inProgress}
        onModeChange={changeViewMode}
      />
      <div className={classes.toolbar}></div>
      {cards.length && (
        <div onScroll={onScroll} ref={listInnerRef}>
          <Masonry
            breakpointCols={breakpoints}
            className='my-masonry-grid'
            columnClassName='my-masonry-grid_column'
          >
            {cards.map((card: APODCardProps) => (
              <APODCard
                key={card.date}
                usrName={userName}
                date={card.date}
                explanation={card.explanation}
                media_type={card.media_type}
                url={card.url}
                title={card.title}
              />
            ))}
          </Masonry>
        </div>
      )}
    </React.Fragment>
  );
};

export default Home;
