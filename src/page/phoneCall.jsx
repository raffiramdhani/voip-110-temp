import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Button,
  Typography,
  IconButton,
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

const env = import.meta.env;

const genID = uuidv4();

export default function phoneCall() {
  let SESSION_STATUS = Flashphoner.constants.SESSION_STATUS;
  let CALL_STATUS = Flashphoner.constants.CALL_STATUS;
  let Browser = Flashphoner.Browser;

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

    const encryptedParams = new URLSearchParams(window.location.search).get(
      "key"
    );

    const params = JSON.parse(JSON.parse('"' + encryptedParams + '"'));

    console.log("params", encryptedParams, params);
    var raw = JSON.stringify({
      username: params?.user?.fullname,
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
    // const data = profile.reqExten;
    const data = await requestExtension();

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
    <Box
      // position={`${type === "web" ? "absolute" : ""}`}
      // width={`${type === "web" ? "25%" : "100%"}`}
      // height={`${type === "web" ? "70%" : "100vh"}`}
      bottom="8rem"
      right="2rem"
      display="flex"
      flexDirection="column"
      boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
      backgroundColor="white"
    >
      <Box
        padding="12px 15px"
        display="flex"
        alignItems="center"
        bgcolor={color.secondary}
      >
        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>VoIP ONX</Typography>
        </Box>
        <IconButton
        // onClick={() => {
        //   setIsOpen("login");
        //   setOpenFloating(false);
        // }}
        >
          <RemoveIcon />
        </IconButton>
      </Box>
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
          <Box
            width="100%"
            height="100vh"
            bgcolor="#FFF"
            display="flex"
            position="relative"
            flexDirection="column"
          >
            {/* PROFILE AGNET PIC  */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              marginY="20px"
            >
              <Box
                bgcolor={env.VITE_APP_MAIN_COLOR}
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="70px"
                height="70px"
                borderRadius="100%"
                padding="15px"
                border="none"
              >
                <img className="my-3" src={CallerAva} />
              </Box>
            </Box>
            <Box textAlign="center">
              {/* <Typography fontSize="9px" color="#c4c4c4">
              status
            </Typography>
            <Typography sx={{ textTransform: "capitalize" }}>
              {statusCall?.toLowerCase()}
            </Typography> */}
              {/* <Typography sx={{ textTransform: "capitalize" }}>
                Dhimas
              </Typography> */}
              <Typography>
                {statusCall === "waiting"
                  ? "Calling"
                  : statusCall === "RING"
                  ? "Ringing"
                  : statusCall === "ESTABLISHED"
                  ? "Connected"
                  : statusCall === "End Call"
                  ? "End Call"
                  : ""}
              </Typography>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  margin: "10px 0",
                }}
                className="timer"
              >
                <Typography
                  style={{ color: "#3DCB87", fontSize: 18, fontWeight: 600 }}
                  className="digits"
                >
                  {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
                </Typography>
                <Typography
                  style={{ color: "#3DCB87", fontSize: 18, fontWeight: 600 }}
                  className="digits"
                >
                  {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
                </Typography>
                {/* <span className="digits mili-sec">
                  {("0" + ((time / 10) % 100)).slice(-2)}
                </span> */}
              </div>
            </Box>
            {/* MUTE HANGUP BUTTON  */}
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1 }}
              sx={{ my: 2, paddingX: 3 }}
            >
              <Grid item xs={6} padding={0} textAlign="center">
                <IconButton
                  sx={{
                    borderRadius: "50px",
                    border: "2px solid #9D9FB1",
                    padding: "15px",
                  }}
                  onClick={() => toggleMute()}
                  fullWidth
                  // variant={isMuted ? "contained" : "outlined"}
                  // startIcon={isMuted ? MuteOff : MuteOn}
                  // color={isMuted ? "error" : "primary"}
                  disabled={!isCalling}
                >
                  <img src={isMuted ? MuteOn : MuteOff} />
                </IconButton>
                <Typography color="#9D9FB1" fontSize="16px" marginTop="10px">
                  Mute
                </Typography>
              </Grid>
              {/* <Grid item xs={6} textAlign="center">/ */}
              {/* <IconButton
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
                </IconButton> */}
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
              <Grid item xs={6} textAlign="center">
                <IconButton
                  sx={{
                    borderRadius: "50px",
                    border: "2px solid #9D9FB1",
                    padding: "15px",
                  }}
                  onClick={() => setIsKeypad(true)}
                  fullWidth
                  variant={isMuted ? "contained" : "outlined"}
                  // startIcon={isMuted ? <MicOffIcon /> : <MicIcon />}
                  color={isMuted ? "error" : "primary"}
                  // disabled={!isCalling}
                >
                  <img src={KeypadIcon} />
                </IconButton>
                <Typography color="#9D9FB1" fontSize="16px" marginTop="10px">
                  Keypad
                </Typography>
              </Grid>
            </Grid>

            {/* END CALL BUTTON  */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "white",
                position: "absolute",
                bottom: 100,
              }}
              textAlign="center"
              marginY="20px"
            >
              <IconButton
                sx={{
                  borderRadius: 50,
                  overflow: "hidden",
                  padding: "25px 15px",
                  backgroundColor: "#FF3B30",
                }}
                onClick={() => endCall()}
              >
                <img src={EndCall} />
              </IconButton>
            </Box>
            {/* <Box>
          <Typography fontSize={9} color="#c4c4c4">
            Statu register: {statusRegiter}
          </Typography>
        </Box> */}
          </Box>
        </>
      )}
      <Box display="none">
        <div id="remoteVideo" ref={remoteVideo}></div>
        <div id="localVideo" ref={localVideo}></div>
      </Box>
    </Box>
  );
}

const color = {
  textTitle: "#fff",
  main: env.VITE_APP_MAIN_COLOR,
  secondary: "#EBE8FF",
};
