import React from "react";
import VoiceIcon from "../../assets/voice-icon.png";
import useAuth from "@/store/openingStore";
import icon_bpjs from "../../assets/bpjs.png";

const FloatingButton = ({ setOpenFloating }) => {
  const { isOpen, setIsOpen } = useAuth((state) => state);

  const env = import.meta.env;
  return (
    <div
      style={{ position: "absolute", bottom: "15px", right: "15px" }}
      //   onClick={() => {
      //     setOpen(!open);
      //     <Navigate to="/auth" />;
      //   }}
    >
      <div
        style={{
          backgroundColor: `${env.VITE_APP_MAIN_COLOR}`,
          width: 65,
          height: 60,
          borderRadius: "34px 8px 34px 34px",
          boxShadow: "0 5px 4px 0 rgb(0 0 0 / 26%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          cursor: "pointer",
          // transform: `translateX(0px) translateY(${positionPopUp}%) translateZ(0px)`,
          //   transform: `scale(${!open ? 1 : 0})`,
          //   opacity: !open ? "100%" : "0%",
          zIndex: 3,
          transition: "all 200ms ease-in-out",
        }}
        onClick={() => setOpenFloating(true)}
      >
        testing
        <img
          src={`${icon_bpjs}`}
          srcSet={`${icon_bpjs}`}
          alt={`${icon_bpjs}asd`}
          loading="lazy"
          style={{
            height: "50px",
            width: "50px",
          }}
        />
      </div>
    </div>
  );
};

export default FloatingButton;
