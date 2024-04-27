import React, { useEffect, useState } from 'react';
import { Box, Fade, Typography } from '@mui/material';
import useRouteStore from '@/store/routeStore';

import Pages from './page';
import Button from './page/button';

export default function App() {
  const route = useRouteStore((state) => state);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const url_string = window.location.href;
  const url_params = new URL(url_string);
  const type = url_params.searchParams.get('type');

  let showCallPage = route.ui.openCallUI;

  if (type !== 'web') {
    showCallPage = true;
  }

  // LISTEN HEIGHT WINDOW
  useEffect(() => {
    // window.addEventListener("message", (e) => console.log(e));
    function handleResize() {
      setWindowHeight(window.innerHeight);
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      // window.removeEventListener("message", (e) => console.log(e));
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const setOpenCall = () => {
    if (!route.ui.openCallUI) {
      route.setOpenIframe(true);
      window.parent.postMessage('show', '*');
    }
  };

  const setCloseCall = () => {
    if (route.ui.openCallUI) {
      route.setOpenIframe(false);
      window.parent.postMessage('hide', '*');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={windowHeight}
    >
      <Fade in={showCallPage}>
        <Box width="100%" height="100%">
          {/* {type === "web" && (
            <Box
              sx={{
                position: "absolute",
                top: "5px",
                right: "5px",
                bgcolor: "#820011",
                borderRadius: "9px",
                cursor: "pointer",
                height: "20px",
                width: "20px",
              }}
              onClick={() => setCloseCall()}
            >
              close icon
              <CloseIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
          )} */}

          <Pages
            type={type}
            showCallPage={showCallPage}
            setCloseCall={setCloseCall}
            setOpenCall={setOpenCall}
          />

          <Typography
            style={{
              position: 'fixed',
              bottom: 0,
              right: 0,
              background: '#000',
              fontSize: '8px',
              padding: '3px',
              color: '#fff',
              borderTopLeftRadius: 5,
              fontWeight: 'bold',
            }}
          >
            Version: 1.3
          </Typography>
        </Box>
      </Fade>
      {!showCallPage && <Button onClick={() => setOpenCall()} />}
    </Box>
  );
}
