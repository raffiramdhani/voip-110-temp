import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Rating,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import useRouteStore from "@/store/routeStore";

import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" fontSize="large" />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" fontSize="large" />,
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" fontSize="large" />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" fontSize="large" />,
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" fontSize="large" />,
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
  const [rating, setRating] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // XXX
  // React.useEffect(() => {
  //   setTimeout(() => {
  //     route.push("login");
  //   }, 5000);
  // });

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh" }}
    >
      <Typography>Terima kasih telah menghubungi kami.</Typography>
      <Container
        sx={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>Chat telah berakhir</Typography>
        <Box sx={{ marginTop: "10px" }}>
          <StyledRating
            name="rating"
            id="rating"
            onChange={(e) => setRating(e.target.value)}
            value={rating}
            IconContainerComponent={IconContainer}
            getLabelText={(value) => customIcons[value].label}
            highlightSelectedOnly
          />
        </Box>
      </Container>

      {rating !== null && (
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="submit"
            variant="outlined"
            sx={{ width: "50%", marginTop: "15px" }}
          >
            {!isLoading ? (
              <span className="indicator-label">SIMPAN</span>
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
      )}
    </Box>
  );
}
