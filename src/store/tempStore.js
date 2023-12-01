import create from "zustand";
import { devtools } from "zustand/middleware";

const useTempStore = create(
  devtools((set) => ({
    call_start_time: null,
    setCallStartTime: (time) => set({ call_start_time: time }),
  }))
);

export default useTempStore;
