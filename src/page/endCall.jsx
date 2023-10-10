import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Rating,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import axios from "axios";
import useRouteStore from "@/store/routeStore";
import useProfileStore from "@/store/profileStore";

import CloseIcon from "@mui/icons-material/Close";
import StarActive from "@/assets/star-active.svg";
import StarInactive from "@/assets/star-inactive.svg";

const env = import.meta.env;
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

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}));

export default function endCall() {
  const { t, i18n } = useTranslation();
  const route = useRouteStore((state) => state);
  const profile = useProfileStore((state) => state);
  const [score, setScore] = React.useState(null);
  const [rating_review, setRatingReview] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleNavigateNext = () => {
    setTimeout(() => {
      if (isMobile) {
        if (env.VITE_APP_HREF_URL) {
          window.location = env.VITE_APP_HREF_URL;
        } else {
          route.push("login");
        }
      } else {
        route.push("login");
      }
    }, 5000);
  };

  const handleSubmitReview = () => {
    setIsLoading(true);
    const phone = profile?.profile?.phone
      ? profile?.profile?.phone?.startsWith("0")
        ? "+62" + profile?.profile?.phone?.slice(1)
        : profile?.profile?.phone?.startsWith("62")
        ? "+" + profile?.profile?.phone
        : profile?.profile?.phone
      : "";
    axios
      .post(
        `${env.VITE_APP_EXTEN_URL}/ratingController`,
        {
          unique_id: phone,
          phone,
          rating: score,
          rating_review,
          tenant: env.VITE_APP_EXTEN_TENANT,
          call_id: profile?.profile?.call_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: env.VITE_APP_AUTHORIZATION,
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        if (res?.data) {
          handleNavigateNext();
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    i18n.changeLanguage(profile?.profile?.bahasa === "ENG" ? "en" : "id");
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh" }}
    >
      <IconButton
        sx={{ position: "absolute", top: 16, right: 16 }}
        onClick={() => {
          handleNavigateNext();
        }}
      >
        <CloseIcon />
      </IconButton>
      <Container
        sx={{
          px: "24px",
          marginTop: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "21px",
            lineHeight: "26px",
            fontWeight: "bold",
            mb: "10px",
            textAlign: "center",
          }}
        >
          {t("rating.headline")}
        </Typography>
        <Box sx={{ marginTop: "10px" }}>
          <StyledRating
            name="rating"
            id="rating"
            onChange={(_, v) => setScore(v)}
            value={score}
            icon={
              <img
                src={StarActive}
                alt="Star Active"
                style={{ padding: "8px" }}
              />
            }
            emptyIcon={
              <img
                src={StarInactive}
                alt="Star Active"
                style={{ padding: "8px" }}
              />
            }
            // getLabelText={(value) => customIcons[value].label}
          />
        </Box>
      </Container>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            marginY: "24px",
            marginX: "32px",
            textAlign: "center",
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: "normal",
          }}
        >
          {score > 2 || score === null
            ? t("rating.impression")
            : t("rating.suggestion")}
        </Typography>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={4}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderRadius: "18px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#00BFB2",
                borderWidth: "2px",
              },
            },
            marginTop: "10px",
            width: isMobile ? "80%" : "50%",
          }}
          onChange={(e) => setRatingReview(e.target.value)}
          value={rating_review}
          placeholder={t("rating.inputPlaceholder")}
          inputProps={{ maxLength: 200 }}
        />
        <Box
          sx={{
            width: isMobile ? "80%" : "50%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Typography sx={{ fontSize: 12, color: "#8f8f8f" }}>
            {rating_review?.length ?? 0} / 200
          </Typography>
        </Box>
        <Button
          type="submit"
          variant="contained"
          sx={{
            width: isMobile ? "80%" : "50%",
            marginTop: "15px",
            backgroundColor: "#00BFB2",
            borderRadius: "50px",
          }}
          onClick={handleSubmitReview}
        >
          {!isLoading ? (
            <span className="indicator-label">{t("rating.send")}</span>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={"24px"} />
            </Box>
          )}
        </Button>
      </Container>
    </Box>
  );
}
