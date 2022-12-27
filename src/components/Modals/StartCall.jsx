import React from "react";
import {
  Dialog,
  DialogTitle,
  IconButton,
  Divider,
  Box,
  Typography,
  Button,
} from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

const StartCall = ({ handleSubmitMobile }) => {
  return (
    <Dialog open={true}>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#30D359",
          color: "white",
          border: "none",
          "&:focus": { bgcolor: "#30D359" },
        }}
        startIcon={<LocalPhoneIcon />}
        onClick={handleSubmitMobile}
      >
        Start Call
      </Button>
    </Dialog>
  );
};

export default StartCall;
