import { Grid, Typography } from "@mui/material";
import React from "react";

export default function endCall() {
  return (
    <Grid
      container
      spacing={0}
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh" }}
    >
      <Typography>Terimakasih telah menghubungi kami.</Typography>
    </Grid>
  );
}
