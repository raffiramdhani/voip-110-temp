import { ConfigProvider } from "antd";

const AntdConfigProvider = (props) => {
  const env = import.meta.env;

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: env.VITE_APP_MAIN_COLOR,
          },
        },
        // token: { fontFamily: "Lato" },
      }}
    >
      {props.children}
    </ConfigProvider>
  );
};

export default AntdConfigProvider;
