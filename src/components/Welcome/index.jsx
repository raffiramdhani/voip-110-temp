import React, { useState, useEffect } from "react";
// import { Button } from "antd";
// import { MinusOutlined } from "@ant-design/icons";
// import WelcomeIcon from "../../assets/welcome-icon.png";
// import AgentDefault from "../../assets/agent-default.png";
// import BJBLogo from "../../assets/bjb-logo.png";
import BJBLogo from "../../assets/bjb-logo.png";
import useAuth from "@/store/openingStore";
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  Checkbox,
} from "@mui/material";
// import RemoveIcon from "@mui/icons-material/Remove";
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

const Welcome = (props) => {
  const { setIsOpen } = useAuth((state) => state);
  const [agree, setAgree] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // const [type, setType] = useState("");
  const url_string = window.location.href;
  const url_params = new URL(url_string);
  const type = url_params.searchParams.get("type");
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

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      // window.removeEventListener("message", (e) => console.log(e));
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const label =
    "Dengan menggunakan Layanan Voip, Saya menyetujui kebijakan syarat dan ketentuan, serta informasi yang Saya berikan di sini adalah benar.";
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
        {/* <Box
          padding="12px 15px"
          display="flex"
          flexDirection="column"
          bgcolor={color.secondary}
        > */}
        {/* <Box
            width="100%"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <img src={WelcomeIcon} />
            </Box>
            {type === "web" ? (
              <IconButton
                onClick={() => {
                  setIsOpen("welcome");
                  props.setCloseCall();
                }}
              >
                <RemoveIcon />
              </IconButton>
            ) : (
              <></>
            )}
          </Box> */}
        {/* <Box marginY="10px">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                marginBottom: 5,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Welcome to
              </Typography>
              <Typography fontWeight={600} color={color.main}>
                OMNIX VoIP
              </Typography>
            </div>
            <Typography fontSize={12}>What can we help you today?</Typography>
          </Box> */}
        {/* </Box> */}
        <Grid container>
          <Grid item xs={12} style={{ background: "#165581", display: "flex" }}>
            <Box style={{
              width: "100px",
              height: "40px",
              padding: "7px 15px"
            }}>
              <img src={BJBLogo} style={{ maxHeight: "100%", maxWidth: "100%" }} />
            </Box>
            <Typography
              variant="h6"
              style={{
                fontSize:"13px",
                color: "#fff",
                margin:"auto 16px auto auto"
              }}
            >
              <span style={{
                fontWeight:600,
                color: "#FCCC0E"
              }}>bjb </span>
              Call
            </Typography>
          </Grid>
          {/* <Grid item xs={3} style={{ background: "#25A9E1" }}></Grid>
          <Grid item xs={3} style={{ background: "#FECC07" }}></Grid> */}
        </Grid>
        <Box height={"359px"} backgroundColor="white" padding="55px 15px">
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
                color="#5A55D2"
                style={{ textDecoration: "underline" }}
                onClick={() => {
                  props.setOpenModalAgree(true);
                }}
                fontSize="14px"
              >
                Syarat dan Ketentuan
              </Typography>
            </Box>
          </Box>
          <Box backgroundColor="white" padding="12px 15px" marginTop={25}>
            <Button
              sx={{
                width: "100%",
                borderRadius: "50px",
                marginTop: "1em",
                backgroundColor: `${color.main}`,
                color: "white",
              }}
              disabled={!agree}
              variant="contained"
              onClick={() => {
                setIsOpen("login");
              }}
            >
              Saya setuju
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Welcome;
