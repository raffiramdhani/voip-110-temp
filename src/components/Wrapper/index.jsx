import React from "react";
import Dialler from "../Dialler";

const Wrapper = ({ windowsType, children }) => {
  return (
    <>
      {windowsType === "Web" ? (
        <div className="absolute bottom-28 right-5 h-primary w-96 rounded-xl overflow-hidden shadow-2xl">
          {children}
        </div>
      ) : windowsType === "Mobile" ? (
        <div className=" bottom-0 h-screen w-full shadow-2xl">{children}</div>
      ) : null}
    </>
  );
};

export default Wrapper;
