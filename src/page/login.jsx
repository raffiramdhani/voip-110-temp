import React, { useState, useEffect } from "react";
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
} from "@mui/material";

import RemoveIcon from "@mui/icons-material/Remove";

import WelcomeIcon from "../assets/welcome-icon.png";

import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import TermsCond from "@/components/Modals/TermsCond";
import StartCall from "@/components/Modals/StartCall";

import FloatingButton from "@/components/FloatingButton";
import Welcome from "@/components/Welcome";
import ReCAPTCHA from "react-google-recaptcha";

import useRouteStore from "@/store/routeStore";
import useProfileStore from "@/store/profileStore";
import { decrypt } from "@/utils/encrypt";
import useAuth from "@/store/openingStore";

import { browserName, osName } from "react-device-detect";

const env = import.meta.env;

export default function login(props) {
  const route = useRouteStore((state) => state);
  const profile = useProfileStore((state) => state);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    nik: "",
  });
  const [openModalAgree, setOpenModalAgree] = useState(false);
  const [openFloating, setOpenFloating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [msgError, setMsgError] = useState(null);
  const [captcha, setCaptcha] = useState(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [NIK, setNIK] = useState("");

  const { isOpen, setIsOpen } = useAuth((state) => state);
  const url_string = window.location.href;
  const url_params = new URL(url_string);
  const type = url_params.searchParams.get("type");
  let captchaRef = React.useRef();
  const regexPhoneNumber = /^08[0-9]{7,12}$/;
  const regexPNIK = /^(\d)(?!\1+$)\d{15}$/;
  const regexNIK2 = /^(?!(\d)\1+$|(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)|9(?=0)){5}\d$|(?:0(?=9)|1(?=0)|2(?=1)|3(?=2)|4(?=3)|5(?=4)|6(?=5)|7(?=6)|8(?=7)|9(?=8)){5}\d$)\d{16}$/
  const regexNIKLengkap = /^(1[1-9]|21|[37][1-6]|5[1-3]|6[1-5]|[89][12])\d{2}\d{2}([04][1-9]|[1256][0-9]|[37][01])(0[1-9]|1[0-2])\d{2}\d{4}$/
  const regexNIKMenengah = /^\\d{6}([04][1-9]|[1256][0-9]|[37][01])(0[1-9]|1[0-2])\d{2}\d{4}$/
  // console.log(regexNIK2.test(NIK), regexNIKLengkap.test(NIK),  regexNIKMenengah.test(NIK));
  // NIK.startsWith(0), 

  const handleInput = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!regexPhoneNumber.test(phoneNumber)) {
      setMsgError(
        "Maaf, format nomor telepon harus diawali dengan 08, minimal 9 digit dan maksimal 13 digit!"
      );
    } else if (!regexNIKLengkap.test(NIK)) {
      setMsgError(
        "Maaf, format NIK tidak boleh diawali dengan angka 0, ada angka sama berulang, angka berurutan dan wajib 16 digit!"
      );
    } else if (NIK.startsWith(0)) {
      setMsgError(
        "Maaf, NIK tidak boleh diawali dengan angka 0!"
      );
    } else {
      if (captcha) {
        setLoading(true);
        const data = await requestExtension();
        if (data) {
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
      } else {
        setMsgError("Please, checklist captcha!");
      }
    }
    setLoading(false);
  };

  const postTransaction = async (value) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `${env.VITE_APP_AUTHORIZATION}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      username: form.name === "" ? "Jane" : form.name,
      email: form.email === "" ? "jane@gmail.com" : form.email,
      phone: form.phone === "" ? "081234567899" : form.phone,
      date_call: new Date(),
      os: osName,
      browser: browserName,
      tenant_id: 0,
      tenant: env.VITE_APP_EXTEN_TENANT,
      extention: parseInt(value.exten),
      call_id: value.callto,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const data = await fetch(
      `https://apidev-voip.onx.co.id/voip/transaction`,
      requestOptions
    )
      .then((res) => console.log(res))
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

  const requestExtension = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `${env.VITE_APP_AUTHORIZATION}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      nik: form.nik,
      username: form.name,
      email: form.email,
      phone: form.phone,
      timestamp: new Date(),
      token: env.VITE_APP_EXTEN_TOKEN,
      type: env.VITE_APP_EXTEN_TYPE,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const data = await fetch(
      `${env.VITE_APP_EXTEN_URL}${env.VITE_APP_EXTEN_TENANT}`,
      requestOptions
    )
      .then((res) => res.text())
      .then((res) => {
        const decryptText = decrypt(res);
        if (decryptText) {
          const decrypted = JSON.parse(decryptText);
          console.log("decrypted>>>", decrypted);

          if (decrypted.status === "failed") {
            setMsgError(`Sorry, ${decrypted.message}`);
            setTimeout(() => {
              setMsgError(null);
            }, 3000);
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
      .catch((err) => console.log("ERROR ==>>", err));

    return data;
  };

  // console.log(regex.test(phoneNumber))

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
            // bottom="8rem"
            // right="2rem"
            display="flex"
            flexDirection="column"
            // boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
            // backgroundColor="white"
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
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap={2}
                >
                  <img src={WelcomeIcon} />
                  <Typography fontWeight={600} color={color.main}>
                    OMNIX VoIP
                  </Typography>
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
              <Typography className="mb-2" fontSize={14}>
                Untuk memulai panggilan, harap isi form terlebih dahulu,
              </Typography>
              <form
                // style={{ height: `80vh` }}
                onSubmit={(e) => handleSubmit(e)}
              >
                <Typography marginTop={2} fontSize={14}>NIK</Typography>
                <TextField
                  value={form.nik}
                  onChange={(e) => {
                    handleInput(e);
                    setNIK(e.target.value)
                  }}
                  // disabled={form.isLoadingSetupWebphone}
                  fullWidth
                  placeholder="NIK"
                  required
                  color="info"
                  id="form-nik"
                  // label="Name"
                  size="small"
                  margin="dense"
                  name="nik"
                  sx={styling.TextField}
                />
                <Typography marginTop={2} fontSize={14}>Nama Lengkap</Typography>
                <TextField
                  value={form.name}
                  onChange={(e) => handleInput(e)}
                  // disabled={form.isLoadingSetupWebphone}
                  fullWidth
                  placeholder="Nama Lengkap"
                  required
                  color="info"
                  id="form-name"
                  // label="Name"
                  size="small"
                  margin="dense"
                  name="name"
                  sx={styling.TextField}
                />
                <Typography marginTop={1} fontSize={14}>Email</Typography>
                <TextField
                  value={form.email}
                  onChange={(e) => handleInput(e)}
                  // disabled={form.isLoadingSetupWebphone}
                  fullWidth
                  placeholder="Email"
                  required
                  color="info"
                  id="form-email"
                  // label="Email"
                  name="email"
                  type="email"
                  size="small"
                  margin="dense"
                  sx={styling.TextField}
                />
                <Typography marginTop={1} fontSize={14}>Nomor Telepon</Typography>
                <TextField
                  value={form.phone}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    handleInput(e);
                  }}
                  fullWidth
                  placeholder="Nomor Telepon"
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
                <Box marginTop={1}>
                  <ReCAPTCHA
                    required
                    ref={captchaRef}
                    sitekey="6LfAbc8jAAAAAFJJXtfVkUgwyF8cPdWhI_YSwcg7"
                    onChange={(e) => setCaptcha(e)}
                  />
                </Box>
                <Box
                  width="100%"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  marginTop={2}
                  bottom={5}
                  paddingY="12px"
                  // backgroundColor="white"
                >
                  {msgError ? (
                    <Alert severity="error">{msgError}</Alert>
                  ) : (
                    <></>
                  )}
                  <Button
                    type="submit"
                    sx={{
                      width: "100%",
                      borderRadius: "10px",
                      backgroundColor: `${color.main}`,
                      marginTop: "10px",
                      color: "white",
                    }}
                    variant="contained"
                    // startIcon={<PhoneInTalkIcon />}
                    disabled={loading}
                  >
                    {loading && (
                      <CircularProgress
                        size={20}
                        color="inherit"
                        sx={{ marginX: "10px" }}
                      />
                    )}
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
      <TermsCond
        open={openModalAgree}
        onClose={() => setOpenModalAgree(false)}
      />
    </Box>
  );
}

const color = {
  textTitle: "#fff",
  main: env.VITE_APP_MAIN_COLOR,
  secondary: "#EBE8FF",
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
