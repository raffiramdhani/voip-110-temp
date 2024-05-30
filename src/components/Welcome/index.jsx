import React, { useState, useEffect } from "react";
// import { Button } from "antd";
// import { MinusOutlined } from "@ant-design/icons";
import WelcomeIcon from "../../assets/welcome-icon.png";
import AgentDefault from "../../assets/agent-default.png";
import useAuth from "@/store/openingStore";
import { Flex, Button, Typography, Checkbox } from "antd";
import { MinusOutlined } from "@ant-design/icons";
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
    "By using this VOIP service, I agree to the  Terms & Condition Policy, and that the information I provide here is correct.";
  return (
    <>
      <Flex
        vertical
        // position={`${type === "web" ? "absolute" : ""}`}
        // width={`${type === "web" ? "25%" : "100%"}`}
        // height={`${type === "web" ? "70%" : "100vh"}`}
        // position="absolute"
        // width={`${type === "web" ? "25%" : "100%"}`}
        // height={`${type === "web" ? "70%" : "100vh"}`}
        // bottom="8rem"
        // right="2rem"
        // display="flex"
        // flexDirection="column"
        // boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
      >
        <Flex
          // display="flex"
          // flexDirection="column"
          vertical
          style={{
            padding: "12px 15px",
            backgroundColor: color.secondary,
          }}
        >
          <Flex align="center" justify="space-between">
            <Flex>
              <img src={WelcomeIcon} />
            </Flex>
            {type === "web" ? (
              <MinusOutlined
                onClick={() => {
                  setIsOpen("welcome");
                  // props.setOpenFloating(false);
                  props.setCloseCall();
                }}
              />
            ) : (
              <></>
            )}
          </Flex>
          <Flex style={{ margin: "10px 0px" }} vertical>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                marginBottom: 5,
              }}
            >
              <Typography.Text style={{ fontWeight: 600 }}>
                Welcome to
              </Typography.Text>
              <Typography.Text style={{ fontWeight: 600, color: color.main }}>
                OMNIX VoIP
              </Typography.Text>
            </div>
            <Typography.Text fontSize={12}>
              What can we help you today?
            </Typography.Text>
          </Flex>
        </Flex>
        <Flex
          vertical
          justify="space-between"
          style={{
            height: "359px",
            backgroundColor: "white",
            padding: "55px 15px",
          }}
        >
          <Flex
            style={{
              border: "1px solid #C4C4C4",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            <Checkbox
              style={{ padding: "0px 8px" }}
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              label="label"
            />
            <Flex vertical>
              <Typography.Text fontSize="14px" marginBottom={2}>
                {label}
              </Typography.Text>
              <Typography.Text
                color="#5A55D2"
                style={{
                  textDecoration: "underline",
                  fontSize: "14px",
                }}
                onClick={() => {
                  props.setOpenModalAgree(true);
                }}
              >
                Terms & Condition Policy
              </Typography.Text>
            </Flex>
          </Flex>
          <Flex>
            <Button
              block
              style={{
                borderRadius: "10px",
                marginTop: "1em",
                backgroundColor: !agree ? "#cccccc" : `${color.main}`,
                color: "white",
              }}
              disabled={!agree}
              // variant="contained"
              onClick={() => {
                setIsOpen("login");
              }}
            >
              I Agree
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Welcome;
