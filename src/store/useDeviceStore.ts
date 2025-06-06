// store/useDeviceStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "./storage"; // MMKV wrapper tu already banavlay
import { Dimensions } from "react-native";

interface DeviceState {
    width: number;
    height: number;
    isPortrait: boolean;
    setDimensions: (width: number, height: number) => void;
}

export const useDeviceStore = create<DeviceState>()(
    persist(
        (set) => ({
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            isPortrait: Dimensions.get("window").height >= Dimensions.get("window").width,
            setDimensions: (width, height) =>
                set({
                    width,
                    height,
                    isPortrait: height >= width,
                }),
        }),
        {
            name: "device-dimensions",
            storage: createJSONStorage(() => mmkvStorage),
        }
    )
);