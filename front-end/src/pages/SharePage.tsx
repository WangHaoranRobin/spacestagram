import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import APODCard from "../components/APODCard";
import APODCardProps from "../types/APODCardProps";
const axios = require("axios");

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
          url: response.data.url,
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
      <Stack>
        <Typography variant='subtitle2' color='primary'>
          Powered by NASA APOD API
        </Typography>
        <Box sx={{ width: "500px" }}>{card && <APODCard {...card} />}</Box>
      </Stack>
    </Box>
  );
};

export default SharePage;
