import React, { lazy } from "react";

import Login from "./login";
import PhoneCall from "./phoneCall";
import EndCall from "./endCall";

import useRouteStore from "@/store/routeStore";

export default function Page(props) {
  const path = useRouteStore((state) => state.curentRoute);

  switch (path) {
    case "call":
      return <PhoneCall />;
    case "login":
      return <Login props={props} />;
    case "end":
      return <EndCall />;
    default:
      return window.closed();
  }
}
