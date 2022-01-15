import React, { useState } from "react";
import Home from "./pages/HomePage/Home";
import LoginBox from "./components/LoginBox";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import "./App.css";

declare module "@mui/material/styles" {
  interface Theme {
    Palette: {
      mode: string;
      primary: {
        main: string;
      };
      background: {
        default: string;
        paper: string;
      };
    };
    Typography: {
      fontFamily: string[];
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    Palette?: {
      mode?: string;
      primary?: {
        main?: string;
      };
      background?: {
        default?: string;
        paper?: string;
      };
    };
    Typography?: {
      fontFamily?: string[];
    };
  }
}

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#a1cfff",
    },
    background: {
      default: "#14182e",
      paper: "#1e3167",
    },
  },
  typography: {
    fontFamily: "Chilanka",
  },
});

function App() {
  const [usrName, setUsrName] = useState("");

  const login = (usrName: string) => {
    setUsrName(usrName);
  };

  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        {usrName ? (
          <Home usrName={usrName} />
        ) : (
          <Box
            sx={{
              position: "absolute",
              opacity: 1,
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "background.default",
            }}
          >
            <LoginBox onLogin={login} />
          </Box>
        )}
      </ThemeProvider>
    </div>
  );
}

export default App;
