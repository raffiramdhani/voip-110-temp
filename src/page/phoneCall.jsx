import React, { useState, useEffect, useRef, useMemo } from "react";
import { Box, Grid, Paper, Button, Typography } from "@mui/material";

import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";

import * as Flashphoner from "@flashphoner/websdk";
import DTMFSound from "../assets/dtmf.wav";

import { decrypt } from "@/utils/encrypt";
import useProfileStore from "@/store/profileStore";

const env = import.meta.env;

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
  const [isMuted, setIsMuted] = useState(false);
  const [reqExten, setReqExten] = useState(null);
  const [statusRegiter, setStatusRegister] = useState(null);
  const [statusCall, setStatusCall] = useState("waiting");

  useEffect(() => {
    initFlashphoner();
  }, []);

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

    var raw = JSON.stringify({
      username: "Dummy",
      email: "dummy@gmail.com",
      phone: "08581154888",
      token: env.VITE_APP_EXTEN_TOKEN,
      type: env.VITE_APP_EXTEN_TYPE,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const data = await fetch(env.VITE_APP_EXTEN_URL, requestOptions)
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
            callto: decrypted.callto,
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
    await setReqExten(data);

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
    console.log("connectionOption >>", sipOptions);

    Flashphoner.createSession(connectionOptions)
      .on(SESSION_STATUS.ESTABLISHED, function (session) {
        call({ session, reqExten: data });
        console.log("Register ==>> " + SESSION_STATUS.ESTABLISHED);
        setStatusRegister(SESSION_STATUS.ESTABLISHED);
      })
      .on(SESSION_STATUS.REGISTERED, function (session) {
        console.log("Register ==>> " + SESSION_STATUS.REGISTERED);
        setStatusRegister(SESSION_STATUS.REGISTERED);
      })
      .on(SESSION_STATUS.DISCONNECTED, function () {
        console.log("Register ==>> " + SESSION_STATUS.DISCONNECTED);
        setStatusRegister(SESSION_STATUS.DISCONNECTED);
      })
      .on(SESSION_STATUS.FAILED, function () {
        console.log("Register ==>> " + SESSION_STATUS.DISCONNECTED);
        setStatusRegister(SESSION_STATUS.DISCONNECTED);
      });

    console.log("Phone - connecting");
  };

  // STEP 4
  const call = async ({ session, reqExten }) => {
    console.log("Phone - call " + reqExten.callto);
    let constraints = {
      audio: true,
      video: false,
    };

    var outCall = session
      .createCall({
        callee: "605" + reqExten.callto,
        visibleName: reqExten.exten,
        localVideoDisplay: localVideo.current,
        remoteVideoDisplay: remoteVideo.current,
        constraints: constraints,
      })
      .on(CALL_STATUS.RING, function (call) {
        console.log("CALL_STATUS ==>> " + CALL_STATUS.RING);
        setStatusCall(CALL_STATUS.RING);
      })
      .on(CALL_STATUS.ESTABLISHED, function (call) {
        console.log("CALL_STATUS ==>> " + CALL_STATUS.ESTABLISHED);
        setStatusCall(CALL_STATUS.ESTABLISHED);
      })
      .on(CALL_STATUS.HOLD, function (call) {
        console.log("CALL_STATUS ==>> " + CALL_STATUS.HOLD);
        setStatusCall(CALL_STATUS.HOLD);
      })
      .on(CALL_STATUS.FINISH, function (call) {
        console.log("CALL_STATUS ==>> " + CALL_STATUS.FINISH);
        setStatusCall(CALL_STATUS.FINISH);
      })
      .on(CALL_STATUS.FAILED, function (call) {
        console.log("CALL_STATUS ==>> " + CALL_STATUS.FAILED);
        setStatusCall(CALL_STATUS.FAILED);
      });

    outCall.call();
    console.log(outCall);
    currentCall.current = outCall;
  };

  const onDialPadPressed = (dtmf) => {
    dtmfSound.play();
    currentCall.current.sendDTMF(dtmf);
  };

  const toggleMute = () => {
    const change = !isMuted
    if (change) {
      currentCall.current.muteAudio();
    }
    if (!change) {
      currentCall.current.unmuteAudio();
    }
    setIsMuted(!change);

  };

  const handleHangup = () => {
    currentCall.current.hangup();
  };

  const endCall = () => {
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
      window.location = "sapaPegadaian://rating?type=Call";
    } else {
      window.location.reload();
    }
  };

  const isCalling = statusCall === CALL_STATUS.ESTABLISHED;
  return (
    <Box maxWidth="350px">
      {/* PROFILE AGNET PIC  */}
      <Box display="flex" justifyContent="center" alignItems="center" mb="20px">
        <Box
          bgcolor={env.VITE_APP_MAIN_COLOR}
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="70px"
          height="70px"
          borderRadius="100%"
        >
          <SupportAgentIcon sx={{ fontSize: "50px", color: "#fff" }} />
        </Box>
      </Box>
      <Box textAlign="center">
        <Typography fontSize="9px" color="#c4c4c4">
          status
        </Typography>
        <Typography sx={{ textTransform: "capitalize" }}>
          {statusCall?.toLowerCase()}
        </Typography>
      </Box>
      {/* MUTE HANGUP BUTTON  */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }} sx={{ my: 2 }}>
        <Grid item xs={6}>
          <Button
            onClick={() => toggleMute()}
            fullWidth
            variant={isMuted ? "contained" : "outlined"}
            startIcon={isMuted ? <MicOffIcon /> : <MicIcon />}
            color={isMuted ? "error" : "primary"}
            disabled={!isCalling}
          >
            {isMuted ? "Unmute" : "Mute"}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            onClick={() => handleHangup()}
            fullWidth
            color="error"
            variant="outlined"
            startIcon={<PhoneDisabledIcon />}
            disabled={!isCalling}
          >
            Hangup
          </Button>
        </Grid>
      </Grid>
      {/* DIAL PAD  */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((d, i) => (
          <Grid
            onClick={() => {
              if (isCalling) {
                onDialPadPressed(d);
              }
            }}
            key={i}
            item
            xs={4}
          >
            <Paper
              sx={{
                "&:hover": { bgcolor: "#f4f4f4" },
                "&:focus": { bgcolor: "#f4f4f4" },
                padding: "10px",
                bgcolor: isCalling ? "#fff" : "#f4f4f4",
                cursor: isCalling ? "pointer" : "not-allowed",
              }}
            >
              {d}
            </Paper>
          </Grid>
        ))}
      </Grid>
      {/* END CALL BUTTON  */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }} sx={{ my: 2 }}>
        <Grid item xs={12}>
          <Button onClick={() => endCall()} fullWidth variant="outlined">
            End Call
          </Button>
        </Grid>
      </Grid>
      <Box>
        <Typography fontSize={9} color="#c4c4c4">
          Statu register: {statusRegiter}
        </Typography>
      </Box>
      <Box display="none">
        <div id="remoteVideo" ref={remoteVideo}></div>
        <div id="localVideo" ref={localVideo}></div>
      </Box>
    </Box>
  );
}
