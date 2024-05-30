import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  // Grid,
  Paper,
  // Button,
  // Typography,
  // Button,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { v4 as uuidv4 } from "uuid";

import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";

import * as Flashphoner from "@flashphoner/websdk";
import DTMFSound from "../assets/dtmf.wav";
import ringingSound from "../assets/phone-ringing.wav";

import { decrypt } from "@/utils/encrypt";
import useProfileStore from "@/store/profileStore";

import NumPad from "@/styles/AlfaNumerik.jsx";
import CallerAva from "../assets/caller-ava.png";

import MuteOff from "../assets/mute-off.png";
import MuteOn from "../assets/mute-on.png";
import SpeakerOn from "../assets/speaker-on.png";
import SpeakerOff from "../assets/speaker-off.png";
import KeypadIcon from "../assets/keypad.png";
import EndCall from "../assets/end-call.png";

import Keypad from "../components/Keypad";
import useRouteStore from "@/store/routeStore";
import { Flex, Typography, Button, Col, Row } from "antd";
import { MinusOutlined } from "@ant-design/icons";
const env = import.meta.env;

const genID = uuidv4();

export default function phoneCall() {
  let SESSION_STATUS = Flashphoner.constants.SESSION_STATUS;
  let CALL_STATUS = Flashphoner.constants.CALL_STATUS;
  let Browser = Flashphoner.Browser;

  const route = useRouteStore((state) => state);
  const profile = useProfileStore((state) => state);
  const me = useRef();
  const currentCall = useRef();
  const localVideo = useRef();
  const remoteVideo = useRef();
  const dtmfSound = useMemo(() => new Audio(DTMFSound), []);
  const ringingSounds = useMemo(() => new Audio(ringingSound), []);
  const [isMuted, setIsMuted] = useState(false);
  const [reqExten, setReqExten] = useState(null);
  const [statusRegiter, setStatusRegister] = useState(null);
  const [statusCall, setStatusCall] = useState("waiting");

  const [isFinish, setIsFinish] = useState(true);
  const [isEstablished, setIsEstablished] = useState(false);

  const [isKeypad, setIsKeypad] = useState(false);

  if (statusCall === "RING") {
    ringingSounds.play();
  } else {
    ringingSounds.pause();
  }

  useEffect(() => {
    initFlashphoner();
    // console.log("1.0.0");
  }, [isFinish]);

  // STEP 1
  const initFlashphoner = () => {
    try {
      Flashphoner.init();
      connect();
    } catch (error) {
      console.log("ERROR ==>>", error);
    }
  };

  // STEP 2
  const requestExtension = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", env.VITE_APP_AUTHORIZATION);
    myHeaders.append("Content-Type", "application/json");

    const encryptedParams = new URLSearchParams(window.location.search)
      ?.get("key")
      ?.split(" ")
      ?.join("+")
      ?.replace(/\\/g, "");

    const params = JSON.parse(decrypt(encryptedParams));

    var raw = JSON.stringify({
      menu: params?.menu_id,
      is_postlogin: params?.user?.email ? 1 : 0,
      name: params?.user?.fullname,
      username: "bsi",
      email: params?.user?.email,
      phone: params?.user?.phone,
      token: env.VITE_APP_EXTEN_TOKEN,
      type: env.VITE_APP_EXTEN_TYPE,
      call_id: genID.slice(0, 8),
      vdn: params?.vdn,
      timestamp: new Date(),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const data = await fetch(
      `${env.VITE_APP_EXTEN_URL}/voip/req_extention/${env.VITE_APP_EXTEN_TENANT}`,
      requestOptions
    )
      .then((res) => res.text())
      .then((res) => {
        const decryptText = decrypt(res);

        if (decryptText) {
          const decrypted = JSON.parse(decryptText);
          // console.log("decrypted>>>", decrypted);
          return {
            token: decrypted.token,
            exten: decrypted.exten,
            secret: decrypted.secret,
            callto: decrypted.callto + params?.vdn,
            sip: decrypted.sip,
            rtc: decrypted.rtc,
            api: decrypted.api,
          };
        }
      })
      .catch((err) => console.log("ERROR ==>>", err));

    return data;
  };

  // STEP 3
  const connect = async () => {
    const data = profile.reqExten;
    // const data = await requestExtension();

    if (
      Browser.isSafariWebRTC() &&
      Flashphoner.getMediaProviders()[0] === "WebRTC"
    ) {
      Flashphoner.playFirstVideo(localVideo.current, true);
      Flashphoner.playFirstVideo(remoteVideo.current, false);
    }

    const sipOptions = {
      login: data.exten,
      password: data.secret,
      authenticationName: data.exten,
      domain: data.sip.split(":")[0],
      outboundProxy: data.sip.split(":")[0],
      port: data.sip.split(":")[1],
      useProxy: true,
      registerRequired: true,
    };

    const connectionOptions = {
      urlServer: data.rtc,
      sipOptions,
    };
    // console.log("connectionOption >>", sipOptions);

    Flashphoner.createSession(connectionOptions)
      .on(SESSION_STATUS.ESTABLISHED, function (session) {
        call({ session, reqExten: data });
        // console.log("Register ==>> " + SESSION_STATUS.ESTABLISHED);
        setStatusRegister(SESSION_STATUS.ESTABLISHED);
      })
      .on(SESSION_STATUS.REGISTERED, function (session) {
        // console.log("Register ==>> " + SESSION_STATUS.REGISTERED);
        setStatusRegister(SESSION_STATUS.REGISTERED);
      })
      .on(SESSION_STATUS.DISCONNECTED, function () {
        // console.log("Register ==>> " + SESSION_STATUS.DISCONNECTED);
        setStatusRegister(SESSION_STATUS.DISCONNECTED);
      })
      .on(SESSION_STATUS.FAILED, function () {
        // console.log("Register ==>> " + SESSION_STATUS.DISCONNECTED);
        setStatusRegister(SESSION_STATUS.DISCONNECTED);
      });

    // console.log("Phone - connecting");
  };

  // STEP 4
  const call = async ({ session, reqExten }) => {
    // console.log("Phone - call " + reqExten.callto);
    let constraints = {
      audio: true,
      video: false,
    };

    var outCall = session
      .createCall({
        callee: reqExten.callto,
        visibleName: reqExten.exten,
        localVideoDisplay: localVideo.current,
        remoteVideoDisplay: remoteVideo.current,
        constraints: constraints,
      })
      .on(CALL_STATUS.RING, function (call) {
        // console.log("CALL_STATUS ==>> " + CALL_STATUS.RING);
        setStatusCall(CALL_STATUS.RING);
      })
      .on(CALL_STATUS.ESTABLISHED, function (call) {
        // console.log("CALL_STATUS ==>> " + CALL_STATUS.ESTABLISHED);
        setStatusCall(CALL_STATUS.ESTABLISHED);
        setIsEstablished(true);
        handleStart();
      })
      .on(CALL_STATUS.HOLD, function (call) {
        // console.log("CALL_STATUS ==>> " + CALL_STATUS.HOLD);
        setStatusCall(CALL_STATUS.HOLD);
      })
      .on(CALL_STATUS.FINISH, function (call) {
        // console.log("CALL_STATUS ==>> " + CALL_STATUS.FINISH);
        setIsFinish(!isFinish);
        setStatusCall(CALL_STATUS.FINISH);
      })
      .on(CALL_STATUS.FAILED, function (call) {
        // console.log("CALL_STATUS ==>> " + CALL_STATUS.FAILED);
        setStatusCall(CALL_STATUS.FAILED);
      });

    outCall.call();
    // console.log("outCall", outCall);
    currentCall.current = outCall;
  };

  // console.log(isFinish, isEstablished, statusCall);

  const onDialPadPressed = (dtmf) => {
    dtmfSound.play();
    currentCall.current.sendDTMF(dtmf);
  };

  const toggleMute = () => {
    const change = !isMuted;
    if (change) {
      currentCall.current.muteAudio();
    }
    if (!change) {
      currentCall.current.unmuteAudio();
    }
    setIsMuted((prev) => change);
  };

  const handleHangup = () => {
    currentCall.current.hangup();
  };

  const endCall = () => {
    setStatusCall("End Call");
    // handleHangup()
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];
    const isMobile = toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
    if (isMobile) {
      if (env.VITE_APP_HREF_URL) {
        window.location = env.VITE_APP_HREF_URL;
      } else {
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
    setIsFinish(true);
    setIsEstablished(false);
    route.push("end");
  };

  const isCalling = statusCall === CALL_STATUS.ESTABLISHED;
  // console.log(statusCall);

  //Stopwatch
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);

  React.useEffect(() => {
    let interval = null;

    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  if (isFinish && isEstablished && statusCall === "FINISH") {
    endCall();
  } else {
  }

  return (
    <Flex
      // position={`${type === "web" ? "absolute" : ""}`}
      // width={`${type === "web" ? "25%" : "100%"}`}
      // height={`${type === "web" ? "70%" : "100vh"}`}
      // bottom="8rem"
      // right="2rem"
      // display="flex"
      // flexDirection="column"
      // boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
      // backgroundColor="white"
      vertical
    >
      <Flex
        align="center"
        style={{
          padding: "12px 15px",
          backgroundColor: color.secondary,
        }}
        // display="flex"
        // alignItems="center"
      >
        <Flex
          style={{ width: "100%", padding: "12px 0px" }}
          // width="100%"
          // display="flex"
          // flexDirection="row"
          // justifyContent="space-between"
          // alignItems="center"
        >
          <Typography.Text>VoIP ONX</Typography.Text>
        </Flex>
        {/* <Button
        // onClick={() => {
        //   setIsOpen("login");
        //   setOpenFloating(false);
        // }}
        > */}
        {/* <RemoveIcon /> */}
        <MinusOutlined />
        {/* </Button> */}
      </Flex>
      {isKeypad ? (
        <>
          <Keypad
            setIsKeypad={setIsKeypad}
            isCalling={isCalling}
            endCall={endCall}
            onDialPadPressed={onDialPadPressed}
          />
        </>
      ) : (
        <>
          <Flex
            vertical
            // width="100%"
            // height="100vh"
            // bgcolor="#FFF"
            // display="flex"
            // position="relative"
            // flexDirection="column"
          >
            {/* PROFILE AGNET PIC  */}
            <Flex
              align="center"
              justify="center"
              style={{ margin: "20px 0px" }}
              // display="flex"
              // justifyContent="center"
              // alignItems="center"
              // marginY="20px"
            >
              <Flex
                style={{
                  width: "100px",
                  height: "100px",
                }}
                // bgcolor={env.VITE_APP_MAIN_COLOR}
                // display="flex"
                // alignItems="center"
                // justifyContent="center"
                // width="70px"
                // height="70px"
                // borderRadius="100%"
                // padding="15px"
                // border="none"
              >
                <img className="my-3" src={CallerAva} />
              </Flex>
            </Flex>
            {/* <Box textAlign="center"> */}
            <Flex align="center" justify="center" vertical>
              {/* <Typography fontSize="9px" color="#c4c4c4">
              status
            </Typography>
            <Typography sx={{ textTransform: "capitalize" }}>
              {statusCall?.toLowerCase()}
            </Typography> */}
              {/* <Typography sx={{ textTransform: "capitalize" }}>
                Dhimas
              </Typography> */}
              <Typography.Text>
                {statusCall === "waiting"
                  ? "Calling"
                  : statusCall === "RING"
                  ? "Ringing"
                  : statusCall === "ESTABLISHED"
                  ? "Connected"
                  : statusCall === "End Call"
                  ? "End Call"
                  : ""}
              </Typography.Text>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  margin: "10px 0",
                }}
                className="timer"
              >
                <Typography.Text
                  style={{ color: "#3DCB87", fontSize: 18, fontWeight: 600 }}
                  className="digits"
                >
                  {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
                </Typography.Text>
                <Typography.Text
                  style={{ color: "#3DCB87", fontSize: 18, fontWeight: 600 }}
                  className="digits"
                >
                  {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
                </Typography.Text>
                {/* <span className="digits mili-sec">
                  {("0" + ((time / 10) % 100)).slice(-2)}
                </span> */}
              </div>
            </Flex>
            {/* MUTE HANGUP BUTTON  */}
            <Row
              gutter={[8, 8]}
              style={{ margin: "16px 0", padding: "0 24px" }}
            >
              <Col span={12} style={{ padding: 0, textAlign: "center" }}>
                <Button
                  style={{
                    borderRadius: "50px",
                    border: "2px solid #9D9FB1",
                    padding: "28px",
                  }}
                  onClick={() => toggleMute()}
                  // fullWidth
                  // variant={isMuted ? "contained" : "outlined"}
                  // startIcon={isMuted ? MuteOff : MuteOn}
                  // color={isMuted ? "error" : "primary"}
                  disabled={!isCalling}
                  icon={<img src={isMuted ? MuteOn : MuteOff} />}
                ></Button>
                <Typography color="#9D9FB1" fontSize="16px" marginTop="10px">
                  Mute
                </Typography>
              </Col>
              {/* <Grid item xs={6} textAlign="center">/ */}
              {/* <Button
                  sx={{
                    borderRadius: "50px",
                    border: "2px solid #9D9FB1",
                    padding: "15px",
                  }}
                  onClick={() => toggleMute()}
                  fullWidth
                  variant={isMuted ? "contained" : "outlined"}
                  startIcon={isMuted ? <MicOffIcon /> : <MicIcon />}
                  color={isMuted ? "error" : "primary"}
                  disabled={!isCalling}
                >
                  <img src={SpeakerOff} />
                </Button> */}
              {/* <Typography color="#9D9FB1" fontSize="16px" marginTop="10px">
                  Speaker
                </Typography> */}
              {/* <Button
                onClick={() => handleHangup()}
                fullWidth
                color="error"
                variant="outlined"
                startIcon={<PhoneDisabledIcon />}
                disabled={!isCalling}
              >
                Hangup
              </Button> */}
              {/* </Grid> */}
              <Col span={12} style={{ textAlign: "center" }}>
                <Button
                  style={{
                    borderRadius: "50px",
                    border: "2px solid #9D9FB1",
                    padding: "28px",
                  }}
                  onClick={() => setIsKeypad(true)}
                  fullWidth
                  variant={isMuted ? "contained" : "outlined"}
                  // startIcon={isMuted ? <MicOffIcon /> : <MicIcon />}
                  color={isMuted ? "error" : "primary"}
                  // disabled={!isCalling}
                  icon={<img src={KeypadIcon} />}
                ></Button>
                <Typography color="#9D9FB1" fontSize="16px" marginTop="10px">
                  Keypad
                </Typography>
              </Col>
            </Row>

            {/* END CALL BUTTON  */}
            <Flex
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "white",
                position: "absolute",
                bottom: 100,
                textAlign: "center",
                margin: "20px 0px",
              }}
            >
              <Button
                style={{
                  borderRadius: 50,
                  overflow: "hidden",
                  padding: "25px 25px",
                  backgroundColor: "#FF3B30",
                }}
                onClick={() => endCall()}
                icon={<img src={EndCall} />}
              ></Button>
            </Flex>
            {/* <Box>
          <Typography fontSize={9} color="#c4c4c4">
            Statu register: {statusRegiter}
          </Typography>
        </Box> */}
          </Flex>
        </>
      )}
      <Flex style={{ display: "none" }}>
        <div id="remoteVideo" ref={remoteVideo}></div>
        <div id="localVideo" ref={localVideo}></div>
      </Flex>
    </Flex>
  );
}

const color = {
  textTitle: "#fff",
  main: env.VITE_APP_MAIN_COLOR,
  secondary: "#EBE8FF",
};
