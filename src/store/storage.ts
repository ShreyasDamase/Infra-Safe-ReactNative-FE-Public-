import { MMKV } from "react-native-mmkv";
//MMKV instance to storeage token information
export const tokenStorage = new MMKV({
    id: "token-storage",
    encryptionKey: "some-secret-key", // Optional, set to enable encryption
});
//MMKV instance to app storeage to store data

export const storage = new MMKV({
    id: "my-app-storage",
    encryptionKey: "some-secret-key",
});
console.log("Test MMKV:", storage.getAllKeys()); // If this fails, MMKV isn’t initialized correctly

console.log("🧠 MMKV All Keys:", storage.getAllKeys());

storage.getAllKeys().forEach((key) => {
    const value = storage.getString(key);
    console.log(`🔑 [${key}]:`, value);
});
//Wrapper for zustand storage
export const mmkvStorage = {
    setItem: (key: string, value: string) => {
        storage.set(key, value);
    },
    getItem: (key: string) => {
        const value = storage.getString(key);
        return value ?? null;
    },
    removeItem: (key: string) => {
        storage.delete(key);
    },
};
