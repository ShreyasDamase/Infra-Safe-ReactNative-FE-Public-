import React, { useEffect, useState } from "react";
import { Redirect, SplashScreen } from "expo-router";
import { mmkvStorage, tokenStorage } from "@/store/storage";
import { jwtDecode } from "jwt-decode";
import { Alert } from "react-native";
import { refresh_tokens } from "@/service/apiInterceptor";
import { resetAndNavigate } from "@/utils/Helpers";
import { logOut } from "@/service/authService";
import { useUserStore } from "@/store/userStore";

interface DecodedToken {
  exp: number;
}

export default function Index() {
  // All state hooks at the top
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const { user } = useUserStore();
  const parsedUser = typeof user === "string" ? JSON.parse(user) : user;
  console.log("mmkv storage use", user);
  const [hasNavigated, setHasNavigated] = useState(false);

  // Define tokenCheck before any effects that use it
  const tokenCheck = async () => {
    console.log("check token storage");
    const access_token = tokenStorage.getString("access_token") as string;
    const refresh_token = tokenStorage.getString("refresh_token") as string;
    console.log("acc", access_token);
    console.log("re", refresh_token);

    if (!refresh_token) {
      console.log("No tokens found");
      logOut();
      resetAndNavigate("/role/login");
      return;
    }

    // if (access_token && refresh_token) {
    //   const decodedAccess = jwtDecode<{ exp: number }>(access_token);
    //   const decodedRefresh = jwtDecode<{ exp: number }>(refresh_token);

    //   // Convert to readable date
    //   const accessExpiry = new Date(decodedAccess.exp * 1000).toLocaleString();
    //   const refreshExpiry = new Date(
    //     decodedRefresh.exp * 1000,
    //   ).toLocaleString();

    //   console.log("Access Token expires at:", accessExpiry);
    //   console.log("Refresh Token expires at:", refreshExpiry);
    //   console.log(access_token, refresh_token);
    // }

    // if (access_token) {
    //   const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
    //   const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token);
    //   const currentTime = Date.now() / 1000;
    //   console.log(decodedAccessToken, decodedRefreshToken);
    //   if (decodedAccessToken?.exp < currentTime) {
    //     resetAndNavigate("/role/login");
    //     Alert.alert("Session Expired, please login again");
    //     logOut();
    //     return; // Important to return after navigation
    //   }

    //   if (decodedRefreshToken?.exp < currentTime) {
    //     try {
    //       await refresh_tokens();
    //     } catch (err) {
    //       console.log(err);
    //       Alert.alert("Refresh Token Error");
    //       logOut();
    //       return;
    //     }
    //   }
    //   console.log(parsedUser);
    //   if (parsedUser) {
    //     if (parsedUser?.role === "citizen") {
    //       console.log("navigate to ctizen");
    //       resetAndNavigate("/Citizen/(tabs)/profile");
    //       return;
    //     } else {
    //       console.log("navigate to helper");
    //       resetAndNavigate("/Helper/(tabs)/profile");
    //       return;
    //     }
    //   }
    // }

    // Default navigation if no tokens or user
    // console.log("default");
    // resetAndNavigate("/role/login");

    try {
      const currentTime = Date.now() / 1000;
      const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token);

      // 1️⃣ Access token expired
      if (decodedAccessToken?.exp < currentTime) {
        // 2️⃣ Check if refresh token also expired
        if (decodedRefreshToken?.exp < currentTime) {
          Alert.alert("Session Expired, please login again");
          logOut();
          resetAndNavigate("/role/login");
          return;
        }

        // 3️⃣ Refresh token is valid, try to refresh
        try {
          await refresh_tokens(); // Should ideally update your global state or AsyncStorage
          tokenCheck();
          return;
        } catch (err) {
          console.log("Refresh token error:", err);
          Alert.alert("Refresh Token Error");
          logOut();
          resetAndNavigate("/role/login");
          return;
        }
      }
      // 4️⃣ Access token is valid → route user based on role
      if (parsedUser) {
        if (parsedUser.role === "citizen") {
          resetAndNavigate("/Citizen/(tabs)/profile");
        } else {
          resetAndNavigate("/Helper/(tabs)/profile");
        }
      }
    } catch (error) {
      console.log("Token Decode Error:", error);
      Alert.alert("Invalid Session, please login again");
      logOut();
      resetAndNavigate("/role/login");
    }
  };

  // First effect - check onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasViewed = mmkvStorage.getItem("@viewedOnboarding");
        console.log("Onboarding status:", hasViewed);
        setShowOnboarding(hasViewed !== "true");
      } catch (error) {
        console.error("Error checking onboarding:", error);
        setShowOnboarding(true);
      } finally {
        SplashScreen.hideAsync();
      }
    };
    checkOnboardingStatus();
  }, []);

  // Second effect - handle token check
  useEffect(() => {
    if (showOnboarding === false && !hasNavigated) {
      console.log("Token check triggered");
      const timer = setTimeout(() => {
        tokenCheck();
        setHasNavigated(true);
      }, 0); // Using minimal delay to ensure effect completes

      return () => clearTimeout(timer);
    }
  }, [showOnboarding, hasNavigated]);

  console.log("Current state:", { showOnboarding, hasNavigated });

  // Render controls at the bottom
  if (showOnboarding === null) return null;
  if (showOnboarding) return <Redirect href="/(onboarding)/onboarding" />;

  // This will briefly show before tokenCheck navigates away
  return null;
}
