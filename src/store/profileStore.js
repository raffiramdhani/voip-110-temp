import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const intialValue = {
  profile: null,
  reqExten: null
};
const useRouteStore = create(
  devtools(
    (set) => ({
      ...intialValue,
      setProfile: (value) => set({ profile: value }),
      setReqExten: (value) => set({ reqExten: value }),
    }),
    {
      name: "route-storage",
    }
  )
);

export default useRouteStore;
