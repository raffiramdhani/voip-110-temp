import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  Avatar,
  Typography,
  TextField,
  Checkbox,
  CircularProgress,
  IconButton,
  Alert,
  Select,
  MenuItem,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { v4 as uuidv4 } from "uuid";

import WelcomeIcon from "../assets/logo-tmi.png";

import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import TermsCond from "@/components/Modals/TermsCond";
import StartCall from "@/components/Modals/StartCall";

import FloatingButton from "@/components/FloatingButton";
import Welcome from "@/components/Welcome";
import ReCAPTCHA from "react-google-recaptcha";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import useRouteStore from "@/store/routeStore";
import useProfileStore from "@/store/profileStore";
import { decrypt } from "@/utils/encrypt";
import useAuth from "@/store/openingStore";

import { browserName, osName } from "react-device-detect";
import axios from "axios";

const env = import.meta.env;

export default function login(props) {
  const route = useRouteStore((state) => state);
  const profile = useProfileStore((state) => state);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    phone: "",
    // email: "",
  });
  const [openModalAgree, setOpenModalAgree] = useState(false);
  const [openFloating, setOpenFloating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [msgError, setMsgError] = useState(null);
  const [captcha, setCaptcha] = useState(null);
  const [listingAdditionalField, setListingAdditionalField] = useState(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errMsg, setErrMsg] = useState(null);

  const { isOpen, setIsOpen } = useAuth((state) => state);
  const url_string = window.location.href;
  const url_params = new URL(url_string);
  const type = url_params.searchParams.get("type");
  let captchaRef = React.useRef();

  const genID = uuidv4();

  const handleInput = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getAdditionalField = async () => {
    const config = {
      headers: {
        Authorization: `${env.VITE_APP_AUTHORIZATION}`,
      },
    };
    const res = await axios
      .get(`${env.VITE_APP_EXTEN_URL}/additional-field-customer/widget/${env.VITE_APP_EXTEN_TENANT}`, config)
      .then((res) => setListingAdditionalField(res.data))
      .catch((err) => console.log(err));
    return res;
  };

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("register");
    setCaptcha(token);
  }, [executeRecaptcha]);

  useEffect(() => {
    handleReCaptchaVerify();
  }, [handleReCaptchaVerify]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (captcha) {
      setLoading(true);
      const data = await requestExtension();
      // console.log("is data", data);
      if (data?.failed) {
        console.log("Call failed ==>", data?.failed);
      }
      if (!data) {
        setMsgError(`Sorry, tenant failed!`);
      } else if (data.failed) {
        setMsgError(`Sorry, ${data.failed}!`);
        setLoading(false);
      } else if (data) {
        postTransaction(data);
        profile.setProfile(form);
        profile.setReqExten(data);
        route.push("call");
      } else {
        setMsgError("Sorry, failed to call try again later!");
        setTimeout(() => {
          setMsgError(null);
        }, 3000);
      }
      // }
    } else {
      handleReCaptchaVerify();
    }
    setLoading(false);
  };

  const postTransaction = async (value) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `${env.VITE_APP_AUTHORIZATION}`);
    myHeaders.append("Content-Type", "application/json");

    const firstData = JSON.stringify({
      ...form,
      date_call: new Date(),
      os: osName,
      browser: browserName,
      tenant_id: 0,
      tenant: env.VITE_APP_EXTEN_TENANT,
      extention: parseInt(value.exten),
      call_id: genID.slice(0, 8),
    });

    var raw = JSON.stringify({
      username: form.name,
      email: form.email,
      phone: form.phone,
      date_call: new Date(),
      os: osName,
      browser: browserName,
      tenant_id: 0,
      tenant: env.VITE_APP_EXTEN_TENANT,
      extention: parseInt(value.exten),
      call_id: genID.slice(0, 8),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: firstData,
      redirect: "follow",
    };

    const data = await fetch(`${env.VITE_APP_EXTEN_URL}/voip/transaction`, requestOptions)
      .then((res) => console.log("Success"))
      .catch((err) => console.log(err));
    return data;
  };

  const handleSubmitMobile = async () => {
    const data = await requestExtension();
    if (data) {
      profile.setProfile(form);
      profile.setReqExten(data);
      route.push("call");
    }
  };

  // console.log(listingAdditionalField);

  const requestExtension = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `${env.VITE_APP_AUTHORIZATION}`);
    myHeaders.append("Content-Type", "application/json");

    const encryptedParams = new URLSearchParams(window.location.search).get("key");

    const params = decrypt(encryptedParams, env.VITE_VOIP_DECODE_IV, env.VITE_VOIP_DECODE_KEY);

    var dataFromUrl = JSON.stringify({
      username: params?.user?.fullname,
      email: params?.user?.email,
      phone: params?.user?.phone,
      token: env.VITE_APP_EXTEN_TOKEN,
      type: env.VITE_APP_EXTEN_TYPE,
      call_id: genID.slice(0, 8),
      vdn: params?.vdn,
      timestamp: new Date(),
      additional_field: listingAdditionalField?.[0],
    });

    const firstData = JSON.stringify({
      ...form,
      timestamp: new Date(),
      token: env.VITE_APP_EXTEN_TOKEN,
      type: env.VITE_APP_EXTEN_TYPE,
      call_id: genID.slice(0, 8),
      additional_field: listingAdditionalField?.[0],
    });

    // var raw = JSON.stringify({
    //   username: form.name,
    //   email: form.email,
    //   phone: form.phone,
    //   timestamp: new Date(),
    //   token: env.VITE_APP_EXTEN_TOKEN,
    //   type: env.VITE_APP_EXTEN_TYPE,
    //   call_id: genID.slice(0, 8),
    // });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: encryptedParams ? dataFromUrl : firstData,
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

          if (decrypted.status === "failed") {
            return {
              failed: decrypted.message,
            };
          } else {
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
        }
      })
      .catch((err) => {
        console.log("ERROR ==>>", err);
        return {
          failed: "failed to call",
        };
      });

    return data;
  };

  // const regexPhoneNumber =
  // "(()?(+62|62|0)(d{2,3})?)?[ .-]?d{2,4}[ .-]?d{2,4}[ .-]?d{2,4}";
  // "(()?(+62|62|0)(d{2,3})?)?[ .-]?d{2,4}[ .-]?d{2,4}[ .-]?d{2,4}";
  // "(\+62 ((\d{3}([ -]\d{3,})([- ]\d{4,})?)|(\d+)))|(\(\d+\) \d+)|\d{3}( \d+)+|(\d+[ -]\d+)|\d+";

  // const testPhone = phoneNumber.match(regexPhoneNumber)

  // console.log("testphone", testPhone);

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
    getAdditionalField();

    return () => {
      // window.removeEventListener("message", (e) => console.log(e));
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box>
      {/* {type === "web" ? ( */}
      <>
        {props.props.showCallPage && isOpen === "login" ? (
          <Box
            // height="400px"
            // position="absolute"
            // width={`${type === "web" ? "25%" : "100%"}`}
            // height={`${type === "web" ? "70%" : "100%"}`}
            bottom="8rem"
            right="2rem"
            display="flex"
            flexDirection="column"
            // boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
          >
            <Box padding="0px 15px" display="flex" alignItems="center" bgcolor={color.main}>
              <Box width="100%" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Box
                  display="flex"
                  flex={1}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
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
                  <img src={WelcomeIcon} style={{ maxWidth: windowWidth <= 425 ? 150 : 200 }} />
                </Box>
                {type === "web" ? (
                  <IconButton
                    onClick={() => {
                      setIsOpen("login");
                      setOpenFloating(false);
                      props.props.setCloseCall();
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                // height: "495px",
                padding: "20px",
                backgroundColor: "white",
              }}
            >
              <Typography className="mb-2">To start a call, please fill the form before</Typography>
              <form
                // style={{ height: `80vh` }}
                onSubmit={(e) => handleSubmit(e)}
              >
                <Typography marginTop={2}>Full Name / Nama Lengkap</Typography>
                <TextField
                  value={form.name}
                  onChange={(e) => handleInput(e)}
                  // disabled={form.isLoadingSetupWebphone}
                  fullWidth
                  placeholder="Enter Full Name / Nama Lengkap"
                  required
                  color="info"
                  id="form-username"
                  // label="Name"
                  size="small"
                  margin="dense"
                  name="username"
                  sx={styling.TextField}
                />

                {/* <Typography marginTop={1}>Email</Typography>
                <TextField
                  value={form.email}
                  onChange={(e) => handleInput(e)}
                  // disabled={form.isLoadingSetupWebphone}
                  fullWidth
                  placeholder="Enter Email"
                  required
                  color="info"
                  id="form-email"
                  // label="Email"
                  name="email"
                  type="email"
                  size="small"
                  margin="dense"
                  sx={styling.TextField}
                /> */}
                <Typography marginTop={1}>Phone Number / Nomor Telepon</Typography>
                <TextField
                  value={form.phone}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    handleInput(e);
                  }}
                  fullWidth
                  placeholder="Enter Phone Number / Nomor Telepon"
                  required
                  variant="outlined"
                  color="info"
                  id="form-phone"
                  // label="Phone"
                  name="phone"
                  size="small"
                  margin="dense"
                  type="number"
                  sx={styling.TextField}
                />

                {listingAdditionalField
                  ? listingAdditionalField &&
                    listingAdditionalField.map((e) => {
                      return (
                        <>
                          {e.display_type === "show" && e.is_mandatory ? (
                            <>
                              <Typography marginTop={1}>{e.label}</Typography>
                              {e.type === "select" ? (
                                <>
                                  <Select
                                    name={e.key}
                                    id={`form-${e.key}`}
                                    placeholder={e.label}
                                    required={e.is_mandatory ? true : false}
                                    size="small"
                                    // value={age}
                                    onChange={(event) => handleInput(event)}
                                    label={e.label}
                                    sx={{ width: "100%" }}
                                  >
                                    {e?.option.map((e) => {
                                      return <MenuItem value={e}>{e}</MenuItem>;
                                    })}
                                  </Select>
                                </>
                              ) : (
                                <TextField
                                  // value={form.e.label}
                                  onChange={(event) => handleInput(event)}
                                  // disabled={form.isLoadingSetupWebphone}
                                  fullWidth
                                  multiline={e.type === "textarea" ? true : false}
                                  rows={e.type === "textarea" ? 3 : 1}
                                  placeholder={e.label}
                                  required={e.is_mandatory ? true : false}
                                  color="info"
                                  id={`form-${e.key}`}
                                  // label="Email"
                                  name={e.key}
                                  type={e.type}
                                  size="small"
                                  margin="dense"
                                  sx={styling.TextField}
                                />
                              )}
                            </>
                          ) : !e.is_mandatory && e.display_type === "show" ? (
                            <>
                              <Typography marginTop={1}>{e.label}</Typography>
                              {e.type === "select" ? (
                                <>
                                  <Select
                                    name={e.key}
                                    id={`form-${e.key}`}
                                    placeholder={e.label}
                                    // required={e.is_mandatory ? true : false}
                                    size="small"
                                    // value={age}
                                    onChange={(event) => handleInput(event)}
                                    label={e.label}
                                    sx={{ width: "100%" }}
                                  >
                                    {e?.option.map((e) => {
                                      return <MenuItem value={e}>{e}</MenuItem>;
                                    })}
                                  </Select>
                                </>
                              ) : (
                                <TextField
                                  // value={form.e.label}
                                  onChange={(event) => handleInput(event)}
                                  // disabled={form.isLoadingSetupWebphone}
                                  fullWidth
                                  multiline={e.type === "textarea" ? true : false}
                                  rows={e.type === "textarea" ? 3 : 1}
                                  placeholder={e.label}
                                  // required={e.is_mandatory ? true : false}
                                  color="info"
                                  id={`form-${e.key}`}
                                  // label="Email"
                                  name={e.key}
                                  type={e.type}
                                  size="small"
                                  margin="dense"
                                  sx={styling.TextField}
                                />
                              )}
                            </>
                          ) : e.display_type === "hidden" ? null : null}
                        </>
                      );
                    })
                  : null}

                {/* <Box marginTop={1}>
                  <ReCAPTCHA
                    required
                    ref={captchaRef}
                    sitekey="6LfAbc8jAAAAAFJJXtfVkUgwyF8cPdWhI_YSwcg7"
                    onChange={(e) => setCaptcha(e)}
                  />
                </Box> */}

                <Box
                  width="100%"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  marginTop={3}
                  bottom={5}
                  paddingY="12px"
                >
                  {msgError ? <Alert severity="error">{msgError}</Alert> : <></>}
                  <Button
                    type="submit"
                    sx={{
                      width: "100%",
                      borderRadius: "10px",
                      marginTop: "1em",
                      backgroundColor: `${color.secondary}`,
                      color: "white",
                    }}
                    variant="contained"
                    // startIcon={<PhoneInTalkIcon />}
                    disabled={loading}
                  >
                    {loading && <CircularProgress size={20} color="inherit" sx={{ marginX: "10px" }} />}
                    Start Call
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        ) : (
          <>
            <Welcome
              setOpenModalAgree={setOpenModalAgree}
              setOpenFloating={setOpenFloating}
              setCloseCall={props.props.setCloseCall}
            />
          </>
        )}
      </>
      {/* ) : (
        <>
          <StartCall handleSubmitMobile={handleSubmitMobile} />
        </>
      )} */}
      <TermsCond open={openModalAgree} onClose={() => setOpenModalAgree(false)} />
    </Box>
  );
}

const color = {
  textTitle: "#fff",
  main: "rgba(2, 43, 57, 0.9)",
  secondary: "#0090A1",
};

const styling = {
  TextField: {
    "& label.Mui-focused": {
      color: color.primary,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: color.primary,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: color.main,
      },
      "&:hover fieldset": {
        borderColor: color.primary,
      },
      "&.Mui-focused fieldset": {
        borderColor: color.primary,
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
