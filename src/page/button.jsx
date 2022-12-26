import React from "react";
import { Box } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
const env = import.meta.env;

export default function Button({ onClick }) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor={env.VITE_APP_MAIN_COLOR}
      width="60px"
      height="60px"
      borderRadius="100%"
      bottom="10px"
      right="10px"
      position="absolute"
      sx={{ cursor: "pointer", boxShadow: "0px 0px 10px 3px rgb(0 0 0 / 35%)" }}
      onClick={onClick}
    >
      <SupportAgentIcon sx={{ color: "#fff", fontSize: 40 }} />
    </Box>
  );
}
