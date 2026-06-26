import { create } from "zustand";

interface UserStore {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

export const userStore = create<UserStore>((set) => ({
  isAdmin: false,
  setIsAdmin: (value: boolean) => set({ isAdmin: value }),
}));
