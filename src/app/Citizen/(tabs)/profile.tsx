import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { Fragment, useState } from "react";
import { commonStyle } from "@/styles/commonStyles";
import { useAppTheme } from "@/theme/useAppTheme";
import { useUserStore } from "@/store/userStore";
import { D } from "@/utils/dimensions";
import { fonts } from "@/theme/fonts";
import { RFValue } from "react-native-responsive-fontsize";
import CButton from "@/components/interactiveComponents/CButton";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { logOut } from "@/service/authService";
import { TouchableOpacity } from "react-native-gesture-handler";
import Dropdown from "@/components/interactiveComponents/DropDown";
import { useTranslation } from "react-i18next";
import i18n, { LANGUAGE_KEY } from "@/lib/i18n";
import { mmkvStorage } from "@/store/storage";
type ThemePreference = "light" | "dark" | "system";

const themeData: { value: ThemePreference; label: string }[] = [
  { label: "light", value: "light" },
  { label: "dark", value: "dark" },
  { label: "system", value: "system" },
];
const THEME_KEY = "app_theme_preference";

const profile = () => {
  const { theme, setTheme } = useAppTheme();
  const { user } = useUserStore();
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const selectedTheme =
    (mmkvStorage.getItem(THEME_KEY) as ThemePreference) || "system";

  const parsedUser = typeof user === "string" ? JSON.parse(user) : user;

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    i18n.changeLanguage(langCode).then(() => {
      mmkvStorage.setItem(LANGUAGE_KEY, langCode);
    });
  };
  const handleThemeChange = async (ThemeCode: ThemePreference) => {
    console.log(ThemeCode);
    await setTheme(ThemeCode);
  };
  return (
    <Fragment>
      <StatusBar
        backgroundColor={commonStyle.statusbar.backgroundColor}
        barStyle={theme.statusbar.barStyle}
      />
      <SafeAreaView />
      <ScrollView style={{ backgroundColor: theme.rang.background }}>
        <View>
          <View
            style={{
              alignItems: "center",
              marginTop: D.spacing.xxlarge,
              marginBottom: D.spacing.medium,
            }}
          >
            <Image
              source={{
                uri: `http://192.168.0.119:3000/uploads/profileImages/${parsedUser.profileImage.name}`,
              }}
              style={{
                height: 100,
                width: 100,
                borderRadius: D.radius.round,
              }}
            />
          </View>
          <Text
            style={{
              textAlign: "center",
              fontFamily: fonts.medium,
              fontSize: RFValue(18),
              color: theme.text.primary,
            }}
          >
            {parsedUser.name}
            {`\n`}
            <Text
              style={{
                textAlign: "center",
                fontFamily: fonts.light,
                fontSize: RFValue(10),
              }}
            >
              {parsedUser.phone}
            </Text>
          </Text>
          <CButton
            title="Edit Profile"
            onPress={() => {}}
            style={{
              marginHorizontal: D.wp(35),
              borderRadius: D.radius.round,
              backgroundColor: theme.rang.blackWhite,
              marginTop: D.spacing.medium,
            }}
            textColor={theme.text.inverted}
            textSize={RFValue(10)}
          />
        </View>
        <View style={{ marginTop: D.spacing.large }}>
          <Text
            style={{
              color: theme.text.secondary,
              left: D.spacing.large,
              margin: D.spacing.medium,
            }}
          >
            {t("profileSupport")}
          </Text>
          <View
            style={{
              borderWidth: 2,
              borderColor: theme.rang.boxBorder,
              borderRadius: D.radius.xxlarge,
              marginHorizontal: D.spacing.small,
              paddingHorizontal: D.spacing.medium,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: D.spacing.medium,
                borderColor: theme.rang.boxBorder,

                borderBottomWidth: 1,
              }}
            >
              <Ionicons
                size={20}
                name="person-circle-sharp"
                style={{
                  backgroundColor: theme.rang.ocean,
                  padding: 5,
                  borderRadius: D.radius.medium,
                  elevation: 5,
                }}
                color={theme.text.inverted}
              />
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                }}
              >
                <Text style={{ color: theme.text.primary }}>
                  {t("my_profile")}
                </Text>
              </View>
              <Ionicons
                size={20}
                name="chevron-forward-outline"
                style={{
                  backgroundColor: theme.rang.ocean,
                  padding: 5,
                  borderRadius: D.radius.medium,
                  elevation: 5,
                }}
                color={theme.text.inverted}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: D.spacing.medium,
              }}
            >
              <FontAwesome
                size={20}
                name="support"
                style={{
                  backgroundColor: theme.rang.ocean,
                  padding: 5,
                  borderRadius: D.radius.medium,
                  elevation: 5,
                }}
                color={theme.text.inverted}
              />
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                }}
              >
                <Text style={{ color: theme.text.primary }}>
                  {t("support")}
                </Text>
              </View>
              <Ionicons
                size={20}
                name="chevron-forward-outline"
                style={{
                  backgroundColor: theme.rang.ocean,
                  padding: 5,
                  borderRadius: D.radius.medium,
                  elevation: 5,
                }}
                color={theme.text.inverted}
              />
            </View>
            <View></View>
          </View>
          <Text
            style={{
              color: theme.text.secondary,
              left: D.spacing.large,
              margin: D.spacing.medium,
            }}
          >
            {t("preferences")}
          </Text>

          <View
            style={{
              borderWidth: 2,
              borderColor: theme.rang.boxBorder,
              borderRadius: D.radius.xxlarge,
              marginHorizontal: D.spacing.small,
              paddingHorizontal: D.spacing.medium,
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: D.spacing.medium,
                  borderColor: theme.rang.boxBorder,

                  borderBottomWidth: 1,
                }}
              >
                <View
                  style={{
                    backgroundColor: theme.rang.ocean,
                    padding: 5,
                    borderRadius: D.radius.medium,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={require("@/assets/images/vector/darkLang.png")}
                    style={{
                      width: 21,
                      height: 21,
                      tintColor: theme.text.inverted,
                    }}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 10,
                  }}
                >
                  <Text style={{ color: theme.text.primary }}>{t("lang")}</Text>
                </View>
                {/* <Ionicons
                  size={20}
                  name="chevron-forward-outline"
                  style={{
                    backgroundColor: theme.rang.ocean,
                    padding: 5,
                    borderRadius: D.radius.medium,
                    elevation: 5,
                  }}
                  color={theme.text.inverted}
                /> */}
                <Dropdown
                  data={[
                    { label: "English", value: "en" },
                    { label: "मराठी", value: "mr" },
                    { label: "हिंदी", value: "hi" },
                  ]}
                  onChange={(val) => handleLanguageChange(val.value)}
                  placeholder={
                    selectedLang === "en"
                      ? "English"
                      : selectedLang === "mr"
                        ? "मराठी"
                        : selectedLang === "hi"
                          ? "हिंदी"
                          : ""
                  }
                  styleBox={{ width: D.wp(35) }}
                  styleDropdown={{
                    width: D.wp(35),
                    right: D.wp(8),
                    marginTop: 2,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: D.spacing.medium,
              }}
            >
              <Ionicons
                size={20}
                name="color-palette"
                style={{
                  backgroundColor: theme.rang.ocean,
                  padding: 5,
                  borderRadius: D.radius.medium,
                  elevation: 5,
                }}
                color={theme.text.inverted}
              />
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                }}
              >
                <Text style={{ color: theme.text.primary }}>{t("theme")} </Text>
              </View>
              <Dropdown
                data={themeData}
                onChange={(val: any) => handleThemeChange(val.value)}
                placeholder={t(selectedTheme)}
                styleBox={{ width: D.wp(35) }}
                styleDropdown={{
                  width: D.wp(35),
                  right: D.wp(8),
                  marginTop: 2,
                }}
              />
            </View>

            <View></View>
          </View>

          <Text
            style={{
              color: theme.text.secondary,
              left: D.spacing.large,
              margin: D.spacing.medium,
            }}
          >
            {t("account_control")}
          </Text>

          <View
            style={{
              borderWidth: 2,
              borderColor: theme.rang.boxBorder,

              borderRadius: D.radius.xxlarge,
              marginHorizontal: D.spacing.small,
              paddingHorizontal: D.spacing.medium,
              marginBottom: D.spacing.xlarge,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: D.spacing.medium,
                borderColor: theme.rang.boxBorder,

                borderBottomWidth: 1,
              }}
            >
              <Ionicons
                size={20}
                name="cog-outline"
                style={{
                  backgroundColor: theme.rang.ocean,
                  padding: 5,
                  borderRadius: D.radius.medium,
                  elevation: 5,
                }}
                color={theme.text.inverted}
              />
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                }}
              >
                <Text style={{ color: theme.text.primary }}>
                  {t("manage_my_account")}
                </Text>
              </View>
              <Ionicons
                size={20}
                name="chevron-forward-outline"
                style={{
                  backgroundColor: theme.rang.ocean,
                  padding: 5,
                  borderRadius: D.radius.medium,
                  elevation: 5,
                }}
                color={theme.text.inverted}
              />
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: D.spacing.medium,
                borderRadius: D.radius.medium,
              }}
              activeOpacity={0.6}
              onPress={() => logOut()}
            >
              <MaterialIcons
                size={20}
                name="logout"
                style={{
                  backgroundColor: theme.rang.ocean,
                  padding: 5,
                  borderRadius: D.radius.medium,
                  elevation: 5,
                }}
                color={theme.text.inverted}
              />
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                }}
              >
                <Text style={{ color: theme.text.primary }}>{t("logout")}</Text>
              </View>
            </TouchableOpacity>
            <View></View>
          </View>
        </View>
      </ScrollView>
    </Fragment>
  );
};

export default profile;

const styles = StyleSheet.create({});
