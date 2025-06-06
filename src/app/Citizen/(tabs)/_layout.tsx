import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getTheme, useAppTheme } from "@/theme/useAppTheme";
import { D } from "@/utils/dimensions";

const TabLayout = () => {
  const { theme } = useAppTheme();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
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
      <Tabs.Screen
        name="notification"
        options={{
          tabBarLabelStyle: { top: 1 },
          tabBarButton: (props) => (
            <View
              style={{
                flex: 1,
                overflow: "hidden", // this is important to clip ripple
                borderRadius: 25,
                margin: 8, // keep square shape (or set to 10 for rounded square)
              }}
            >
              <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(
                  "rgba(43, 153, 197, 0.5)",
                  false // false = bounded ripple
                )}
                useForeground
                onPress={props.onPress}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    size={30}
                    name="notifications"
                    color={
                      props.accessibilityState?.selected
                        ? theme.navigation.tabActive
                        : theme.navigation.tabInactive
                    }
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      marginTop: 2,
                      color: props.accessibilityState?.selected
                        ? theme.navigation.tabActive
                        : theme.navigation.headerText,
                    }}
                  >
                    Notification
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="createComplaint"
        options={{
          title: "",
          tabBarButton: (props) =>
            keyboardVisible ? null : (
              <View
                style={{
                  position: "absolute",
                  top: -30,
                  left: 0,
                  right: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                }}
              >
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple(
                    "rgba(43 153 197 / 0.73)",
                    false,
                    30
                  )}
                  useForeground={true}
                  onPress={props.onPress}
                >
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: D.radius.round,
                      backgroundColor: theme.navigation.drawerBackground,
                      justifyContent: "center",
                      alignItems: "center",
                      shadowColor: "#000",
                      elevation: 15,
                    }}
                  >
                    <View
                      style={{
                        borderRadius: 30,
                        backgroundColor: props.accessibilityState?.selected
                          ? theme.navigation.tabActive
                          : theme.navigation.tabInactive,
                        width: 60,
                        height: 60,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name={
                          props.accessibilityState?.selected ? "add" : "add"
                        }
                        size={50}
                        color={
                          props.accessibilityState?.selected ? "white" : "gray"
                        }
                      />
                    </View>
                  </View>
                </TouchableNativeFeedback>
              </View>
            ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabelStyle: { top: 1 },
          tabBarButton: (props) => (
            <View
              style={{
                flex: 1,
                overflow: "hidden", // this is important to clip ripple
                borderRadius: 25,
                margin: 8, // keep square shape (or set to 10 for rounded square)
              }}
            >
              <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(
                  "rgba(43, 153, 197, 0.5)",
                  false // false = bounded ripple
                )}
                useForeground
                onPress={props.onPress}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    size={30}
                    name="person"
                    color={
                      props.accessibilityState?.selected
                        ? theme.navigation.tabActive
                        : theme.navigation.tabInactive
                    }
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      marginTop: 2,
                      color: props.accessibilityState?.selected
                        ? theme.navigation.tabActive
                        : theme.navigation.headerText,
                    }}
                  >
                    Profile
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
