import React from "react";
import useRouteStore from "@/store/routeStore";
import { Col, Row, Typography } from "antd";

export default function endCall() {
  const route = useRouteStore((state) => state);
  React.useEffect(() => {
    setTimeout(() => {
      route.push("login");
    }, 5000);
  });
  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", backgroundColor: "white" }}
    >
      <Col>
        <Typography.Text>Terima kasih telah menghubungi kami.</Typography.Text>
      </Col>
    </Row>
  );
}
