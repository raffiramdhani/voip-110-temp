import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const intialValue = {
  curentRoute: "login",
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
    }),
    {
      name: "route-storage",
    }
  )
);

export default useRouteStore;
