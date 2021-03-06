import { useContext } from "react";
import { Alert, AlertTitle, IconButton, Collapse } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Context from "../context/ContextConfig";

const LinkAlert = () => {
  const {
    ShowAlertContext: [showAlert, setShowAlert],
  } = useContext(Context);
  return (
    <Collapse
      sx={{
        width: "90%",
        position: "fixed",
        bottom: "10px",
        left: "5%",
      }}
      in={showAlert}
    >
      <Alert
        action={
          <IconButton
            aria-label='close'
            color='inherit'
            size='small'
            onClick={() => {
              setShowAlert(false);
            }}
          >
            <CloseIcon fontSize='inherit' />
          </IconButton>
        }
      >
        <AlertTitle>Success</AlertTitle>
        Copied Link to Clipboard — <strong>share with friends!</strong>
      </Alert>
    </Collapse>
  );
};

export default LinkAlert;
