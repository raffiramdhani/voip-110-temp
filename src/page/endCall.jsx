import React from "react";
import { Grid, Typography } from "@mui/material";
import BottomSheet from "@/components/BottomSheet";

export default function endCall() {
  // React.useEffect(() => {
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 5000);
  // });
  return (
    <Grid
      container
      spacing={0}
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", backgroundColor: "white" }}
    >
      <BottomSheet open={true} displayRemark={false} />
      {/* <Typography>Terima kasih telah menghubungi kami.</Typography> */}
    </Grid>
  );
}
