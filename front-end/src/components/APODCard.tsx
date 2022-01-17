import { FC, useState, useEffect, useRef, useContext } from "react";
import APODCardProps from "../types/APODCardProps";
import VideoEmbed from "./VideoEmbedded";
import loadingGif from "../assets/LoadingEllipsis.gif";
import Context from "../context/ContextConfig";
import { Theme, Stack, Typography, Button, IconButton } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { makeStyles, createStyles } from "@mui/styles";
import { animated, useSpring } from "react-spring";

const axios = require("axios");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: "10px",
      overflow: "hidden",
    },
    cardInfo: {
      paddingLeft: "30px",
      paddingRight: "30px",
      paddingTop: "20px",
      paddingBottom: "20px",
    },
    cardTitleStripe: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      marginTop: "20px",
    },
    explanation: {
      marginBottom: "20px",
    },
    loadingGif: {
      width: "100%",
      height: "65px",
      objectFit: "contain",
    },
    image: {
      width: "100%",
      objectFit: "cover",
      minHeight: "100px",
      maxHeight: "500px",
    },
    likeButton: {
      marginLeft: "10px",
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
  noInteraction,
}) => {
  useEffect(() => {
    // Check if the APOD is liked
    if (usrName && !noInteraction) {
      axios
        .get(
          "https://us-central1-spacestagram-b087a.cloudfunctions.net/api/isLiked",
          {
            params: {
              usrName: usrName,
              APODDate: date,
            },
          }
        )
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
        setIsImageLoaded(true);
        // setHeight("auto");
      }
    }
  }, []);

  const classes = useStyles();
  const [liked, setLiked] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const ref = useRef<any>(null);
  const [style, animate] = useSpring(() => ({ height: "0px" }), []);
  const {
    ShowAlertContext: [showAlert, setShowAlert],
  } = useContext(Context);

  useEffect(() => {
    animate({
      height: (isImageLoaded ? ref.current?.offsetHeight : 0) + "px",
    });
  }, [animate, ref, isImageLoaded]);

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
      })
      .catch((err: any) => {
        console.log("Error when saving application data: " + err);
        console.log(err.response.data.error);
      });
    setLiked(!liked);
  };

  const clickShareButton = () => {
    // copy to clipboard https://wanghaoranrobin.github.io/spacestagram/share/${APODDate}
    navigator.clipboard.writeText(
      `https://wanghaoranrobin.github.io/spacestagram/share/${date}`
    );
    setShowAlert(true);
  };

  const imageLoaded = () => {
    setIsImageLoaded(true);
  };

  return (
    <Stack className={classes.container}>
      <img
        className={classes.loadingGif}
        src={loadingGif}
        hidden={isImageLoaded}
      />
      <animated.div
        style={{
          overflow: "hidden",
          width: "100%",
          ...style,
        }}
      >
        <div ref={ref}>
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
              {!noInteraction && (
                <Stack direction='row' spacing={1}>
                  <Button
                    className={classes.likeButton}
                    onClick={clickLikeButton}
                    variant={liked ? "contained" : "outlined"}
                    color={liked ? "secondary" : "primary"}
                  >
                    {liked ? "Unlike" : "Like"}
                  </Button>
                  <IconButton color='primary' onClick={clickShareButton}>
                    <ShareIcon />
                  </IconButton>
                </Stack>
              )}
            </Stack>
            <Typography
              className={classes.explanation}
              variant='body1'
              color='primary'
            >
              {explanation}
            </Typography>
          </Stack>
        </div>
      </animated.div>
    </Stack>
  );
};

export default APODCard;
