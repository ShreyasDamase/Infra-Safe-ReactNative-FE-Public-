import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  Button,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginMiniSchema, LoginMini } from "@/types/LoginMini";
import Dropdown from "@/components/interactiveComponents/DropDown";
import CButton from "@/components/interactiveComponents/CButton";
import OtpScreenModal from "../common/signUp";
import { Link, router } from "expo-router";
import { Colors, DarkColors, getTheme, useAppTheme } from "@/theme/useAppTheme";
import { commonStyle } from "@/styles/commonStyles";
import { fonts, FontSizes } from "@/theme/fonts";
import { D } from "@/utils/dimensions";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg"; // Import react-native-svg
import { mmkvStorage } from "@/store/storage";
import i18n from "@/lib/i18n";
import { LANGUAGE_KEY } from "@/lib/i18n";
import { useTranslation } from "react-i18next";

const LoginMiniForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginMini>({
    resolver: zodResolver(loginMiniSchema),
  });

  const { theme, setTheme } = useAppTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<LoginMini | null>(null);
  const [selectedLang, setSelectedLang] = useState("en");
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const { t } = useTranslation();

  const onSubmit = async (data: LoginMini) => {
    console.log("called");
    console.log("Form Data:", data);
    setFormData(data);
    setModalVisible(true);
  };

  const toggleLightTheme = async () => await setTheme("light");
  const toggleDarkTheme = async () => await setTheme("dark");
  const handleContinue = () => {
    i18n.changeLanguage(selectedLang).then(() => {
      setCurrentLang(selectedLang); // Force re-render
      mmkvStorage.setItem(LANGUAGE_KEY, selectedLang);
    });
  };

  return (
    <>
      <StatusBar
        barStyle={theme.statusbar.barStyle}
        backgroundColor={theme.statusbar.backgroundColor}
      />
      <SafeAreaView style={[styles(theme).container]}>
        <ScrollView>
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("@/assets/images/login.png")}
              style={{ width: D.wp(100), height: D.wp(92) }}
            />
          </View>

          <View
            style={{
              marginHorizontal: 8,
              backgroundColor: "rgb(241 224 204)0 0 0)6D3",
              marginTop: D.wp(-20),
              borderRadius: D.radius.medium,
              height: D.wp(100),
              elevation: 10,
            }}
          >
            <Svg
              height={D.wp(100)} // Adjust the height to a larger value (e.g., 120% of screen width)
              width={D.wp(100)}
              viewBox="10 -350 800 915" // You may need to adjust the viewBox size
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              <Defs>
                <LinearGradient id="topGradient" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#FFFFFF" />
                  <Stop offset="100%" stopColor="#F5782A" />
                </LinearGradient>
              </Defs>
              <Path
                d="M 833.144 152.288 C 822.071 141.786 776.808 124.865 660.535 254.744 C 483.09 452.957 141.803 411.714 -154.56 345.22 L -154.56 211.356 C -146.8 210.844 -102.58 204.316 95.992 273.22 C 425.984 387.73 602.368 244.447 833.144 161.414 L 833.144 152.288 Z"
                fill="url(#topGradient)"
              />
            </Svg>
            <View style={styles(theme).inputGroup}>
              <Text style={[styles(theme).inputHeading]}>
                {t("mobile_number")}
              </Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    keyboardType="numeric"
                    placeholder={t("Enter_mobile_number")}
                    value={value}
                    onChangeText={onChange}
                    style={{
                      borderColor: "#fff",
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: 8,
                      color: "#1E293B",
                    }}
                    maxLength={10}
                  />
                )}
              />
              {errors.phone && (
                <Text style={{ color: theme.feedback.warning.text }}>
                  {t(`${errors.phone.message}`)}
                </Text>
              )}
            </View>

            <View style={styles(theme).inputGroup}>
              <Text style={styles(theme).inputHeading}>{t("role")}</Text>
              <Controller
                control={control}
                name="role"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    data={[
                      { label: "Citizen", value: "citizen" },
                      { label: "Helper", value: "helper" },
                    ]}
                    onChange={(val) => onChange(val.value)}
                    placeholder={t("select_role")}
                  />
                )}
              />
              {errors.role && (
                <Text style={{ color: theme.feedback.warning.text }}>
                  {t(`${errors.role.message}`)}
                </Text>
              )}
            </View>

            <View
              style={{
                flexDirection: "column",

                justifyContent: "space-around",
              }}
            >
              <CButton
                title={t("continue")}
                onPress={handleSubmit(onSubmit)}
                variant="outline"
                style={{
                  marginHorizontal: D.wp(4),
                  marginTop: D.wp(5),
                  borderColor: "#fff",
                }}
              />

              <CButton
                variant="outline"
                title={t("signup")}
                style={{
                  marginHorizontal: D.wp(4),
                  marginTop: D.wp(5),
                  borderColor: "#fff",
                }}
                onPress={() => router.push("/role")}
              />
            </View>
          </View>

          {modalVisible && formData && (
            <OtpScreenModal
              data={formData}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
            />
          )}

          {/* <View
            style={[
              {
                backgroundColor: theme.background,
                marginTop: D.wp(5),
                padding: D.wp(5),
              },
            ]}
          >
            <Text style={[styles(theme).text, { color: theme.text.primary }]}>
              Theme Selector
            </Text>

            <View style={styles(theme).buttonRow}>
              <TouchableOpacity
                style={[
                  styles(theme).themeButton,
                  {
                    backgroundColor: theme.buttons.primary.background,
                    marginRight: 10,
                  },
                ]}
                onPress={toggleLightTheme}
              >
                <Text
                  style={[
                    styles(theme).buttonText,
                    { color: theme.buttons.primary.text },
                  ]}
                >
                  Light Theme
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles(theme).themeButton,
                  {
                    backgroundColor: theme.buttons.secondary.background,
                  },
                ]}
                onPress={toggleDarkTheme}
              >
                <Text
                  style={[
                    styles(theme).buttonText,
                    { color: theme.buttons.secondary.text },
                  ]}
                >
                  Dark Theme
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles(theme).themeButton,
                  {
                    backgroundColor: theme.buttons.secondary.background,
                  },
                ]}
                onPress={() => setTheme("system")}
              >
                <Text
                  style={[
                    styles(theme).buttonText,
                    { color: theme.buttons.secondary.text },
                  ]}
                >
                  System Theme
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text>here{t("welcome")}</Text>

          <Button title="English" onPress={() => setSelectedLang("en")} />
          <Button title="मराठी" onPress={() => setSelectedLang("mr")} />
          <Button title="हिंदी" onPress={() => setSelectedLang("hi")} />
          <Button title="Continue" onPress={handleContinue} /> */}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default LoginMiniForm;
const styles = (theme: typeof Colors | typeof DarkColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: getTheme().background,
      flex: 1,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
      letterSpacing: 1,
    },
    buttonRow: {
      flexDirection: "column",
      gap: D.wp(5),
      padding: D.wp(2),
      marginTop: D.wp(5),
    },
    themeButton: {
      padding: 15,
      borderRadius: 8,
      minWidth: 120,
      alignItems: "center",
      justifyContent: "center",
    },

    text: {
      fontSize: 16,
      marginBottom: 20,
    },
    inputGroup: {
      padding: D.spacing.medium,
    },
    inputHeading: {
      fontFamily: fonts.medium,
      fontSize: FontSizes.inputTitle,
      color: getTheme().text.tertiary,
    },

    input: {
      borderColor: "#ccc",
      borderWidth: 1,
      padding: D.spacing.tiny,
      borderRadius: D.radius.small,
      marginTop: D.spacing.tiny,
      fontSize: FontSizes.input,
      fontFamily: fonts.regular,
    },
  });
