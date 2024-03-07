import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Theme from "@/styles/theme";
import { ThemeProvider } from "@mui/material/styles";
import GlobalStyle from "@/styles/GlobalStyle";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import "./utils/i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div>
      <GlobalStyle />
      <ThemeProvider theme={Theme}>
        <GoogleReCaptchaProvider reCaptchaKey="6Lcnu3EdAAAAAObE6a1sU-41rpoX8yDczbu9529P">
          <App />
        </GoogleReCaptchaProvider>
      </ThemeProvider>
    </div>
  </React.StrictMode>
);
