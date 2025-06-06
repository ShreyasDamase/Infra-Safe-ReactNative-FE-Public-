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

type LanguageSelectorPageProps = {
  index: number;
  x: Animated.SharedValue<number>;
};

const languages = [
  { code: "en", name: "English" },
  { code: "mr", name: "मराठी" },
  { code: "hi", name: "हिंदी" },
];

const languageSubtitles = [
  "Choose your preferred language",
  "अपनी पसंदीदा भाषा चुनें",
  "आपली आवडती भाषा निवडा",
];

const LanguageSelectorPage = ({ index, x }: LanguageSelectorPageProps) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const { theme, setTheme } = useAppTheme();

  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const { t } = useTranslation();
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const opacity = useSharedValue(1);

  // Animation for the subtitle text
  const subtitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      opacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.ease,
      });

      // Change text and fade in
      setTimeout(() => {
        setCurrentSubtitleIndex(
          (prev) => (prev + 1) % languageSubtitles.length,
        );
        opacity.value = withTiming(1, {
          duration: 300,
          easing: Easing.ease,
        });
      }, 300);
    }, 2000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    i18n.changeLanguage(langCode).then(() => {
      mmkvStorage.setItem(LANGUAGE_KEY, langCode);
    });
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
            width: D.wp(20),
            height: D.wp(20),
            marginBottom: 10,
          }}
          source={require("@/assets/lottieAnimation/language.json")}
          colorFilters={[
            {
              keypath: "Layer 4 Outlines",
              color: theme.rang.themeAnimation,
            },
            {
              keypath: "Layer 3 Outlines",
              color: theme.rang.themeAnimation,
            },
            { keypath: "Layer 5 Outlines", color: theme.rang.themeAnimation },
          ]}
        />
        <Text style={styles(theme).title}>Select language</Text>
        <View style={styles(theme).languageOptions}>
          {languages.map((language) => (
            <Pressable
              key={language.code}
              style={[
                styles(theme).languageButton,
                selectedLang === language.code &&
                  styles(theme).selectedLanguageButton,
              ]}
              onPress={() => handleLanguageChange(language.code)}
            >
              <Text
                style={[
                  styles(theme).languageText,
                  selectedLang === language.code &&
                    styles(theme).selectedLanguageText,
                ]}
              >
                {language.name}
              </Text>
            </Pressable>
          ))}
        </View>
        <Animated.Text style={[styles(theme).subtitle, subtitleAnimatedStyle]}>
          {languageSubtitles[currentSubtitleIndex]}
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

export default LanguageSelectorPage;

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
    subtitle: {
      fontSize: 16,
      marginTop: 20,
      color: getTheme().text.secondary,
      textAlign: "center",
      height: 50, // Fixed height to prevent layout shift
    },
    languageOptions: {
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
      backgroundColor: "#FEAC30",
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
