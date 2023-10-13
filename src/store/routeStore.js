import { encrypt } from "@/utils/encrypt";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const encryptedParams = new URLSearchParams(window.location.search).get("key");
// const payload = {
//   menu: "Prioritas-Perbankan",
//   is_postlogin: 1,
//   user: {
//     fullname: "Yolanda",
//     email: "yolanda@gmail.com",
//     phone: "081234567890",
//   },
//   bahasa: "EN",
// };
// console.log("encryptedParams >>> ", encrypt(JSON.stringify(payload)));

const intialValue = {
  curentRoute: encryptedParams ? "call" : "login",
  ui: {
    error: false,
    errorMessage: null,
  },
};
const useRouteStore = create(
  devtools(
    (set) => ({
      ...intialValue,
      push: (path) => set({ curentRoute: path }),
      setOpenIframe: (state) =>
        set((prev) => ({
          ui: {
            ...prev.ui,
            openCallUI: state,
          },
        })),
    }),
    {
      name: "route-storage",
    }
  )
);

export default useRouteStore;
