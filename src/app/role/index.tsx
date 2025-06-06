import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { commonStyle } from "@/styles/commonStyles";
import { getTheme, useAppTheme } from "@/theme/useAppTheme";
import { D } from "@/utils/dimensions";
import { fonts, FontSizes } from "@/theme/fonts";
import { resetAndNavigate } from "@/utils/Helpers";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const index = () => {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <StatusBar
        backgroundColor={commonStyle.statusbar.backgroundColor}
        barStyle={theme.statusbar.barStyle}
      />
      <SafeAreaView />
      <ScrollView style={{ backgroundColor: getTheme().background }}>
        <View style={{ backgroundColor: getTheme().background }}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>
              {t("select_your_role")}
              {"\n"}
              <Text style={styles.subheading}>{t("part_of_solution")}</Text>
            </Text>
          </View>
        </View>
        <View
          style={[
            commonStyle.container,
            {
              alignItems: "center",
              flexDirection: "column-reverse",
              justifyContent: "space-around",
              paddingVertical: D.wp(10),
              backgroundColor: getTheme().background,
            },
          ]}
        >
          <TouchableOpacity onPress={() => router.push("/Citizen/auth")}>
            <View style={styles.roleContainer}>
              <Image
                source={require("@/assets/images/role/citizen.jpg")}
                style={styles.image}
              />
              <Text style={styles.roleHeading}>
                {t("i_am_citizen")}
                {"\n"}
                <Text style={styles.roleSubheading}>
                  {t("report_and_track")}
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/Helper/auth")}>
            <View style={styles.roleContainer}>
              <Image
                source={require("@/assets/images/role/worker.jpeg")}
                style={styles.image}
              />
              <Text style={styles.roleHeading}>
                {t("im_worker")}
                {"\n"}
                <Text style={styles.roleSubheading}>
                  {t("view_tasks_update_status")}{" "}
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </React.Fragment>
  );
};

export default index;

const styles = StyleSheet.create({
  roleContainer: {
    backgroundColor: getTheme().secondary,
    width: D.wp(90),
    height: D.wp(55),
    borderRadius: D.radius.medium,
    marginVertical: D.spacing.medium,
    padding: D.spacing.tiny,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: D.wp(85),
    height: D.wp(50),
    resizeMode: "cover",
    borderRadius: D.radius.medium,
  },
  headingContainer: {
    marginVertical: D.spacing.large,
    backgroundColor: getTheme().surface,
    padding: D.spacing.medium,
    borderLeftWidth: D.wp(1),
    borderLeftColor: getTheme().statusbar.backgroundColor,
    marginLeft: D.wp(1),
  },
  heading: {
    // fontSize: 24,
    fontSize: FontSizes.title,
    marginBottom: D.spacing.micro,
    color: getTheme().text.primary,

    fontFamily: fonts.medium,
  },
  subheading: {
    fontSize: FontSizes.caption,
    color: getTheme().text.secondary,
    fontFamily: fonts.MediumItalic,
  },
  roleHeading: {
    position: "absolute",
    bottom: D.spacing.small,
    left: D.spacing.medium,
    fontSize: FontSizes.cardTitle,
    color: getTheme().text.onDark,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: D.spacing.small,
    paddingVertical: D.spacing.micro,
    borderRadius: D.radius.medium,
    marginBottom: D.spacing.micro,
    fontFamily: fonts.SemiBold,
  },
  roleSubheading: { fontSize: FontSizes.paragraph, fontFamily: fonts.regular },
});
