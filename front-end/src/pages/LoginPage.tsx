import React, { useContext, FC, useState } from "react";
import { makeStyles, createStyles } from "@mui/styles";
import {
  Stack,
  Typography,
  TextField,
  Box,
  Button,
  Theme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserNameContext } from "../context/ContextConfig";

const axios = require("axios");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      opacity: 1,
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "background.default",
    },
    loginContainer: {
      width: "300px",
      height: "auto",
      borderRadius: "10px",
      backgroundColor: theme.palette.background.paper,
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      padding: "20px",
    },
  })
);

const LoginPage = () => {
  const [userName, setUserName] = useContext(UserNameContext);
  const classes = useStyles();
  const navigate = useNavigate();

  const [textFieldInput, setTextFieldInput] = useState("");

  const login = () => {
    if (textFieldInput && textFieldInput.length <= 15) {
      axios
        .post(
          "https://us-central1-spacestagram-b087a.cloudfunctions.net/api/login",
          { usrName: textFieldInput }
        )
        .then((res: any) => {
          console.log("Successfully saved data!");
          console.log(res.data);
          setUserName(textFieldInput);
          navigate("/");
        })
        .catch((err: any) => {
          console.log("Error when saving application data: " + err);
          console.log(err.response.data.error);
        });
    }
  };
  return (
    <Box className={classes.root}>
      <Box className={classes.loginContainer}>
        <Stack spacing={3}>
          <Typography variant='h5' color='primary'>
            Spacestagram Login
          </Typography>
          <TextField
            label='User Name'
            variant='filled'
            onChange={(e) => setTextFieldInput(e.target.value.trim())}
            error={textFieldInput.length >= 15}
            helperText='User name must be 15 characters or less.'
            focused
          />
          <Button variant='outlined' onClick={login}>
            To the Stars !
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
