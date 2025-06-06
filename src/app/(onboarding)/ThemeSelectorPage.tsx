import { StyleSheet, View, Pressable, Text } from "react-native";
import React, { useState, useEffect } from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  Easing,
} from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import { mmkvStorage } from "@/store/storage";
import i18n from "@/lib/i18n";
import { LANGUAGE_KEY } from "@/lib/i18n";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";
import { D } from "@/utils/dimensions";
import { Colors, DarkColors, getTheme, useAppTheme } from "@/theme/useAppTheme";
type ThemePreference = "light" | "dark" | "system";

type ThemeSelectorPageProps = {
  index: number;
  x: Animated.SharedValue<number>;
};

const themeData: { code: ThemePreference; name: string }[] = [
  { code: "light", name: "light" },
  { code: "dark", name: "dark" },
  { code: "system", name: "system" },
];

const ThemeSelectorPage = ({ index, x }: ThemeSelectorPageProps) => {
  const { theme, setTheme } = useAppTheme();

  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const { t } = useTranslation();
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const opacity = useSharedValue(1);
  const [slelectedTheme, setSelectedTheme] = useState("");

  const handleThemeChange = async (ThemeCode: ThemePreference) => {
    setSelectedTheme(ThemeCode);
    await setTheme(ThemeCode);
  };

  // Animation for the whole page (same as before)
  const rnContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [100, 0, 100],
      Extrapolate.CLAMP,
    );
    const pageOpacity = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0, 1, 0],
      Extrapolate.CLAMP,
    );
    return {
      opacity: pageOpacity,
      transform: [{ translateY }],
    };
  }, [index, x]);

  return (
    <Animated.View
      style={[
        styles(theme).container,
        { width: SCREEN_WIDTH },
        rnContainerStyle,
      ]}
    >
      <View style={styles(theme).contentContainer}>
        <LottieView
          autoPlay
          style={{
            width: D.wp(30),
            height: D.wp(30),
            marginTop: -D.hp(12),
          }}
          source={require("@/assets/lottieAnimation/themeAnimation.json")}
          colorFilters={[
            { keypath: "Shape Layer 1", color: theme.rang.themeAnimation },
            { keypath: "Sol 2", color: theme.rang.themeAnimation },
            { keypath: "Luna", color: theme.rang.themeAnimation },
            { keypath: "Sol", color: theme.rang.themeAnimation },
          ]}
        />
        <Text style={styles(theme).title}>{t("select_theme")}</Text>
        <View style={styles(theme).themeOptions}>
          {themeData.map((itme) => (
            <Pressable
              key={itme.code}
              style={[
                styles(theme).languageButton,
                slelectedTheme === itme.code &&
                  styles(theme).selectedLanguageButton,
              ]}
              onPress={() => handleThemeChange(itme.code)}
            >
              <Text
                style={[
                  styles(theme).languageText,
                  slelectedTheme === itme.code &&
                    styles(theme).selectedLanguageText,
                ]}
              >
                {itme.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

export default ThemeSelectorPage;

const styles = (theme: typeof Colors | typeof DarkColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    contentContainer: {
      width: "100%",
      maxWidth: 400,
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "600",
      marginBottom: 40,
      textAlign: "center",
      color: getTheme().text.primary,
    },

    themeOptions: {
      width: "100%",
    },
    languageButton: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      backgroundColor: "#fff",
    },
    selectedLanguageButton: {
      borderColor: "#FEAC30",
      backgroundColor: getTheme().rang.themeButton,
    },
    languageText: {
      fontSize: 18,
      textAlign: "center",
    },
    selectedLanguageText: {
      color: "#fff",
      fontWeight: "600",
    },
  });
