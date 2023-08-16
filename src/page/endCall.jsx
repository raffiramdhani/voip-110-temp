import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Rating,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import axios from "axios";
import useRouteStore from "@/store/routeStore";
import useProfileStore from "@/store/profileStore";

import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";

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

const customIcons = {
  1: {
    icon: <StarIcon color="#e8b751" fontSize="large" />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <StarIcon color="#e8b751" fontSize="large" />,
    label: "Dissatisfied",
  },
  3: {
    icon: <StarIcon color="#e8b751" fontSize="large" />,
    label: "Neutral",
  },
  4: {
    icon: <StarIcon color="#e8b751" fontSize="large" />,
    label: "Satisfied",
  },
  5: {
    icon: <StarIcon color="#e8b751" fontSize="large" />,
    label: "Very Satisfied",
  },
};

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}));

const IconContainer = (props) => {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
};

export default function endCall() {
  const route = useRouteStore((state) => state);
  const profile = useProfileStore((state) => state);
  const [score, setScore] = React.useState(null);
  const [rating_review, setRatingReview] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showRating, setShowRating] = React.useState(true);

  const handleNavigateNext = () => {
    setTimeout(() => {
      route.push("login");
    }, 5000);
  };

  const handleSubmitReview = () => {
    setIsLoading(true);
    axios
      .post(
        `${env.VITE_APP_EXTEN_URL}/ratingController`,
        {
          unique_id: profile?.profile?.phone,
          phone: profile?.profile?.phone,
          rating: score,
          rating_review,
          tenant: env.VITE_APP_EXTEN_TENANT,
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
          setShowRating(false);
          handleNavigateNext();
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh" }}
    >
      {showRating ? (
        <IconButton
          sx={{ position: "absolute", top: 24, right: 24 }}
          onClick={() => {
            setShowRating(false);
            handleNavigateNext();
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
      {showRating ? (
        <>
          <Container
            sx={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography>
              Berikan penilaian kamu atas layanan BSI Call
            </Typography>
            <Box sx={{ marginTop: "10px" }}>
              <StyledRating
                name="rating"
                id="rating"
                onChange={(_, v) => setScore(v)}
                value={score}
                IconContainerComponent={IconContainer}
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
              sx={{ marginTop: "10px", marginX: "32px", textAlign: "center" }}
            >
              {score > 2 || score === null
                ? `Terimakasih atas penilaian kamu! Apa yang berkesan dari pelayanan agent kami?`
                : "Beritahu kami apa yang bisa di tingkatkan dari pelayanan agent kami?"}
            </Typography>
            <TextField
              id="outlined-multiline-static"
              multiline
              rows={4}
              sx={{ marginTop: "10px", width: isMobile ? "80%" : "50%" }}
              onChange={(e) => setRatingReview(e.target.value)}
              value={rating_review}
            />
            <Button
              type="submit"
              variant="outlined"
              sx={{ width: isMobile ? "80%" : "50%", marginTop: "15px" }}
              onClick={handleSubmitReview}
            >
              {!isLoading ? (
                <span className="indicator-label">KIRIM</span>
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
        </>
      ) : (
        <Typography>Terimakasih telah menghubungi Layanan BSI Call.</Typography>
      )}
    </Box>
  );
}
