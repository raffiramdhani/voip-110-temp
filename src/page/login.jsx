import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  IconButton,
  Alert,
  Select,
  MenuItem,
} from "@mui/material";

// import WelcomeIcon from "../assets/welcome-icon.png";
import SyncIcon from "@mui/icons-material/Sync";
import RemoveIcon from "@mui/icons-material/Remove";
import LogoBSI from "../assets/logo-bsi.png";
import TermsCond from "@/components/Modals/TermsCond";
import Welcome from "@/components/Welcome";
import useRouteStore from "@/store/routeStore";
import useProfileStore from "@/store/profileStore";
import useAuth from "@/store/openingStore";
import { decrypt } from "@/utils/encrypt";
import { browserName, osName } from "react-device-detect";
import axios from "axios";

const env = import.meta.env;

const MENU = [
  { id: "Umum-Perbankan", label: "Umum Perbankan" },
  // { id: "Umum-Hasanah", label: "Umum Hasanah" },
  // { id: "Prioritas-Perbankan", label: "Prioritas Perbankan" },
  // { id: "Prioritas-Hasanah", label: "Prioritas Hasanah" },
];

const LANG = [
  {
    id: "ID",
    label: "Bahasa Indonesia",
  },
  {
    id: "EN",
    label: "English",
  },
];

const captcha = new Array();

