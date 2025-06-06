import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "./storage";
type CustomeLocation = {
  latitude: number;
  longitude: number;
  address: string;
} | null;

interface CitizenStoreProps {
  user: any;
  location: CustomeLocation;
  setCitizen: (data: any) => void;
  setLocation: (data: CustomeLocation) => void;
  clearCitizenData: () => void;
}

export const useCitizenStore = create<CitizenStoreProps>()(
  persist(
    (set) => ({
      user: null,
      location: null,
      setCitizen: (data) => set({ user: data }),
      setLocation: (data) => set({ location: data }),
      clearCitizenData: () => set({ user: null, location: null }),
    }),
    {
      name: "Citizen-store", //it key to mmkv storage
      partialize: (state) => ({ user: state.user }),
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
