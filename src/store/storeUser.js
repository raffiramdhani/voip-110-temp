import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const intialValue = {
  user: null,
};

const useUserStore = create(
  devtools(
    persist(
      (set) => ({
        ...intialValue,
        setUser: (user) => set({ user }),
      }),
      {
        name: 'user-storage',
      }
    )
  )
);

export default useUserStore;
