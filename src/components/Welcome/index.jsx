import React, { useState, useEffect } from "react";
// import { Button } from "antd";
// import { MinusOutlined } from "@ant-design/icons";
import WelcomeIcon from "../../assets/welcome-icon.png";
import AgentDefault from "../../assets/agent-default.png";
import useAuth from "@/store/openingStore";
import {
  Box,
  Button,
  Avatar,
  Typography,
  TextField,
  Checkbox,
  CircularProgress,
  IconButton,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
const env = import.meta.env;

const color = {
  textTitle: "#fff",
  main: env.VITE_APP_MAIN_COLOR,
  secondary: "#EBE8FF",
};

const styling = {
  TextField: {
    "& label.Mui-focused": {
      color: color.secondary,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: color.secondary,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: color.main,
      },
      "&:hover fieldset": {
        borderColor: "#001219",
      },
      "&.Mui-focused fieldset": {
        borderColor: color.secondary,
      },
    },
  },
  Checkbox: {
    color: color.main,
    "&.Mui-checked": {
      color: color.main,
    },
  },
  LabelCheckBox: {
    color: color.secondary,
    cursor: "pointer",
    fontSize: "14px",
  },
};

const Welcome = ({ setIsLogin, setOpenFloating }) => {
  const { setIsOpen } = useAuth((state) => state);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [type, setType] = useState("");

  // LISTEN HEIGHT WINDOW
  useEffect(() => {
    // window.addEventListener("message", (e) => console.log(e));
    function handleResize() {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setType("mobile");
      }
      if (window.innerWidth >= 768) {
        setType("web");
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      // window.removeEventListener("message", (e) => console.log(e));
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <Box
        position={`${type === "web" ? "absolute" : ""}`}
        width={`${type === "web" ? "25%" : "100%"}`}
        height={`${type === "web" ? "70%" : "100vh"}`}
        bottom="8rem"
        right="2rem"
        display="flex"
        flexDirection="column"
        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
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
              <Typography color={color.main}>OMNIX VoIP</Typography>
            </Box>
            <IconButton
              onClick={() => {
                setIsOpen("welcome"), setOpenFloating(false);
              }}
            >
              <RemoveIcon />
            </IconButton>
          </Box>
          <Box marginY="10px">
            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              Hi Welcome!
            </Typography>
            <Typography>What can we help you today?</Typography>
          </Box>
        </Box>
        <Box position="absolute" bottom="0px" padding="12px 15px">
          <Box>
            <Typography>We are online!</Typography>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography>
                You can start a conversation with our agents (livechat's name)
              </Typography>
              <img src={AgentDefault} />
            </Box>
            <Box>
              <Button
                sx={{
                  width: "100%",
                  borderRadius: "10px",
                  marginTop: "1em",
                  backgroundColor: `${color.main}`,
                  color: "white",
                }}
                variant="contained"
                onClick={() => {
                  setIsOpen("login");
                }}
              >
                Start
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Welcome;
