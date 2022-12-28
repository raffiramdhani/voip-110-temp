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
} from "@mui/material";

import RemoveIcon from "@mui/icons-material/Remove";

import WelcomeIcon from "../assets/welcome-icon.png";

import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import TermsCond from "@/components/Modals/TermsCond";
import StartCall from "@/components/Modals/StartCall";

import FloatingButton from "@/components/FloatingButton";
import Welcome from "@/components/Welcome";

import useRouteStore from "@/store/routeStore";
import useProfileStore from "@/store/profileStore";
import { decrypt } from "@/utils/encrypt";
import useAuth from "@/store/openingStore";

const env = import.meta.env;

export default function login() {
  const route = useRouteStore((state) => state);
  const profile = useProfileStore((state) => state);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [openModalAgree, setOpenModalAgree] = useState(false);
  const [openFloating, setOpenFloating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [type, setType] = useState("");

  const { isOpen, setIsOpen } = useAuth((state) => state);

  const handleInput = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await requestExtension();
    if (data) {
      profile.setProfile(form);
      profile.setReqExten(data);
      route.push("call");
    }
  };

  const handleSubmitMobile = async () => {
    const data = await requestExtension();
    console.log(data);
    if (data) {
      profile.setProfile(form);
      profile.setReqExten(data);
      route.push("call");
    }
  };

  const requestExtension = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", env.VITE_APP_AUTHORIZATION);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      username: form.name === "" ? "Jane" : form.name,
      email: form.email === "" ? "jane@gmail.com" : form.email,
      phone: form.phone === "" ? "081234567899" : form.phone,
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

  // LISTEN HEIGHT WINDOW
  useEffect(() => {
    // window.addEventListener("message", (e) => console.log(e));
    function handleResize() {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setType("mobile");
      }
      if (window.innerWidth >= 768) {
        setType("web");
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
      {type === "web" ? (
        <>
          {openFloating && isOpen === "login" ? (
            <Box
              position={`${type === "web" ? "absolute" : ""}`}
              width={`${type === "web" ? "25%" : "100%"}`}
              height={`${type === "web" ? "70%" : "100%"}`}
              bottom="8rem"
              right="2rem"
              display="flex"
              flexDirection="column"
              boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
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
                    <Typography color={color.main}>OMNIX VoIP</Typography>
                  </Box>
                  <IconButton
                    onClick={() => {
                      setIsOpen("login");
                      setOpenFloating(false);
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ padding: "20px" }}>
                <Typography className="mb-2">
                  To start a call, please fill the form before
                </Typography>
                <form
                  style={{ height: `80vh` }}
                  onSubmit={(e) => handleSubmit(e)}
                >
                  <TextField
                    value={form.name}
                    onChange={(e) => handleInput(e)}
                    // disabled={form.isLoadingSetupWebphone}
                    fullWidth
                    required
                    color="info"
                    id="form-name"
                    label="Name"
                    size="small"
                    margin="dense"
                    name="name"
                    sx={styling.TextField}
                  />
                  <TextField
                    value={form.email}
                    onChange={(e) => handleInput(e)}
                    // disabled={form.isLoadingSetupWebphone}
                    fullWidth
                    required
                    color="info"
                    id="form-email"
                    label="Email"
                    name="email"
                    size="small"
                    margin="dense"
                    sx={styling.TextField}
                  />
                  <TextField
                    value={form.phone}
                    onChange={(e) => handleInput(e)}
                    fullWidth
                    required
                    color="info"
                    id="form-phone"
                    label="Phone"
                    name="phone"
                    size="small"
                    margin="dense"
                    type="number"
                    sx={styling.TextField}
                  />

                  <Box>
                    <Checkbox required sx={styling.Checkbox} />
                    <Typography component="span" fontSize={12}>
                      You agree to our friendly
                    </Typography>
                    <Typography
                      component="span"
                      fontSize={12}
                      onClick={() => setOpenModalAgree(true)}
                      color={color.main}
                    >
                      Privacy Policy
                    </Typography>
                  </Box>
                  <Box
                    width="90%"
                    display="flex"
                    justifyContent="center"
                    position={`${type === "web" ? "absolute" : "absolute"}`}
                    bottom={0}
                    paddingY="12px"
                  >
                    <Button
                      type="submit"
                      sx={{
                        width: "100%",
                        borderRadius: "10px",
                        marginTop: "1em",
                        backgroundColor: `${color.main}`,
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
          ) : openFloating && isOpen === "welcome" ? (
            <>
              <Welcome setOpenFloating={setOpenFloating} />
            </>
          ) : (
            <FloatingButton setOpenFloating={setOpenFloating} />
          )}
        </>
      ) : (
        <>
          <StartCall handleSubmitMobile={handleSubmitMobile} />
        </>
      )}
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