export default function login(props) {
  const route = useRouteStore((state) => state);
  const profile = useProfileStore((state) => state);
  const isMobile = new URLSearchParams(window.location.search).get("app");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    phone: "",
    email: "",
  });
  const [openModalAgree, setOpenModalAgree] = useState(false);
  const [openFloating, setOpenFloating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [msgError, setMsgError] = useState(null);
  const [listingAdditionalField, setListingAdditionalField] = useState(null);
  const [additionalField, setAdditionalField] = useState({
    is_postlogin: 0,
    menu: MENU[0].id,
    bahasa: LANG[0].id,
  });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [errMsg, setErrMsg] = useState(null);

  const { isOpen, setIsOpen } = useAuth((state) => state);
  const url_string = window.location.href;
  const url_params = new URL(url_string);
  const type = url_params.searchParams.get("type");

  // const genID = uuidv4();
  const call_id = `BSI${isMobile ? "A" : "B"}${new Date()
    .getFullYear()
    .toString()
    .slice(2)}${new Date().getTime().toString().slice(-8)}`;

  const handleInput = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdditionalFieldInput = (e) => {
    e.preventDefault();
    setAdditionalField({ ...additionalField, [e.target.name]: e.target.value });
  };

  const getAdditionalField = async () => {
    const config = {
      headers: {
        Authorization: `${env.VITE_APP_AUTHORIZATION}`,
      },
    };
    const res = await axios
      .get(
        `${env.VITE_APP_EXTEN_URL}/additional-field-customer/widget/${env.VITE_APP_EXTEN_TENANT}`,
        config
      )
      .then((res) => setListingAdditionalField(res.data))
      .catch((err) => console.log(err));
    return res;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var recaptcha = document.getElementById("recaptcha").value;
    var validRecaptcha = 0;
    for (var j = 0; j < 4; j++) {
      if (recaptcha.charAt(j) != captcha[j]) {
        validRecaptcha++;
      }
    }
    if (validRecaptcha === 0 && recaptcha.length === 4) {
      setLoading(true);
      const data = await requestExtension();
      if (!data) {
        setMsgError(`Sorry, tenant failed!`);
      } else if (data.failed) {
        setMsgError(`Sorry, ${data.failed}!`);
        setLoading(false);
      } else if (data) {
        postTransaction(data);
        profile.setProfile({ ...form, call_id });
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
      setMsgError("Maaf, Captcha tidak valid.");
    }
    setLoading(false);
  };

  const postTransaction = async (value) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `${env.VITE_APP_AUTHORIZATION}`);
    myHeaders.append("Content-Type", "application/json");

    const firstData = JSON.stringify({
      ...form,
      name: form.username,
      additional_field: additionalField,
      date_call: new Date(),
      os: osName,
      browser: browserName,
      tenant_id: 0,
      tenant: env.VITE_APP_EXTEN_TENANT,
      extention: parseInt(value.exten),
      call_id,
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
      call_id,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: firstData,
      redirect: "follow",
    };

    const data = await fetch(
      `${env.VITE_APP_EXTEN_URL}/voip/transaction`,
      requestOptions
    )
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

  const requestExtension = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `${env.VITE_APP_AUTHORIZATION}`);
    myHeaders.append("Content-Type", "application/json");

    const firstData = JSON.stringify({
      ...form,
      name: form.username,
      additional_field: { ...additionalField, name: form.username },
      timestamp: new Date(),
      token: env.VITE_APP_EXTEN_TOKEN,
      type: env.VITE_APP_EXTEN_TYPE,
      call_id,
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
      body: firstData,
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

  // captcha
  function createCaptcha() {
    document.getElementById("recaptcha").value = "";
    document.getElementById("errCaptcha").innerHTML = "";
    for (var i = 0; i < 4; i++) {
      captcha[i] = String.fromCharCode(Math.floor(Math.random() * 26 + 65));
      /*
      if (i % 2 == 0) {
        captcha[i] = String.fromCharCode(Math.floor(Math.random() * 26 + 65));
      } else {
        captcha[i] = Math.floor(Math.random() * 10 + 0);
      }*/
    }

    var thecaptcha = captcha.join("");
    var canvas = document.getElementById("captcha");

    var ctx = canvas.getContext("2d");
    //ctx.fillStyle = "blue";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "18px Arial";

    //ctx.fillText(thecaptcha, 10, 70);
    ctx.fillText(thecaptcha, 130, 82);
  }

  const regexEmail = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g;
  const testEmail = regexEmail.test(form.email);

  const regexPhoneNumber = /^(?:\+62\d*|0\d*|\+)$/g;
  const testPhoneNumber = regexPhoneNumber.test(form.phone);

  // const regexPhoneNumber =
  // "(()?(+62|62|0)(d{2,3})?)?[ .-]?d{2,4}[ .-]?d{2,4}[ .-]?d{2,4}";
  // "(()?(+62|62|0)(d{2,3})?)?[ .-]?d{2,4}[ .-]?d{2,4}[ .-]?d{2,4}";
  // "(\+62 ((\d{3}([ -]\d{3,})([- ]\d{4,})?)|(\d+)))|(\(\d+\) \d+)|\d{3}( \d+)+|(\d+[ -]\d+)|\d+";

  // const testPhone = phoneNumber.match(regexPhoneNumber)

  // console.log("testphone", testPhone);

  // LISTEN HEIGHT WINDOW
  useEffect(() => {
    getAdditionalField();
  }, []);

  useEffect(() => {
    if (isOpen === "login") {
      createCaptcha();
    }
  }, [isOpen]);

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
                  <img src={LogoBSI} width={200} />
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
              <form
                // style={{ height: `80vh` }}
                onSubmit={(e) => handleSubmit(e)}
              >
                <Typography marginTop={2}>Nama Lengkap</Typography>
                <TextField
                  value={form.name}
                  onChange={(e) => handleInput(e)}
                  // disabled={form.isLoadingSetupWebphone}
                  fullWidth
                  placeholder="Masukkan Nama Lengkap"
                  required
                  color="info"
                  id="form-username"
                  // label="Name"
                  size="small"
                  margin="dense"
                  name="username"
                  sx={styling.TextField}
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .toString()
                      .slice(0, 100)
                      .replace(/[^a-zA-Z\s]/g, "");
                  }}
                />

                <Typography marginTop={1}>Email</Typography>
                <TextField
                  value={form.email}
                  onChange={(e) => handleInput(e)}
                  // disabled={form.isLoadingSetupWebphone}
                  fullWidth
                  placeholder="Masukkan Email"
                  required
                  color="info"
                  id="form-email"
                  // label="Email"
                  name="email"
                  type="email"
                  size="small"
                  margin="dense"
                  sx={styling.TextField}
                  onInput={(e) => {
                    e.target.value = e.target.value.toString().slice(0, 30);
                  }}
                  error={!testEmail && form.email !== ""}
                />
                {!testEmail && form.email !== "" ? (
                  <Typography color="red" fontSize="12px">
                    Email tidak valid.
                  </Typography>
                ) : (
                  <></>
                )}
                <Typography marginTop={1}>Nomor HP</Typography>
                <TextField
                  value={form.phone}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    handleInput(e);
                  }}
                  fullWidth
                  placeholder="Masukkan Phone number"
                  required
                  variant="outlined"
                  color="info"
                  id="form-phone"
                  // label="Phone"
                  name="phone"
                  size="small"
                  margin="dense"
                  sx={styling.TextField}
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .toString()
                      .slice(0, 14)
                      .replace(/[^0-9+]/g, "");
                  }}
                  error={!testPhoneNumber && form.phone !== ""}
                />
                {!testPhoneNumber && form.phone !== "" ? (
                  <Typography color="red" fontSize="12px">
                    Nomor HP tidak valid. harus diawali dengan 0 atau +62
                  </Typography>
                ) : (
                  <></>
                )}

                {listingAdditionalField
                  ? listingAdditionalField &&
                    listingAdditionalField
                      .filter((v) => v.label !== "is_postlogin")
                      .map((e) => ({ ...e, type: "select" }))
                      .map((e) => {
                        return (
                          <>
                            <Typography marginTop={1}>
                              {e.label === "menu"
                                ? "Layanan"
                                : e.label === "bahasa"
                                ? "Bahasa"
                                : ""}
                            </Typography>
                            {e.type === "select" ? (
                              <>
                                <Select
                                  name={e.label}
                                  id={`form-${e.key}`}
                                  placeholder={e.label}
                                  required={e.is_mandatory ? true : false}
                                  size="small"
                                  defaultValue={
                                    e.label === "menu" ? MENU[0].id : LANG[0].id
                                  }
                                  onChange={(event) =>
                                    handleAdditionalFieldInput(event)
                                  }
                                  label={e.label}
                                  sx={{ width: "100%" }}
                                >
                                  {(e?.label === "menu" ? MENU : LANG).map(
                                    (e) => {
                                      return (
                                        <MenuItem value={e.id}>
                                          {e.label}
                                        </MenuItem>
                                      );
                                    }
                                  )}
                                </Select>
                              </>
                            ) : (
                              <TextField
                                // value={form.e.label}
                                onChange={(event) =>
                                  handleAdditionalFieldInput(event)
                                }
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
                        );
                      })
                  : null}

                <Grid
                  container
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "80px",
                    marginTop: "24px",
                  }}
                >
                  <Grid
                    item
                    xs={5}
                    lg={1}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#cdd4e0",
                      justifyContent: "center",
                      height: "80px",
                    }}
                  >
                    <canvas id="captcha"></canvas>
                  </Grid>
                  <Grid
                    item
                    xs={7}
                    lg={2}
                    sx={{
                      pl: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography sx={{ fontSize: "14px" }}>Captcha</Typography>
                      <IconButton onClick={createCaptcha}>
                        <SyncIcon color="primary" />
                      </IconButton>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <TextField
                        id="recaptcha"
                        type="text"
                        placeholder="Masukan Captcha"
                        size="small"
                        variant="standard"
                      />
                      {/* <input
                              id="recaptcha"
                              name="recaptcha"
                              type="text"
                              placeholder="Enter your captcha"
                              autoComplete="off"
                            /> */}

                      <span
                        id="errCaptcha"
                        style={{ color: "red", fontSize: "13px" }}
                      ></span>
                    </Box>
                  </Grid>
                </Grid>
                <Box
                  width="100%"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  marginTop={3}
                  bottom={5}
                  paddingY="12px"
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
                      marginTop: "1em",
                      backgroundColor: `${color.secondary}`,
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
                    Mulai Panggilan
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
  secondary: "#01A39D",
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
