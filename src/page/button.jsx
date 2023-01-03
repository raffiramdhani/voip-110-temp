import React from "react";
import { Box } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
const env = import.meta.env;
import VoiceIcon from "../assets/voice-icon.png";

export default function Button({ onClick }) {
  return (
    // <Box
    //   display="flex"
    //   justifyContent="center"
    //   alignItems="center"
    //   bgcolor={env.VITE_APP_MAIN_COLOR}
    //   width="60px"
    //   height="60px"
    //   borderRadius="100%"
    //   bottom="10px"
    //   right="10px"
    //   position="absolute"
    //   sx={{ cursor: "pointer", boxShadow: "0px 0px 10px 3px rgb(0 0 0 / 35%)" }}
    //   onClick={onClick}
    // >
    //   <SupportAgentIcon sx={{ color: "#fff", fontSize: 40 }} />
    // </Box>
    <div
    style={{ position: "absolute", bottom: "15px", right: "15px" }}
    //   onClick={() => {
    //     setOpen(!open);
    //     <Navigate to="/auth" />;
    //   }}
  >
    <div
      style={{
        backgroundColor: `${env.VITE_APP_MAIN_COLOR}`,
        width: 65,
        height: 60,
        borderRadius: "34px 8px 34px 34px",
        boxShadow: "0 5px 4px 0 rgb(0 0 0 / 26%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        cursor: "pointer",
        // transform: `translateX(0px) translateY(${positionPopUp}%) translateZ(0px)`,
        //   transform: `scale(${!open ? 1 : 0})`,
        //   opacity: !open ? "100%" : "0%",
        zIndex: 3,
        transition: "all 200ms ease-in-out",
      }}
      onClick={onClick}
    >
      <img
        src={`${VoiceIcon}`}
        srcSet={`${VoiceIcon}`}
        alt={`${VoiceIcon}asd`}
        loading="lazy"
        style={{
          height: "25px",
          width: "25px",
        }}
      />
    </div>
  </div>
  );
}
