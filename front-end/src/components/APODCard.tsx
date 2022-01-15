import React, { FC, useState, useEffect } from "react";
import APODCardProps from "../types/APODCardProps";
import VideoEmbed from "./VideoEmbed/Video";
import AnimateHeight from "react-animate-height";
import loadingGif from "../assets/LoadingEllipsis.gif";
import { Theme, Stack, Typography, Box, Button } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

const axios = require("axios");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: 10,
      overflow: "hidden",
    },
    cardInfo: {
      paddingLeft: 30,
      paddingRight: 30,
    },
    cardTitleStripe: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      marginTop: 20,
    },
    explanation: {
      marginBottom: 20,
    },
    loadingGif: {
      width: "100%",
      height: 65,
      objectFit: "contain",
    },
    image: {
      width: "100%",
      objectFit: "contain",
    },
  })
);

const APODCard: FC<APODCardProps> = ({
  usrName,
  url,
  title,
  explanation,
  date,
  media_type,
}) => {
  useEffect(() => {
    // Check if the APOD is liked
    console.log(usrName);
    console.log(date);
    axios
      .get("https://us-central1-spacestagram-b087a.cloudfunctions.net/api/isLiked", {
        params: {
          usrName: usrName,
          APODDate: date,
        },
      })
      .then((res: any) => {
        if (res.data) {
          setLiked(true);
        }
      })
      .catch((err: any) => {
        console.log("Error when saving application data: " + err);
        console.log(err.response.data.error);
      });
    if (media_type === "video") {
      setHeight("auto");
    }
  }, []);

  const classes = useStyles();

  const [liked, setLiked] = useState(false);
  const [height, setHeight] = useState<number | string>(0);

  const clickLikeButton = () => {
    axios
      .post(
        `https://us-central1-spacestagram-b087a.cloudfunctions.net/api/${
          liked ? "unlike" : "like"
        }`,
        {
          usrName: usrName,
          APODDate: date,
        }
      )
      .then((res: any) => {
        console.log("Successfully saved data!");
        console.log(res.data);
      })
      .catch((err: any) => {
        console.log("Error when saving application data: " + err);
        console.log(err.response.data.error);
      });
    setLiked(!liked);
  };

  const imageLoaded = () => {
    setHeight("auto");
  };

  return (
    <Stack className={classes.container}>
      <AnimateHeight duration={500} height={height}>
        {media_type === "image" ? (
          <img className={classes.image} src={url} onLoad={imageLoaded} />
        ) : (
          <VideoEmbed url={url} />
        )}
        <Stack className={classes.cardInfo}>
          <Stack className={classes.cardTitleStripe} direction='row'>
            <Stack>
              <Typography
                className={classes.title}
                variant='h6'
                color='primary'
              >
                {title}
              </Typography>
              <Typography variant='subtitle1' color='primary'>
                {date}
              </Typography>
            </Stack>
            <Button
              className='like-button'
              onClick={clickLikeButton}
              variant={liked ? "contained" : "outlined"}
              color={liked ? "secondary" : "primary"}
            >
              {liked ? "Unlike" : "Like"}
            </Button>
          </Stack>
          <Typography
            className={classes.explanation}
            variant='body1'
            color='primary'
          >
            {explanation}
          </Typography>
        </Stack>
      </AnimateHeight>
      <img
        className={classes.loadingGif}
        src={loadingGif}
        hidden={height != 0}
      />
    </Stack>
  );
};

export default APODCard;
