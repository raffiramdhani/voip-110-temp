import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const intialValue = {
  curentRoute: "call",
  ui: {
    openCallUI: false,
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
