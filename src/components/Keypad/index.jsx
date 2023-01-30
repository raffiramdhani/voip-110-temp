import React from "react";
import { Box, Grid, TextField, Button, IconButton } from "@mui/material";
import Delete from "@/assets/delete.png";
import EndCall from "@/assets/end-call.png";
import NumPad from "@/styles/AlfaNumerik";
const Keypad = ({ setIsKeypad, endCall, isCalling, onDialPadPressed }) => {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const deleteNumber = () => {
    const delNum = phoneNumber.substring(0, phoneNumber.length - 1);
    return delNum;
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        marginTop: 5,
        height: "495px",
      }}
    >
      {/* DIAL PAD  */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <TextField
          type="number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          variant="standard"
        />
        <IconButton onClick={() => setPhoneNumber(deleteNumber())}>
          <img src={Delete} />
        </IconButton>
      </Box>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
        {NumPad.map((d, i) => (
          <Grid
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            onClick={() => {
              if (isCalling) {
                onDialPadPressed(d.number);
              }
            }}
            key={i}
            item
            xs={4}
          >
            <Button
              variant="text"
              size="small"
              sx={{
                width: "100%",
                height: "max-content",
                textAlign: "center",
                "&:hover": { bgcolor: "#f4f4f4" },
                "&:focus": { bgcolor: "#f4f4f4" },
                padding: "10px",
                // bgcolor: isCalling ? "#fff" : "#f4f4f4",
                // cursor: isCalling ? "pointer" : "not-allowed",
                cursor: "pointer",
                color: "black",
              }}
              onClick={() => setPhoneNumber(phoneNumber + d.number)}
            >
              {d.number}
              <br />
              {d.letter}
            </Button>
          </Grid>
        ))}
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1 }}
          marginTop="10px"
        >
          <Grid
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            // onClick={() => {
            //   if (isCalling) {
            //     onDialPadPressed(d);
            //   }
            // }}
            item
            xs={4}
          >
            <Box></Box>
          </Grid>
          <Grid
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            // onClick={() => {
            //   if (isCalling) {
            //     onDialPadPressed(d);
            //   }
            // }}
            item
            xs={4}
          >
            <IconButton
              sx={{
                borderRadius: 50,
                overflow: "hidden",
                padding: "25px 15px",
                backgroundColor: "#FF3B30",
              }}
              onClick={() => endCall()}
            >
              <img src={EndCall} />
            </IconButton>
          </Grid>
          <Grid
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            // onClick={() => {
            //   if (isCalling) {
            //     onDialPadPressed(d);
            //   }
            // }}
            item
            xs={4}
          >
            <Button variant="text" onClick={() => setIsKeypad(false)}>
              Hide
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Keypad;
