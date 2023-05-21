import { Grid, Typography } from "@mui/material";
import React from "react";
import useRouteStore from "@/store/routeStore";

export default function endCall() {
  const route = useRouteStore((state) => state);
  React.useEffect(() => {
    setTimeout(() => {
      route.push("login")
    }, 5000);
  })
  return (
    <Grid
      container
      spacing={0}
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", backgroundColor: "white" }}
    >
      <Typography>Terima kasih telah menghubungi kami.</Typography>
    </Grid>
  );
}
