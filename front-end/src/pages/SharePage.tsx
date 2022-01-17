import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import APODCard from "../components/APODCard";
import APODCardProps from "../types/APODCardProps";
import UrlType from "../types/UrlType";

const axios = require("axios");

const urlType = (url: string): UrlType => {
  // if is a youtube url, return Youtube
  // if ends with .jpg, return Image
  if (!url) return UrlType.Other;
  if (url.includes("youtube.com")) return UrlType.Youtube;
  else if (url.includes(".jpg")) return UrlType.Image;
  return UrlType.Other;
};

const SharePage = () => {
  const params = useParams();
  const [card, setCard] = useState<APODCardProps>();

  useEffect(() => {
    // Get the card info from APOD api
    axios
      .get(
        "https://api.nasa.gov/planetary/apod?api_key=JeERhunvZLQ1Xmhv8ZT166RKxzzEbSjCuc4LaikG",
        { params: { date: params.APODDate } }
      )
      .then((response: any) => {
        // Make an APODCardProps from the response
        setCard({
          usrName: params.usrName,
          url:
            urlType(response.data.hdurl) === UrlType.Other
              ? response.data.url
              : response.data.hdurl,
          title: response.data.title,
          explanation: response.data.explanation,
          date: response.data.date,
          media_type: response.data.media_type,
          noInteraction: true,
        });
      });
  }, []);

  return (
    <Box
      sx={{
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
        display: "flex",
        paddingTop: "50px",
        paddingBottom: "50px",
      }}
    >
      <Stack sx={{ maxWidth: "500px", marginLeft: "5%", marginRight: "5%" }}>
        <Typography variant='subtitle2' color='primary'>
          Powered by NASA APOD API
        </Typography>
        <Box>{card && <APODCard {...card} />}</Box>
      </Stack>
    </Box>
  );
};

export default SharePage;
