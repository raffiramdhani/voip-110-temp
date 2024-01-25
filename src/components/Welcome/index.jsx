import React, { useState, useEffect } from "react";
// import { Button } from "antd";
// import { MinusOutlined } from "@ant-design/icons";
import WelcomeIcon from "../../assets/logo-tmi.png";
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
  main: "rgba(2, 43, 57, 0.9)",
  secondary: "#0090A1",
};

// const styling = {
//   TextField: {
//     "& label.Mui-focused": {
//       color: color.secondary,
//     },
//     "& .MuiInput-underline:after": {
//       borderBottomColor: color.secondary,
//     },
//     "& .MuiOutlinedInput-root": {
//       "& fieldset": {
//         borderColor: color.main,
//       },
//       "&:hover fieldset": {
//         borderColor: "#001219",
//       },
//       "&.Mui-focused fieldset": {
//         borderColor: color.secondary,
//       },
//     },
//   },
//   Checkbox: {
//     color: color.main,
//     "&.Mui-checked": {
//       color: color.main,
//     },
//   },
//   LabelCheckBox: {
//     color: color.secondary,
//     cursor: "pointer",
//     fontSize: "14px",
//   },
// };

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
    "By using this VOIP service, I agree to the  Terms & Condition Policy, and that the information I provide here is correct.";
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
          padding="0px 15px"
          display="flex"
          flexDirection="column"
          bgcolor={color.main}
        >
          <Box
            width="100%"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              fontSize={windowWidth <= 425 ? 18 : 24}
              fontWeight={400}
              color={color.textTitle}
              display="flex"
              flex={1}
            >
              TMI VoIP
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <img
                src={WelcomeIcon}
                style={{ maxWidth: windowWidth <= 425 ? 150 : 200 }}
              />
            </Box>
            {type === "web" ? (
              <IconButton
                onClick={() => {
                  setIsOpen("welcome");
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
        </Box>
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
                Terms & Condition Policy
              </Typography>
            </Box>
          </Box>
          <Box backgroundColor="white" padding="12px 15px" marginTop={25}>
            <Button
              sx={{
                width: "100%",
                borderRadius: "10px",
                marginTop: "1em",
                backgroundColor: `${color.secondary}`,
                color: "white",
              }}
              disabled={!agree}
              variant="contained"
              onClick={() => {
                setIsOpen("login");
              }}
            >
              I Agree
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Welcome;
