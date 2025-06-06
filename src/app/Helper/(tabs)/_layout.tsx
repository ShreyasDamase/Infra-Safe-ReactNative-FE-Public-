import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { initTheme, useAppTheme } from "@/theme/useAppTheme";

const TabLayout = () => {
  // useEffect(() => {
  //   initTheme();
  // }, []);
  const { theme } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        animation: "shift",
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: theme.navigation.drawerBackground,
          height: 75,
        },
      }}
    >
      <Tabs.Screen name="notification" />
      <Tabs.Screen name="HelperComplaint" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
};

export default TabLayout;
