import React, { useState } from "react";
import {
  Box,
  Button,
  Avatar,
  Typography,
  TextField,
  Checkbox,
  CircularProgress,
} from "@mui/material";

import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import TermsCond from '@/components/Modals/TermsCond'

import useRouteStore from "@/store/routeStore";
import useProfileStore from "@/store/profileStore";
import { decrypt } from "@/utils/encrypt";

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

  const requestExtension = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", env.VITE_APP_AUTHORIZATION);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      username: form.name,
      email: form.email,
      phone: form.phone,
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
  return (
    <Box width="100%" height="100%" bgcolor="#fff">
      <Box
        width="100%"
        padding="15px 20px"
        display="flex"
        alignItems="center"
        gap="10px"
        bgcolor={env.VITE_APP_MAIN_COLOR}
      >
        <Avatar sx={{ bgcolor: "#01A3DE" }}>
          <ContactSupportIcon />
        </Avatar>
        <Box>
          <Typography fontSize="18px" fontWeight="500" color="#fff">
            Customer Call Support
          </Typography>
          <Typography fontSize="12px" fontWeight="300" color="#fff">
            Operational hours: 24 hours
          </Typography>
        </Box>
      </Box>
      <Box>
        <Box sx={{ padding: "20px" }}>
          <form onSubmit={(e) => handleSubmit(e)}>
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
              <Typography
                component="span"
                fontSize={12}
                onClick={() => this.setState({ modalAgree: true })}
                sx={styling.LabelCheckBox}
              >
                Terms & conditions
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                sx={{ marginTop: "1em" }}
                color="primary"
                variant="outlined"
                startIcon={<PhoneInTalkIcon />}
                disabled={loading}
              >
                {loading && (
                  <CircularProgress
                    size={20}
                    color="inherit"
                    sx={{ marginX: "10px" }}
                  />
                )}
                Click to Call
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
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
  secondary: "#1665C0",
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
