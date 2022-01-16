import { FC, useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Box,
  Button,
  Theme,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import LoginBoxProps from "../types/LoginBoxProps";

const axios = require("axios");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
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

const LoginBox: FC<LoginBoxProps> = ({ onLogin }) => {
  const classes = useStyles();

  const [usrName, setUsrName] = useState("");

  const login = () => {
    if (usrName && usrName.length <= 15) {
      axios
        .post(
          "https://us-central1-spacestagram-b087a.cloudfunctions.net/api/login",
          { usrName: usrName }
        )
        .then((res: any) => {
          console.log("Successfully saved data!");
          console.log(res.data);
          onLogin(usrName);
        })
        .catch((err: any) => {
          console.log("Error when saving application data: " + err);
          console.log(err.response.data.error);
        });
    }
  };

  return (
    <Box className={classes.container}>
      <Stack spacing={3}>
        <Typography variant='h5' color='primary'>
          Spacestagram Login
        </Typography>
        <TextField
          label='User Name'
          variant='filled'
          onChange={(e) => setUsrName(e.target.value.trim())}
          error={usrName.length >= 15}
          helperText='User name must be 15 characters or less.'
          focused
        />
        <Button variant='outlined' onClick={login}>
          To the Stars !
        </Button>
      </Stack>
    </Box>
  );
};

export default LoginBox;
