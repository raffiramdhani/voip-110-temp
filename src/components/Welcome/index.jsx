import React, { useState, useEffect } from 'react';
// import { Button } from "antd";
// import { MinusOutlined } from "@ant-design/icons";
import WelcomeIcon from '../../assets/polri.svg';
import AgentDefault from '../../assets/agent-default.png';
import useAuth from '@/store/openingStore';
import {
  Box,
  Button,
  Avatar,
  Typography,
  TextField,
  Checkbox,
  CircularProgress,
  IconButton,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
const env = import.meta.env;

const color = {
  textTitle: '#fff',
  main: env.VITE_APP_MAIN_COLOR,
  secondary: env.VITE_APP_SECONDARY_COLOR,
};

const styling = {
  TextField: {
    '& label.Mui-focused': {
      color: color.secondary,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: color.secondary,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: color.main,
      },
      '&:hover fieldset': {
        borderColor: '#001219',
      },
      '&.Mui-focused fieldset': {
        borderColor: color.secondary,
      },
    },
  },
  Checkbox: {
    color: color.main,
    '&.Mui-checked': {
      color: color.main,
    },
  },
  LabelCheckBox: {
    color: color.secondary,
    cursor: 'pointer',
    fontSize: '14px',
  },
};

const Welcome = (props) => {
  const { setIsOpen } = useAuth((state) => state);
  const [agree, setAgree] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // const [type, setType] = useState("");
  const url_string = window.location.href;
  const url_params = new URL(url_string);
  const type = url_params.searchParams.get('type');
  // LISTEN HEIGHT WINDOW
  useEffect(() => {
    // window.addEventListener("message", (e) => console.log(e));
    function handleResize() {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        // setType("mobile");
      }
      if (window.innerWidth >= 768) {
        // setType("web");
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      // window.removeEventListener("message", (e) => console.log(e));
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const label =
    'Dengan menggunakan layanan voip, saya menyetujui syarat dan ketentuan kebijakan, dan informasinya yang saya berikan di sini adalah benar';
  return (
    <>
      <Box
        // position={`${type === "web" ? "absolute" : ""}`}
        // width={`${type === "web" ? "25%" : "100%"}`}
        // height={`${type === "web" ? "70%" : "100vh"}`}
        // position="absolute"
        // width={`${type === "web" ? "25%" : "100%"}`}
        // height={`${type === "web" ? "70%" : "100vh"}`}
        bottom="8rem"
        right="2rem"
        display="flex"
        flexDirection="column"
        // boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
      >
        <Box
          padding="12px 15px"
          display="flex"
          flexDirection="column"
          bgcolor={color.secondary}
        >
          <Box
            width="100%"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <img src={WelcomeIcon} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Selamat Datang di layanan{' '}
                  <span style={{ color: color.main, fontWeight: 600 }}>
                    VoIP 110
                  </span>
                </Typography>

                <Typography fontSize={12}>Layanan Polisi 110</Typography>
              </div>
            </Box>
            {type === 'web' ? (
              <IconButton
                onClick={() => {
                  setIsOpen('welcome');
                  // props.setOpenFloating(false);
                  props.setCloseCall();
                }}
              >
                <RemoveIcon />
              </IconButton>
            ) : (
              <></>
            )}
          </Box>
          <Box marginY="10px"></Box>
        </Box>
        <Box height={'359px'} backgroundColor="white" padding="55px 15px">
          <Box
            display="flex"
            flexDirection="row"
            alignItems="start"
            border="1px solid #C4C4C4"
            borderRadius="10px"
            padding="10px"
          >
            <Checkbox
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              label="label"
            />
            <Box marginTop={1}>
              <Typography fontSize="14px" marginBottom={2}>
                {label}
              </Typography>
              <Typography
                color={color.main}
                style={{ textDecoration: 'underline' }}
                onClick={() => {
                  props.setOpenModalAgree(true);
                }}
                fontSize="14px"
              >
                Kebijakan Syarat & Ketentuan
              </Typography>
            </Box>
          </Box>
          <Box backgroundColor="white" padding="12px 15px" marginTop={25}>
            <Button
              sx={{
                width: '100%',
                borderRadius: '10px',
                marginTop: '1em',
                backgroundColor: `${color.main}`,
                color: 'white',
              }}
              disabled={!agree}
              variant="contained"
              onClick={() => {
                setIsOpen('login');
              }}
            >
              Saya Setuju
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Welcome;
