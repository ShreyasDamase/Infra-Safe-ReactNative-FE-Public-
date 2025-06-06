import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "./storage";
type CustomeLocation = {
  latitude: number;
  longitude: number;
  address: string;
  heading: number;
} | null;

interface UserStoreProps {
  user: any;
  location: CustomeLocation;
  setUser: (data: any) => void;
  onDuty: boolean;
  setOnDuty: (data: boolean) => void;

  setLocation: (data: CustomeLocation) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserStoreProps>()(
  persist(
    (set) => ({
      user: null,
      location: null,
      onDuty: false,
      setOnDuty: (data) => set({ onDuty: data }),

      setUser: (data) => set({ user: data }),
      setLocation: (data) => set({ location: data }),
      clearUserData: () => set({ user: null, location: null }),
    }),
    {
      name: "User-store", //it key to mmkv storage
      partialize: (state) => ({ user: state.user }),
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
