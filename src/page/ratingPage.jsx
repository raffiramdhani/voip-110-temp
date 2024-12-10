import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import LogoLayanan from "../assets/logo-layanan.png";
import LogoPrioritas from "../assets/logo-prioritas.png";
import { useTranslation } from "react-i18next";
import RatingDrawer from "@/components/BottomSheet";

export default function ratingPage(props) {
  const { params, statusCall } = props;
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(params?.bahasa === "EN" ? "en" : "id");
    // initFlashphoner();
    // console.log("1.0.0");
  }, []);
  return (
    <>
      <Box
        bottom="8rem"
        right="2rem"
        display="flex"
        flexDirection="column"
        height="100%"
        sx={{
          background:
            "linear-gradient(0deg, #001489 0%, #0047BB 69.00%, #0047BB 100%)",
          overflowY: "hidden",
        }}
      >
        <Box
          width="100%"
          height="100%"
          display="flex"
          position="relative"
          flexDirection="column"
          sx={{
            background:
              "linear-gradient(0deg, #001489 0%, #0047BB 69.00%, #0047BB 100%)",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              marginTop: "64px",
              marginBottom: "7vh",
              userSelect: "none",
            }}
          >
            {t(`call.headline.${params?.menu}`)}
          </Typography>
          <Box
            sx={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              marginBottom: "20px",
            }}
          >
            <img
              src={
                params?.menu?.split("-")?.[0] === "Umum"
                  ? LogoLayanan
                  : LogoPrioritas
              }
              style={{ width: "167px", height: "147px" }}
            />
          </Box>
          <Box textAlign="center">
            <Typography
              sx={{
                fontWeight: "bold",
                color: "white",
                marginBottom: "20px",
                userSelect: "none",
              }}
            >
              {t(`call.descOne.Panggilan Berakhir`)}
              {/* {statusCall === "waiting" ? (
                                t(`call.descOne.Sedang Menghubungi`)
                            ) : statusCall === "RING" ? (
                                t(`call.descOne.Berdering`)
                            ) : statusCall === "End Call" ? (
                                t(`call.descOne.Panggilan Berakhir`)
                            ) : (
                                <Typography
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        margin: "10px 0",
                                        color: "white",
                                        fontSize: 18,
                                        fontWeight: 500,
                                    }}
                                    color="white"
                                    className="timer"
                                >
                                    <Typography className="digits" variant="inherit">
                                        {"00"}:
                                    </Typography>
                                    <Typography className="digits" variant="inherit">
                                        {"00"}
                                    </Typography>
                                </Typography>
                            )} */}
            </Typography>
          </Box>
        </Box>
        <RatingDrawer open={true} displayRemark={true} />
      </Box>
    </>
  );
}
