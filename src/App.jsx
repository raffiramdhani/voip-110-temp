import React, { useEffect, useState } from "react";
import { Box, } from "@mui/material";

import Pages from './page'

export default function App() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  // LISTEN HEIGHT WINDOW
  useEffect(() => {
    function handleResize() {
      setWindowHeight(window.innerHeight);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={windowHeight}
    >
      <Pages />
    </Box>
  );
}
