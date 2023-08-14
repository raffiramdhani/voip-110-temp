import React, { useState, useEffect, useRef, useMemo } from "react";
import { Box, Grid, Typography, IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import * as Flashphoner from "@flashphoner/websdk";
import DTMFSound from "../assets/dtmf.wav";
import ringingSound from "../assets/phone-ringing.wav";
import { decrypt } from "@/utils/encrypt";
import useProfileStore from "@/store/profileStore";
import CallerAva from "../assets/caller-ava.png";
import MuteOff from "../assets/mute-off.png";
import MuteOn from "../assets/mute-on.png";
import KeypadIcon from "../assets/keypad.png";
import EndCall from "../assets/end-call.png";
import Keypad from "../components/Keypad";
import useRouteStore from "@/store/routeStore";
import SpeakerIcon from "@mui/icons-material/VolumeUp";

const env = import.meta.env;
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

export default function phoneCall() {
  let SESSION_STATUS = Flashphoner.constants.SESSION_STATUS;
  let CALL_STATUS = Flashphoner.constants.CALL_STATUS;
  let Browser = Flashphoner.Browser;

  const encryptedParams = new URLSearchParams(window.location.search)
    ?.get("key")
    ?.split(" ")
    ?.join("+")
    ?.replace(/\\/g, "");

  const params = JSON.parse(decrypt(encryptedParams));
  console.log("params>>>", params);

  const route = useRouteStore((state) => state);
  const profile = useProfileStore((state) => state);
  const me = useRef();
  const currentCall = useRef();
  const localVideo = useRef();
  const remoteVideo = useRef();
  const dtmfSound = useMemo(() => new Audio(DTMFSound), []);
  const ringingSounds = useMemo(() => new Audio(ringingSound), []);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoudSpeaker, setIsLoudSpeaker] = useState(false);
  const [reqExten, setReqExten] = useState(null);
  const [statusRegiter, setStatusRegister] = useState(null);
  const [statusCall, setStatusCall] = useState("waiting");

  const [isFinish, setIsFinish] = useState(true);
  const [isEstablished, setIsEstablished] = useState(false);
  const [isParamError, setIsParamError] = useState(false);

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
    myHeaders.append(
      "Authorization",
      env.VITE_APP_AUTHORIZATION
      /*"Basic " + window.btoa("api:api123")*/
    );
    myHeaders.append("Content-Type", "application/json");

    if (!params?.menu || !params?.is_postlogin || !params?.bahasa) {
      setIsParamError(true);
      return;
    }

    const is_postlogin = params?.is_postlogin;
    var raw = JSON.stringify({
      menu: params?.menu,
      is_postlogin,
      name: is_postlogin ? params?.user?.fullname : "BSICustomer",
      username: "bsi",
      email: is_postlogin ? params?.user?.email : "ctest@mail.com",
      phone: is_postlogin ? params?.user?.phone : "080000000000",
      token: env.VITE_APP_EXTEN_TOKEN,
      type: env.VITE_APP_EXTEN_TYPE,
      call_id: `BSI${isMobile ? "A" : "B"}${new Date()
        .getFullYear()
        .toString()
        .slice(2)}${new Date().getTime().toString().slice(-8)}`,
      vdn: params?.vdn,
      timestamp: new Date(),
      bahasa: params?.bahasa,
    });

    profile.setProfile({
      username: params?.user?.fullname || "BSICustomer",
      phone: params?.user?.phone || "080000000000",
      email: params?.user?.email || "ctest@mail.com",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const data = await fetch(
      `${env.VITE_APP_EXTEN_URL}/voip/req_extention/${env.VITE_APP_EXTEN_TENANT}`,
      // "https://apidev-voip.onx.co.id/voip/req_extention/bankbali",
      requestOptions
    )
      .then((res) => res.text())
      .then((res) => {
        const decryptText = decrypt(res);

        if (decryptText) {
          const decrypted = JSON.parse(decryptText);
          console.log("decrypted>>>", decrypted);
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
    const data = isMobile ? await requestExtension() : profile.reqExten;
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
    currentCall.current.setVolume(isMobile ? 25 : 100);
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

  const toggleLoudSpeaker = () => {
    const change = !isLoudSpeaker;
    if (change) {
      currentCall.current.setVolume(100);
    }
    if (!change) {
      currentCall.current.setVolume(25);
    }
    setIsLoudSpeaker((_) => change);
  };

  const handleHangup = () => {
    currentCall.current.hangup();
  };

  const endCall = () => {
    setStatusCall("End Call");
    // const toMatch = [
    //   /Android/i,
    //   /webOS/i,
    //   /iPhone/i,
    //   /iPad/i,
    //   /iPod/i,
    //   /BlackBerry/i,
    //   /Windows Phone/i,
    // ];
    // const isMobile = toMatch.some((toMatchItem) => {
    //   return navigator.userAgent.match(toMatchItem);
    // });
    // if (isMobile) {
    //   if (env.VITE_APP_HREF_URL) {
    //     window.location = env.VITE_APP_HREF_URL;
    //   } else {
    //     window.location.reload();
    //   }
    // } else {
    //   window.location.reload();
    // }
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

  if (isParamError) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh" }}
      >
        <Typography>Data tidak dikirim dari SuperApp.</Typography>
      </Box>
    );
  } else {
    if (isMobile) {
      return (
        <Box
          bottom="8rem"
          right="2rem"
          display="flex"
          flexDirection="column"
          boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
          backgroundColor="#b3b3b3"
          height="100vh"
        >
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
            <Box
              width="100%"
              height="100%"
              bgcolor="#b3b3b3"
              display="flex"
              position="relative"
              flexDirection="column"
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  textAlign: "center",
                  marginTop: "64px",
                  marginBottom: "20px",
                }}
              >
                {params?.menu?.replaceAll("-", " ")}
              </Typography>
              <Box
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  marginBottom: "40px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: 150,
                    height: 80,
                    bgcolor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography>LOGO</Typography>
                </Box>
              </Box>
              <Box textAlign="center">
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "white",
                    marginBottom: "20px",
                  }}
                >
                  {statusCall === "waiting" ? (
                    "Calling..."
                  ) : statusCall === "RING" ? (
                    "Ringing"
                  ) : statusCall === "ESTABLISHED" ? (
                    <Typography
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        margin: "10px 0",
                        color: "white",
                        fontSize: 18,
                        fontWeight: 500,
                      }}
                      color="white"
                      className="timer"
                    >
                      <Typography className="digits" variant="inherit">
                        {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
                      </Typography>
                      <Typography className="digits" variant="inherit">
                        {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
                      </Typography>
                      {/* <span className="digits mili-sec">
                        {("0" + ((time / 10) % 100)).slice(-2)}
                      </span> */}
                    </Typography>
                  ) : statusCall === "End Call" ? (
                    "End Call"
                  ) : (
                    ""
                  )}
                </Typography>
                <Typography
                  sx={{
                    color: "white",
                    fontSize: 14,
                    marginX: "24px",
                  }}
                >
                  {statusCall.match(/waiting|RING/)
                    ? "Mohon tunggu ya kami sedang berusaha menghubungkan dengan Agent kami"
                    : statusCall === "ESTABLISHED"
                    ? "Kamu telah terhubung dengan Agent kami"
                    : ""}
                </Typography>
              </Box>

              <Grid
                container
                sx={{
                  position: "absolute",
                  bottom: 64,
                  alignSelf: "center",
                  width: "90%",
                }}
              >
                <Grid item xs={5} textAlign="center" />
                <Grid item xs={2} textAlign="center">
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      sx={{
                        borderRadius: "12px !important",
                        overflow: "hidden",
                        backgroundColor: "#FF3B30",
                        width: 64,
                        height: 64,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => endCall()}
                    >
                      <img src={EndCall} />
                    </IconButton>
                  </Box>
                </Grid>

                <Grid item xs={5}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      sx={{
                        borderRadius: "12px !important",
                        overflow: "hidden",
                        bgcolor: !isLoudSpeaker
                          ? "#b3b3b3 !important"
                          : "white !important",
                        border: "2px solid #fff",
                        width: 64,
                        height: 64,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => toggleLoudSpeaker()}
                    >
                      <SpeakerIcon
                        sx={{
                          color: !isLoudSpeaker ? "white" : "black",
                          width: 39,
                          height: 39,
                        }}
                      />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
          <Box display="none">
            <div id="remoteVideo" ref={remoteVideo}></div>
            <div id="localVideo" ref={localVideo}></div>
          </Box>
        </Box>
      );
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
}

const color = {
  textTitle: "#fff",
  main: env.VITE_APP_MAIN_COLOR,
  secondary: "#EBE8FF",
};
