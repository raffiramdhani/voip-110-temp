import React, { lazy } from "react";

import Login from "./login";
import PhoneCall from "./phoneCall";

import useRouteStore from "@/store/routeStore";

export default function Page(props) {
  const path = useRouteStore((state) => state.curentRoute);

  switch (path) {
    case "call":
      return <PhoneCall />;
    case "login":
        return <Login props={props} />;
    default:
      return <h1>Not Found</h1>;
  }
}
