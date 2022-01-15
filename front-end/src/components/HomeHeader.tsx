import React, { useEffect, useState, FC } from "react";
import HomeHeaderProps from "../types/HomeHeaderProps";
import ViewMode from "../types/ViewMode";
import {
  AppBar,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  LinearProgress,
} from "@mui/material";

const axios = require("axios");

const HomeHeader: FC<HomeHeaderProps> = ({
  usrName,
  onModeChange,
  inProgress,
}) => {
  const [ip, setIP] = useState("");

  //creating function to load ip address from the API
  const getIP = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    setIP(res.data.IPv4);
  };

  useEffect(() => {
    getIP();
  }, []);

  const [alignment, setAlignment] = useState(ViewMode.RandomPicture);

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: number
  ) => {
    console.log(newAlignment);
    if (newAlignment != null) {
      setAlignment(newAlignment);
      onModeChange(newAlignment);
    }
  };
  return (
    <Box sx={{ width: "100%" }}>
      <AppBar
        sx={{
          paddingTop: 2,
          paddingBottom: 2,
          paddingLeft: 3,
        }}
        position='fixed'
      >
        <Toolbar>
          <Typography variant='h4' color='primary' sx={{ mr: 2 }}>
            Spacestagram
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant='subtitle2' color='primary'>
              Launched from NASA Astronomy Picture of the Day API
            </Typography>
            <Typography variant='subtitle2' color='primary'>
              Landed at: {ip}
            </Typography>
            <Typography variant='subtitle2' color='primary'>
              Logged in as: {usrName}
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
          >
            <ToggleButton value={ViewMode.RandomPicture}>
              Random Pictures
            </ToggleButton>
            <ToggleButton value={ViewMode.MostRecent}>Most Recent</ToggleButton>
            <ToggleButton value={ViewMode.Liked}>Liked</ToggleButton>
          </ToggleButtonGroup>
        </Toolbar>
        {inProgress && (
          <Box sx={{ marginRight: 6 }}>
            <LinearProgress />
          </Box>
        )}
      </AppBar>
    </Box>
  );
};

export default HomeHeader;
