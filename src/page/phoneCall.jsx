import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import { v4 as uuidv4 } from 'uuid';

import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';

import * as Flashphoner from '@flashphoner/websdk';
import DTMFSound from '../assets/dtmf.wav';
import ringingSound from '../assets/phone-ringing.wav';

import { decrypt } from '@/utils/encrypt';
import useProfileStore from '@/store/profileStore';

import NumPad from '@/styles/AlfaNumerik.jsx';
import CallerAva from '../assets/caller-ava.png';

import MuteOff from '../assets/mute-off.png';
import MuteOn from '../assets/mute-on.png';
import SpeakerOn from '../assets/speaker-on.png';
import SpeakerOff from '../assets/speaker-off.png';
import SettingIcon from '../assets/setting.png';
import KeypadIcon from '../assets/keypad.png';
import EndCall from '../assets/end-call.png';

import Keypad from '../components/Keypad';
import useRouteStore from '@/store/routeStore';
import { browserName, osName } from 'react-device-detect';
import { MEDIA_DEVICE_KIND } from '@flashphoner/websdk/src/constants';
import { formatPhoneNumber, getLocationDetail } from '../utils/utilitys';
import Setting from '@/components/Modals/Setting';

const env = import.meta.env;

const genID = uuidv4();

export default function phoneCall() {
  let SESSION_STATUS = Flashphoner.constants.SESSION_STATUS;
  let CALL_STATUS = Flashphoner.constants.CALL_STATUS;
  let Browser = Flashphoner.Browser;

  const [kabupaten, setKabupaten] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
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
  const [statusCall, setStatusCall] = useState('waiting');
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const [isFinish, setIsFinish] = useState(true);
  const [isEstablished, setIsEstablished] = useState(true);
  const [profiles, setProfiles] = useState(false);
  const [reqExtend, setReqExtend] = useState(false);

  const [isKeypad, setIsKeypad] = useState(false);

  const [mics, setMics] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [openSetting, setOpenSetting] = useState(false);
  const [mic, setMic] = useState(null);
  const [speaker, setSpeaker] = useState(null);

  if (statusCall === 'RING') {
    ringingSounds.play();
  } else {
    ringingSounds.pause();
  }

  const getDevice = () => {
    Flashphoner.getMediaDevices(null, true, MEDIA_DEVICE_KIND.ALL).then(
      (list) => {
        for (var type in list) {
          if (list.hasOwnProperty(type)) {
            if (type === 'audio') {
              setMics(list.audio.filter((v) => v.type === 'mic'));
              setSpeakers(list.audio.filter((v) => v.type === 'speaker'));
              const filterMic = list.audio.filter((v) => v.type === 'mic');
              if (filterMic?.length > 0) {
                filterMic.forEach((filter) => {
                  if (filter.label?.toLowerCase()?.indexOf('default') > -1) {
                    setMic(filter.id);
                  }
                });
              }

              const filterSpeaker = list.audio.filter((v) => v.type === 'mic');
              if (filterSpeaker?.length > 0) {
                filterSpeaker.forEach((filter) => {
                  if (filter.label?.toLowerCase()?.indexOf('default') > -1) {
                    setSpeaker(filter.id);
                  }
                });
              }
            }
          }
        }
      }
    );
  };

  useEffect(() => {
    if (reqExtend) {
      initFlashphoner();
    }
    if (profile.reqExten) {
      initFlashphoner();
    }
    // console.log("1.0.0");
  }, [reqExtend, isFinish]);

  // STEP 1
  const initFlashphoner = () => {
    try {
      Flashphoner.init();
      getDevice();
      connect();
      setIsLoading(false);
    } catch (error) {
      console.log('ERROR ==>>', error);
    }
  };

  // STEP 2

  const handleSubmit = async (lat, long) => {
    const data = await requestExtension(lat, long);
    const encryptedParams = new URLSearchParams(window.location.search)
      ?.get('key')
      ?.split(' ')
      ?.join('+')
      ?.replace(/\\/g, '');

    const params = JSON.parse(decrypt(encryptedParams));
    // console.log("is data", data);
    if (data?.failed) {
      console.log('Call failed ==>', data?.failed);
    }
    if (!data) {
    } else if (data.failed) {
      setLoading(false);
    } else if (data) {
      postTransaction(data);
      setProfiles(params);
      setReqExtend(data);
      route.push('call');
    } else {
      setTimeout(() => {
        setMsgError(null);
      }, 3000);
    }
  };

  const requestExtension = async (lat, long) => {
    let myHeaders = new Headers();
    myHeaders.append('Authorization', env.VITE_APP_AUTHORIZATION);
    myHeaders.append('Content-Type', 'application/json');

    const encryptedParams = new URLSearchParams(window.location.search)
      ?.get('key')
      ?.split(' ')
      ?.join('+')
      ?.replace(/\\/g, '');

    const params = JSON.parse(decrypt(encryptedParams));

    const locationData = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json&accept-language=id`,
      requestOptions
    )
      .then((res) => res.text())
      .then((res) => JSON.parse(res));

    var dataFromUrl = JSON.stringify({
      username: params?.fullname,
      email: params?.email,
      // phone: params?.phone,
      phone: formatPhoneNumber(params.phone),
      token: env.VITE_APP_EXTEN_TOKEN,
      type: env.VITE_APP_EXTEN_TYPE,
      call_id: genID.slice(0, 8),
      vdn: params?.vdn,
      timestamp: new Date(),
      location: {
        latitude: lat,
        longitude: long,
      },
      kabupaten: getLocationDetail(locationData?.address),
      // additional_field: listingAdditionalField[0],
    });

    setKabupaten(getLocationDetail(locationData?.address));

    var raw = JSON.stringify({
      menu: params?.menu_id,
      is_postlogin: params?.user?.email ? 1 : 0,
      name: params?.user?.fullname,
      username: 'bsi',
      email: params?.user?.email,
      // phone: params?.user?.phone,
      phone: formatPhoneNumber(params?.user?.phone),
      token: env.VITE_APP_EXTEN_TOKEN,
      type: env.VITE_APP_EXTEN_TYPE,
      call_id: genID.slice(0, 8),
      vdn: params?.vdn,
      timestamp: new Date(),
      location: {
        latitude: lat,
        longitude: long,
      },
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: dataFromUrl,
      redirect: 'follow',
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
            callto: params?.vdn
              ? decrypted.callto + params?.vdn
              : decrypted.callto,
            sip: decrypted.sip,
            rtc: decrypted.rtc,
            api: decrypted.api,
          };
        }
      })
      .catch((err) => console.log('ERROR ==>>', err));

    return data;
  };

  const postTransaction = async (value) => {
    let myHeaders = new Headers();
    myHeaders.append('Authorization', `${env.VITE_APP_AUTHORIZATION}`);
    myHeaders.append('Content-Type', 'application/json');

    const encryptedParams = new URLSearchParams(window.location.search)
      ?.get('key')
      ?.split(' ')
      ?.join('+')
      ?.replace(/\\/g, '');
    const params = JSON.parse(decrypt(encryptedParams));

    const firstData = JSON.stringify({
      username: params.fullname,
      email: params.email,
      phone: formatPhoneNumber(params.phone),
      date_call: new Date(),
      os: osName,
      browser: browserName,
      tenant_id: 0,
      tenant: env.VITE_APP_EXTEN_TENANT,
      extention: parseInt(value.exten),
      call_id: genID.slice(0, 8),
    });

    var raw = JSON.stringify({
      username: params.name,
      email: params.email,
      phone: formatPhoneNumber(params.phone),
      date_call: new Date(),
      os: osName,
      browser: browserName,
      tenant_id: 0,
      tenant: env.VITE_APP_EXTEN_TENANT,
      extention: parseInt(value.exten),
      call_id: genID.slice(0, 8),
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: firstData,
      redirect: 'follow',
    };

    const data = await fetch(
      `${env.VITE_APP_EXTEN_URL}/voip/transaction`,
      requestOptions
    )
      .then((res) => console.log('Success'))
      .catch((err) => console.log(err));
    return data;
  };

  useEffect(() => {
    const encryptedParams = new URLSearchParams(window.location.search).get(
      'key'
    );

    if (encryptedParams) {
      const geolocationAPI = navigator.geolocation;
      if (!geolocationAPI) {
        notification.error({
          message: 'Geolocation API is not available in your browser.',
          placement: 'bottomRight',
          duration: 5,
        });
      } else {
        geolocationAPI.getCurrentPosition(
          (position) => {
            const { coords } = position;
            setLat(coords.latitude);
            setLong(coords.longitude);
            handleSubmit(coords.latitude, coords.longitude);
          },
          (error) => {
            notification.error({
              message: 'Something went wrong getting your position.',
              placement: 'bottomRight',
              duration: 5,
            });
          }
        );
      }
    }
    //  else {

    // }
  }, []);

  // STEP 3
  const connect = async () => {
    const data = reqExtend ? reqExtend : profile.reqExten;
    // const data = await requestExtension();
    console.log('ini data', data);
    if (
      Browser.isSafariWebRTC() &&
      Flashphoner.getMediaProviders()[0] === 'WebRTC'
    ) {
      Flashphoner.playFirstVideo(localVideo.current, true);
      Flashphoner.playFirstVideo(remoteVideo.current, false);
    }

    const sipOptions = {
      login: data.exten,
      password: data.secret,
      authenticationName: data.exten,
      domain: data.sip.split(':')[0],
      outboundProxy: data.sip.split(':')[0],
      port: data.sip.split(':')[1],
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
    setStatusCall('End Call');
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

    window.parent.postMessage('hangup', '*');
    if (isMobile) {
      if (env.VITE_APP_HREF_URL) {
        window.location.reload();
        // route.push('onboard');
        // window.location = env.VITE_APP_HREF_URL;
      } else {
        if (reqExtend) {
          // window.close();
          // route.push("close");
          // setIsFinish(true);
          // setIsEstablished(false);
          // window.location = env.VITE_APP_HREF_URL;
          window.location.reload();
          // route.push('onboard');
        } else {
          window.location.reload();
          route.push('end');
          setIsFinish(true);
          setIsEstablished(false);
        }
      }
    } else {
      if (reqExtend) {
        // window.close();
        // route.push("close");
        // setIsFinish(true);
        // setIsEstablished(false);
        // window.location = env.VITE_APP_HREF_URL;
        window.location.reload();
        // route.push('onboard');
      } else {
        window.location.reload();
        route.push('end');
        setIsFinish(true);
        setIsEstablished(false);
      }
    }
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

  if (isFinish && isEstablished && statusCall === 'FINISH') {
    endCall();
  } else {
  }

  const color = {
    textTitle: '#fff',
    main: env.VITE_APP_MAIN_COLOR,
    secondary: env.VITE_APP_SECONDARY_COLOR,
  };

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
          <Typography fontWeight={600} color={color.main}>
            VoIP 110
          </Typography>
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
                {statusCall === 'waiting'
                  ? 'Calling'
                  : statusCall === 'RING'
                  ? 'Ringing'
                  : statusCall === 'ESTABLISHED'
                  ? 'Connected'
                  : statusCall === 'End Call'
                  ? 'End Call'
                  : ''}
              </Typography>
              {kabupaten ?? ''}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  margin: '10px 0',
                }}
                className="timer"
              >
                {!isLoading && (
                  <>
                    <Typography
                      style={{
                        color: '#3DCB87',
                        fontSize: 18,
                        fontWeight: 600,
                      }}
                      className="digits"
                    >
                      {('0' + Math.floor((time / 60000) % 60)).slice(-2)}:
                    </Typography>
                    <Typography
                      style={{
                        color: '#3DCB87',
                        fontSize: 18,
                        fontWeight: 600,
                      }}
                      className="digits"
                    >
                      {('0' + Math.floor((time / 1000) % 60)).slice(-2)}
                    </Typography>
                  </>
                )}
                {isLoading && (
                  <div>
                    <CircularProgress size={16} />
                    <Typography
                      style={{
                        color: '#3DCB87',
                        fontSize: 18,
                        fontWeight: 600,
                      }}
                      className="digits"
                    >
                      Initialize Call
                    </Typography>
                  </div>
                )}

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
              <Grid item xs={4} padding={0} textAlign="center">
                <IconButton
                  sx={{
                    borderRadius: '50px',
                    border: '2px solid #9D9FB1',
                    padding: '15px',
                  }}
                  onClick={() => setOpenSetting(true)}
                  fullWidth
                  disabled={!isCalling}
                  // variant={isMuted ? "contained" : "outlined"}
                  // startIcon={isMuted ? MuteOff : MuteOn}
                  // color={isMuted ? "error" : "primary"}
                >
                  <img src={SettingIcon} />
                </IconButton>
                <Typography color="#9D9FB1" fontSize="16px" marginTop="10px">
                  Settings
                </Typography>
              </Grid>
              <Grid item xs={4} padding={0} textAlign="center">
                <IconButton
                  sx={{
                    borderRadius: '50px',
                    border: '2px solid #9D9FB1',
                    padding: '15px',
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
              <Grid item xs={4} textAlign="center">
                <IconButton
                  sx={{
                    borderRadius: '50px',
                    border: '2px solid #9D9FB1',
                    padding: '15px',
                  }}
                  onClick={() => setIsKeypad(true)}
                  fullWidth
                  variant={isMuted ? 'contained' : 'outlined'}
                  // startIcon={isMuted ? <MicOffIcon /> : <MicIcon />}
                  color={isMuted ? 'error' : 'primary'}
                  disabled={!isCalling}
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
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: 'white',
                position: 'absolute',
                bottom: 100,
              }}
              textAlign="center"
              marginY="20px"
            >
              <IconButton
                sx={{
                  borderRadius: 50,
                  overflow: 'hidden',
                  padding: '25px 15px',
                  backgroundColor: '#FF3B30',
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
      <Setting
        open={openSetting}
        onClose={() => setOpenSetting(false)}
        mics={mics}
        speakers={speakers}
        setMic={(e) => {
          setMic(e.target.value);
        }}
        setSpeaker={(e) => {
          setSpeaker(e.target.value);
        }}
        onSubmit={() => {
          if (currentCall?.current) {
            currentCall.current.setAudioOutputId(speaker);
            //currentCall.current.switchMic(mic);
          }
        }}
        mic={mic}
        speaker={speaker}
      />
      <Box display="none">
        <div id="remoteVideo" ref={remoteVideo}></div>
        <div id="localVideo" ref={localVideo}></div>
      </Box>
    </Box>
  );
}

const color = {
  textTitle: '#fff',
  main: env.VITE_APP_MAIN_COLOR,
  secondary: '#EBE8FF',
};
