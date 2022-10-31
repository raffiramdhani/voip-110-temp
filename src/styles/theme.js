import { createTheme } from "@mui/material/styles";

const mainTheme = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontSize: "46px",
      fontWeight: "600",
    },
    h2: {
      fontSize: "36px",
      fontWeight: "600",
    },
    h3: {
      fontSize: "30px",
      fontWeight: "600",
    },
    h4: {
      fontSize: "24px",
      fontWeight: "600",
    },
    h5: {
      fontSize: "18px",
      fontWeight: "600",
    },
    h6: {
      fontSize: "14px",
      fontWeight: "500",
    },
    body1: {
      fontSize: "16px",
      color: "#212020",
    },
    body2: {
      fontSize: "14px",
      color: "#232933",
    },
    title: {
      fontSize: "20px",
      color: "#626B79",
      fontWeight: 500,
    },
    button: {
      fontSize: "14px",
      fontWeight: "500",
      textTransform: "inherit",
    },
  },
  palette: {
    primary: {
      main: "#0774D1",
      contrast: "#c7e5ff",
      contrastText: "#fff",
    },
    info: {
      main: "#0774D1",
      contrastText: "#fff",
    },
    secondary: {
      main: "#008E58",
      contrastText: "#fff",
    },
    error: {
      main: "#C10000",
      contrastText: "#fff",
    },
    warning: {
      main: "#FF8F00",
      contrastText: "#171717",
    },
    success: {
      main: "#008E58",
      contrastText: "#fff",
    },
    greyButton: {
      main: "#fafafa",
      contrastText: "#626b79",
    },
    slider: {
      main: "#c7c3c3",
      contrastText: "#f3f3f3",
    },
    grey: {
      main: "#fafafa",
      contrastText: "#626b79",
      focused: "#fafafa",
    },
    textGrey: {
      main: "#626b79",
      contrastText: "#626b79",
      focused: "#fafafa",
    },
    text: {
      primary: "#232933",
      secondary: "#626B79",
      disabled: "#8B95A5",
      main: "#232933",
    },
  },
  // Overrides style component
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        size: "medium",
        variant: "contained",
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
  },
});

export default mainTheme;
