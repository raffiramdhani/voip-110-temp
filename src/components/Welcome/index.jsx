import React, { useState, useEffect } from "react";
// import { Button } from "antd";
// import { MinusOutlined } from "@ant-design/icons";
import WelcomeIcon from "../../assets/logo-tmi.png";
import AgentDefault from "../../assets/agent-default.png";
import useAuth from "@/store/openingStore";
import {
  Box,
  // Button,
  Avatar,
  // Typography,
  TextField,
  // Checkbox,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Row, Col, Typography, Button, Checkbox, Flex } from "antd";

import RemoveIcon from "@mui/icons-material/Remove";
import { MinusOutlined } from "@ant-design/icons";
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
  const { Title, Text } = Typography;
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
    <div style={{ width: "100%" }}>
      <div style={{ padding: "0px 15px", backgroundColor: color.main }}>
        <Row justify="space-between" align="middle">
          <Col flex="auto">
            <Title
              level={windowWidth <= 425 ? 4 : 2}
              style={{
                fontWeight: 400,
                color: color.textTitle,
                display: "flex",
              }}
            >
              TMI VoIP
            </Title>
          </Col>
          <Col>
            <Row align="middle" gutter={16}>
              <Col>
                <img
                  src={WelcomeIcon}
                  style={{ maxWidth: windowWidth <= 425 ? 150 : 200 }}
                  alt="Welcome Icon"
                />
              </Col>
              {type === "web" && (
                <Col>
                  <Button
                    type="text"
                    icon={<MinusOutlined />}
                    onClick={() => {
                      setIsOpen("welcome");
                      props.setCloseCall();
                    }}
                  />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </div>
      <div
        style={{
          height: "359px",
          backgroundColor: "white",
          padding: "55px 15px",
        }}
      >
        <Row
          style={{
            border: "1px solid #C4C4C4",
            borderRadius: "10px",
            padding: "10px",
          }}
          align="top"
        >
          <Flex align="start">
            <Checkbox
              style={{ marginRight: 8 }}
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            ></Checkbox>
            <Flex vertical>
              <Text style={{ marginBottom: 8 }}>{label}</Text>
              <Text
                style={{
                  color: "#5A55D2",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => {
                  props.setOpenModalAgree(true);
                }}
              >
                Terms & Condition Policy
              </Text>
            </Flex>
          </Flex>
          <Col style={{ marginTop: "1rem" }}></Col>
        </Row>
        <div style={{ backgroundColor: "white", padding: "12px 15px" }}>
          <Button
            style={{
              width: "100%",
              borderRadius: "10px",
              marginTop: "1em",
              backgroundColor: !agree ? "#cccccc" : color.secondary,
              color: "white",
            }}
            disabled={!agree}
            onClick={() => {
              setIsOpen("login");
            }}
          >
            I Agree
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
