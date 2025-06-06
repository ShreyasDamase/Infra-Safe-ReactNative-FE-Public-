// src/theme/Color.ts
import { useColorScheme } from 'react-native';
import { Colors } from './Colors';
import React, { useEffect } from 'react';
import { mmkvStorage } from "@/store/storage";
import DarkColors from './DarkColors';

const THEME_KEY = 'app_theme_preference';
type ThemePreference = 'light' | 'dark' | 'system';

// Theme store with event emitter
const listeners = new Set<() => void>();
let currentTheme: typeof Colors | typeof DarkColors = Colors;
let currentPreference: ThemePreference = 'system';

// Initialize theme (call this in your root layout)
export const initTheme = (systemScheme: 'light' | 'dark' | null | undefined) => {
    const savedPreference = mmkvStorage.getItem(THEME_KEY) as ThemePreference || 'system';
    updateTheme(savedPreference, systemScheme);
};



const updateTheme = (preference: ThemePreference, systemScheme: 'light' | 'dark' | null | undefined) => {
    currentPreference = preference;
    const effectiveScheme = systemScheme ?? 'light';//if systemSchema is null or undefine it assign light

    currentTheme = preference === 'system'
        ? (effectiveScheme === 'dark' ? DarkColors : Colors)
        : (preference === 'dark' ? DarkColors : Colors);

    // Notify all listeners
    listeners.forEach(listener => listener());
};

export const useAppTheme = () => {



    const systemScheme = useColorScheme();
    const [_, forceUpdate] = React.useReducer(x => x + 1, 0);

    React.useEffect(() => {
        listeners.add(forceUpdate);
        return () => {
            listeners.delete(forceUpdate);
        };
    }, []);
    // useEffect(() => {
    //     if (currentPreference === 'system') {
    //         updateTheme(currentPreference, systemScheme);
    //     }
    // }, [systemScheme]); test it later
    return {
        theme: currentTheme,
        setTheme: (preference: ThemePreference) => {
            mmkvStorage.setItem(THEME_KEY, preference);
            updateTheme(preference, systemScheme);
        },

        preference: currentPreference
    };
};

export const getTheme = () => currentTheme;

export { Colors, DarkColors };