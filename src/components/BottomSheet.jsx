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
  SwipeableDrawer,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import axios from "axios";
import useProfileStore from "@/store/profileStore";

import CloseIcon from "@mui/icons-material/Close";
import StarActive from "@/assets/star-active.svg";
import StarInactive from "@/assets/star-inactive.svg";
import useRouteStore from "@/store/routeStore";

const env = import.meta.env;
const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}));

const BottomSheet = ({ open, displayRemark }) => {
  const { t, i18n } = useTranslation();
  const route = useRouteStore((state) => state);
  const profile = useProfileStore((state) => state);
  const [score, setScore] = React.useState(null);
  const [rating_review, setRatingReview] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    i18n.changeLanguage(profile?.profile?.bahasa === "EN" ? "en" : "id");
  }, []);

  const handleNavigateNext = () => {
    // console.log("handleNavigateNext", env.VITE_APP_HREF_URL);
    if (env.VITE_APP_HREF_URL) {
      window.location.assign(env.VITE_APP_HREF_URL);
    } else {
      route.push("login");
    }
  };

  const handleSubmitReview = () => {
    if (score && rating_review.length) {
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
    } else handleNavigateNext();
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      PaperProps={{
        // square: false,
        elevation: 0,
        sx: {
          borderRadius: "15px 15px 0px 0px",
        },
      }}
    >
      <Box
        role="presentation"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: "53vh",
          backgroundColor: "#fff",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
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
              fontSize: "20px",
              // lineHeight: "26px",
              fontWeight: "bold",
              // mb: "10px",
              textAlign: "center",
            }}
          >
            {t("rating.headline")}
          </Typography>
          <Box sx={{ marginTop: "5px" }}>
            <StyledRating
              name="rating"
              id="rating"
              onChange={(_, v) => setScore(v)}
              value={score}
              icon={
                <img
                  src={StarActive}
                  alt="Star Active"
                  style={{ padding: "5px" }}
                />
              }
              emptyIcon={
                <img
                  src={StarInactive}
                  alt="Star Active"
                  style={{ padding: "5px" }}
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
          {displayRemark ? (
            <>
              <Typography
                sx={{
                  // marginY: "24px",
                  // marginX: "32px",
                  margin: "10px 0px",
                  textAlign: "center",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: "normal",
                }}
              >
                {score > 2 && score !== null
                  ? t("rating.impression")
                  : t("rating.suggestion")}
              </Typography>
              <TextField
                id="outlined-multiline-static"
                multiline
                rows={3}
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
                  marginTop: "5px",
                  width: "80%",
                }}
                onChange={(e) => setRatingReview(e.target.value)}
                value={rating_review}
                placeholder={t("rating.inputPlaceholder")}
                inputProps={{ maxLength: 200 }}
              />
            </>
          ) : null}
          <Box
            sx={{
              width: "80%",
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
              width: "80%",
              marginTop: "15px",
              backgroundColor: "#00BFB2",
              borderRadius: "50px",
            }}
            disabled={score === null || !rating_review.length}
            onClick={handleSubmitReview}
            // disabled={rating_review?.length === 200}
          >
            {/* {console.log("cek",rating_review?.length)} */}
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
    </SwipeableDrawer>
  );
};

export default BottomSheet;
