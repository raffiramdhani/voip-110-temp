import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Theme from "@/styles/theme";
import { ThemeProvider } from "@mui/material/styles";
import GlobalStyle from "@/styles/GlobalStyle";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { AntdConfigProvider } from "./styles/AntdConfigProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div>
      {/* <GlobalStyle /> */}
      {/* <ThemeProvider theme={Theme}> */}
      <AntdConfigProvider>
        <GoogleReCaptchaProvider
          reCaptchaKey={import.meta.env.VITE_APP_RECAPTCHA_KEY}
        >
          <App />
        </GoogleReCaptchaProvider>
      </AntdConfigProvider>
      {/* </ThemeProvider> */}
    </div>
  </React.StrictMode>
);
