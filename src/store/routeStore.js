import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const encryptedParams = new URLSearchParams(window.location.search).get(
  "key"
)

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
