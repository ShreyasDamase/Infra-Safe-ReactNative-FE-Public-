import React, { useEffect, useCallback, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { View, Image, StyleSheet, useColorScheme } from "react-native";
import { initTheme } from "@/theme/useAppTheme";
import { useFonts } from "expo-font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import "../lib/i18n";
import i18n from "@/lib/i18n";
import { I18nextProvider } from "react-i18next";
import { WSProvider } from "@/service/WSProvider";

const queryClient = new QueryClient();
// Keep the splash screen visible until we manually hide it
export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const scheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    "NotoSans-Thin": require("@/assets/fonts/NotoSans-Thin.ttf"),
    "NotoSans-Light": require("@/assets/fonts/NotoSans-Light.ttf"),
    "NotoSans-LightItalic": require("@/assets/fonts/NotoSans-LightItalic.ttf"),
    "NotoSans-Regular": require("@/assets/fonts/NotoSans-Regular.ttf"),
    "NotoSans-Medium": require("@/assets/fonts/NotoSans-Medium.ttf"),
    "NotoSans-MediumItalic": require("@/assets/fonts/NotoSans-MediumItalic.ttf"),
    "NotoSans-SemiBold": require("@/assets/fonts/NotoSans-SemiBold.ttf"),
    "NotoSans-Bold": require("@/assets/fonts/NotoSans-Bold.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync(); // <- move here
        await new Promise((resolve) => setTimeout(resolve, 2000)); // fake delay
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);
  useEffect(() => {
    initTheme(scheme);
  }, [scheme]);
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require("@/assets/images/splashscreen_logo.png")}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </View>
    );
  }
  if (!fontsLoaded) {
    return null; // Don’t render anything until fonts are loaded
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <WSProvider>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <Slot />
            <Toast />
          </I18nextProvider>
        </QueryClientProvider>
      </WSProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  splashImage: {
    width: 200,
    height: 200,
  },
});
