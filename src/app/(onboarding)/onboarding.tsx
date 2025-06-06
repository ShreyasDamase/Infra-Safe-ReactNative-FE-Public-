// app/onboarding.tsx
import { useCallback, useRef, useState } from "react";
import {
  ImageURISource,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  ViewToken,
  Text,
} from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Link, router } from "expo-router";
import ListItem from "@/components/onboard/ListItem";
import PaginationElement from "@/components/onboard/PaginationElement";
import Button from "@/components/onboard/Button";
import { mmkvStorage } from "@/store/storage";
import LanguageSelectorPage from "./LanguageSelectorPage";
import { useTranslation } from "react-i18next";
import ThemeSelectorPage from "./ThemeSelectorPage";
import { Colors, DarkColors, getTheme, useAppTheme } from "@/theme/useAppTheme";
type OnboardingPage = { type?: string; text: string; image: ImageURISource };

const pages: OnboardingPage[] = [
  {
    type: "language",
    text: "first_page",
    image: require("../../assets/images/role/1.png"),
  },
  {
    type: "theme",
    text: "second_page",
    image: require("../../assets/images/role/1.png"),
  },
  {
    text: "report_issues",
    image: require("../../assets/images/role/1.png"),
  },
  {
    text: "submit_complaints",
    image: require("../../assets/images/role/2.png"),
  },
  {
    text: "prompt_assistance",
    image: require("../../assets/images/role/3.png"),
  },
  {
    text: "timely_resolution",
    image: require("../../assets/images/role/4.png"),
  },
];

export default function OnboardingScreen() {
  const { theme, setTheme } = useAppTheme();

  console.log("Inside onboarding screen");
  const x = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListIndex = useSharedValue(0);
  const flatListRef = useAnimatedRef<Animated.FlatList<OnboardingPage>>();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const index = viewableItems[0]?.index ?? 0;
      flatListIndex.value = index;
      setCurrentIndex(index); // ✅ triggers render
    },
    [],
  );

  const scrollHandle = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const renderItem = useCallback(
    ({ item, index }: { item: OnboardingPage; index: number }) => {
      if (item?.type === "language") {
        return <LanguageSelectorPage index={index} x={x} />;
      }
      if (item?.type === "theme") {
        return <ThemeSelectorPage index={index} x={x} />;
      }

      return <ListItem item={item} index={index} x={x} />;
    },
    [x],
  );
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles(theme).container}>
      <Animated.FlatList
        ref={flatListRef}
        onScroll={scrollHandle}
        horizontal
        scrollEventThrottle={16}
        pagingEnabled={true}
        data={pages}
        keyExtractor={(_, index) => index.toString()}
        bounces={false}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      <View style={styles(theme).bottomContainer}>
        <PaginationElement length={pages.length} x={x} />
        {currentIndex === pages.length - 1 ? (
          <Pressable
            style={styles(theme).getStartedButton}
            onPress={() => {
              console.log("PRESSED - Attempting navigation");
              mmkvStorage.setItem("@viewedOnboarding", "true");

              router.replace("/role/login");
              console.log("Navigation called");
            }}
          >
            <Text style={styles(theme).getStartedText}>{t("get_started")}</Text>
          </Pressable>
        ) : (
          <Button
            currentIndex={flatListIndex}
            length={pages.length}
            flatListRef={flatListRef}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = (theme: typeof Colors | typeof DarkColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: getTheme().background,
    },
    bottomContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 40,
    },
    getStartedButton: {
      backgroundColor: "#FEAC30",
      paddingHorizontal: 12,
      marginHorizontal: 5,
      left: 2,
      paddingVertical: 16,
      borderRadius: 100,
    },
    getStartedText: {
      color: "white",
      fontWeight: "600",
      fontSize: 16,
    },
  });
