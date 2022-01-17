import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SharePage from "./pages/SharePage";
import { UserNameContext, ShowAlertContext } from "./context/ContextConfig";
import RequireAuth from "./components/RequireAuth";
import LinkAlert from "./components/LinkAlert";
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
      fontSize: number;
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
      fontSize?: number;
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
  const [doesShowLinkAlert, setDoesShowLinkAlert] = useState(false);

  return (
    <div className='App'>
      <UserNameContext.Provider value={[usrName, setUsrName]}>
        <ShowAlertContext.Provider
          value={[doesShowLinkAlert, setDoesShowLinkAlert]}
        >
          <ThemeProvider theme={theme}>
            <LinkAlert />
            <Routes>
              <Route
                path='/'
                element={
                  <RequireAuth>
                    <Home />
                  </RequireAuth>
                }
              />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/share/:APODDate' element={<SharePage />} />
            </Routes>
          </ThemeProvider>
        </ShowAlertContext.Provider>
      </UserNameContext.Provider>
    </div>
  );
}

export default App;
