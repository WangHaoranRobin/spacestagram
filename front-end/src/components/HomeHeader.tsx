import React, { useEffect, useState, FC, useContext } from "react";
import HomeHeaderProps from "../types/HomeHeaderProps";
import ViewMode from "../types/ViewMode";
import Context from "../context/ContextConfig";
import {
  AppBar,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  LinearProgress,
  Theme,
  Hidden,
  Drawer,
  IconButton,
  useMediaQuery,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { makeStyles, createStyles, useTheme } from "@mui/styles";
import { useNavigate } from "react-router-dom";

const axios = require("axios");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      paddingTop: "10px",
      paddingBottom: "10px",
      paddingLeft: "20px",
    },
    subtitles: {
      flexGrow: 1,
      marginLeft: "10px",
      marginRight: "10px",
    },
    drawerPaper: {
      width: "350px",
    },
    closeMenuButton: {
      marginRight: "auto",
      marginLeft: 0,
    },
    toolbar: theme.mixins.toolbar,
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("lg")]: {
        display: "none",
      },
    },
    modeButtons: {
      marginLeft: "10px",
      marginRight: "10px",
      marginBottom: "10px",
    },
  })
);

const HomeHeader: FC<HomeHeaderProps> = ({
  usrName,
  onModeChange,
  inProgress,
}) => {
  const classes = useStyles();
  const isSmallScreen = useMediaQuery("(max-width:1280px)");
  const [alignment, setAlignment] = useState(ViewMode.RandomPicture);
  const [isOpen, setIsOpen] = useState(false);
  const {
    ModeDisabledContext: [isButtonsDisabled, setIsButtonsDisabled],
  } = useContext(Context);
  const navigate = useNavigate();
  const [ip, setIP] = useState("");

  //creating function to load ip address from the API
  const getIP = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    setIP(res.data.IPv4);
  };

  useEffect(() => {
    getIP();
  }, []);

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: number
  ) => {
    if (newAlignment != null) {
      setAlignment(newAlignment);
      onModeChange(newAlignment);
      setIsOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const subtitle = (
    <Box className={classes.subtitles}>
      <Typography variant='subtitle2' color='primary'>
        Launched from NASA APOD API
      </Typography>
      <Typography variant='subtitle2' color='primary'>
        Landed at: {ip}
      </Typography>
      <Typography variant='subtitle2' color='primary'>
        Logged in as: {usrName}
      </Typography>
    </Box>
  );

  const modeButtonGroup = (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      className={classes.modeButtons}
      disabled={isButtonsDisabled}
    >
      <ToggleButton value={ViewMode.RandomPicture}>
        Random Pictures
      </ToggleButton>
      <ToggleButton value={ViewMode.MostRecent}>Most Recent</ToggleButton>
      <ToggleButton value={ViewMode.Liked}>Liked</ToggleButton>
    </ToggleButtonGroup>
  );

  const logoutButton = (
    <Button color='error' onClick={logout}>
      Logout
    </Button>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar className={classes.appBar} position='fixed'>
        <Hidden lgUp implementation='css'>
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' noWrap>
              Spacestagram
            </Typography>
          </Toolbar>
        </Hidden>
        <Hidden lgDown implementation='css'>
          <Toolbar>
            <Typography variant='h4' color='primary' sx={{ mr: 2 }}>
              Spacestagram
            </Typography>
            {subtitle}
            {modeButtonGroup}
            {logoutButton}
          </Toolbar>
        </Hidden>
        {inProgress && (
          <Box sx={{ marginRight: 6 }}>
            <LinearProgress />
          </Box>
        )}
      </AppBar>
      <Hidden lgUp implementation='css'>
        <Drawer
          variant='temporary'
          anchor='left'
          open={isOpen && isSmallScreen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <IconButton
            onClick={handleDrawerToggle}
            className={classes.closeMenuButton}
          >
            <CloseIcon />
          </IconButton>
          {modeButtonGroup}
          {subtitle}
          {logoutButton}
        </Drawer>
      </Hidden>
    </Box>
  );
};

export default HomeHeader;
