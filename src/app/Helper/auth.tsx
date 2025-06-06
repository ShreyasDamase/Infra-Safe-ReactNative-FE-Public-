import React, { useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Colors, DarkColors, getTheme, useAppTheme } from "@/theme/useAppTheme";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  helperRegistrationSchema,
  Helper,
  DocumentPickerResult,
} from "@/types/Helper";
import * as DocumentPicker from "expo-document-picker";
import Dropdown from "@/components/interactiveComponents/DropDown";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  countries,
  departmentPosts,
  departments,
  states,
} from "@/constants/contries";
import { fonts, FontSizes } from "@/theme/fonts";
import CButton from "@/components/interactiveComponents/CButton";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { D } from "@/utils/dimensions";
import { RFValue } from "react-native-responsive-fontsize";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import * as Crypto from "expo-crypto";
import OtpScreenModal from "../common/signUp";
import { useTranslation } from "react-i18next";

const Auth: React.FC = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Helper>({
    resolver: zodResolver(helperRegistrationSchema),
    defaultValues: {
      role: "helper",
      documents: [],
      dob: new Date().toISOString(),
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<Helper | undefined>();
  const { theme, setTheme } = useAppTheme();

  console.log("inside worker");

  const profileImage = watch("profileImage");
  const documents = watch("documents");
  const dob = watch("dob");
  const { t } = useTranslation();
  const generateUniqueId = async () => {
    const randomBytes = await Crypto.getRandomBytesAsync(16);
    return [...randomBytes]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };
  const pickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const allowedExtensions = ["jpg", "jpeg", "png"];

        const originalExtension =
          asset.fileName?.split(".").pop()?.toLowerCase() || "jpg";

        if (!allowedExtensions.includes(originalExtension)) {
          Alert.alert(
            "Invalid File",
            "Only JPG, JPEG, or PNG images are allowed.",
          );
          return;
        }

        // Read the image file and convert it to Base64 (optional)
        const base64Image = await FileSystem.readAsStringAsync(asset.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Create the image object with Base64 string
        const profileImage = {
          uri: asset.uri,
          base64: base64Image,
          name: `${await generateUniqueId()}.${originalExtension}`,
          mimeType: asset.mimeType || "image/jpeg",
          size: asset.fileSize || undefined,
        };

        // setProfileImage(image); // Update the state with the profile image
        setValue("profileImage", profileImage, { shouldValidate: true });
      }
    } catch (error) {
      console.error("Image picker error:", error);
    }
  };

  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: ["application/pdf", "image/*"],
      });

      if (!result.canceled) {
        const doc = result.assets?.[0];

        const base64Image = await FileSystem.readAsStringAsync(doc.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Create
        if (doc?.mimeType !== "application/pdf") {
          Alert.alert(
            "Invalid File",
            "Only PDF and image (jpg, png, webp) files are allowed.",
          );
          return;
        }
        const uniqueFileName = `${await generateUniqueId()}.pdf`;
        if (doc) {
          const document = {
            uri: doc?.uri ?? "",
            name: uniqueFileName,
            base64: base64Image || "",
            mimeType: "application/pdf",
            size: doc?.size ?? 0,
            lastModified: doc?.lastModified ?? Date.now(),
          };
          //   console.log(document);
          setValue("documents", [...(documents ?? []), document], {
            shouldValidate: true,
          });
        }
      }
    } catch (error) {
      console.error("Document picker error:", error);
    }
  };

  const removeDocument = (index: number) => {
    const updatedDocs = [...documents];
    updatedDocs.splice(index, 1);
    setValue("documents", updatedDocs);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setValue("dob", selectedDate.toISOString());
    }
  };

  const onSubmit = async (data: Helper) => {
    console.log("called");
    console.log("Form Data:", data);
    setFormData(data);
    setModalVisible(true);
  };

  return (
    <>
      <SafeAreaView />
      <StatusBar
        barStyle={getTheme().statusbar.barStyle}
        backgroundColor={getTheme().statusbar.backgroundColor}
      />
      <ScrollView style={styles(theme).container}>
        {/* Profile Image */}
        <View style={styles(theme).inputGroup}>
          {profileImage ? (
            <View style={styles(theme).previewContainer}>
              <Image
                source={{ uri: profileImage.uri }}
                style={styles(theme).imagePreview}
              />

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: getTheme().buttons.primary.background,
                  borderRadius: D.radius.small,
                  padding: D.spacing.micro,
                  gap: D.spacing.micro,
                  justifyContent: "space-around",
                  marginTop: D.spacing.micro,
                  marginBottom: D.spacing.medium,
                }}
                onPress={() => setValue("profileImage", undefined)}
              >
                <MaterialCommunityIcons
                  name="pencil-remove-outline"
                  size={20}
                  color="white"
                />
                <Text style={{ color: getTheme().text.inverted }}>
                  {t("remove_image")}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={pickProfileImage}>
              <View style={styles(theme).previewContainer}>
                <Image
                  source={require("@/assets/images/role/workerProfile.png")}
                  style={styles(theme).imagePreview}
                />
              </View>
            </TouchableOpacity>
          )}
          <CButton
            title={t("select_profile_image")}
            onPress={pickProfileImage}
            variant="outline"
          />
        </View>
        {/* Basic Information */}
        <View style={styles(theme).inputGroup}>
          <Text style={styles(theme).inputHeading}>{t("full_name_label")}</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles(theme).input}
                placeholder={t("full_name_placeholder")}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor={theme.rang.ocean}
              />
            )}
            name="name"
          />
          {errors.name && (
            <Text style={styles(theme).error}>
              {t(`${errors.name.message}`)}
            </Text>
          )}
        </View>
        <View style={styles(theme).inputGroup}>
          <Text style={styles(theme).inputHeading}>{t("gender_label")}</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles(theme).radioGroup}>
                <TouchableOpacity
                  style={[
                    styles(theme).radioButton,
                    value === "male" && styles(theme).radioButtonSelected,
                  ]}
                  onPress={() => onChange("male")}
                >
                  <Text
                    style={{
                      fontSize: FontSizes.tabLabel,
                      color: theme.rang.ocean,
                    }}
                  >
                    {t("gender_male")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles(theme).radioButton,
                    value === "female" && styles(theme).radioButtonSelected,
                  ]}
                  onPress={() => onChange("female")}
                >
                  <Text
                    style={{
                      fontSize: FontSizes.tabLabel,
                      color: theme.rang.ocean,
                    }}
                  >
                    {t("gender_female")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            name="gender"
          />
          {errors.gender && (
            <Text style={styles(theme).error}>
              {t(`${errors.gender.message}`)}
            </Text>
          )}
        </View>
        <View style={styles(theme).inputGroup}>
          <Text style={styles(theme).inputHeading}>{t("dob_label")}</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles(theme).input}
          >
            <Text
              style={{
                fontSize: FontSizes.inputTitle,
                color: theme.rang.ocean,
              }}
            >
              {new Date(dob).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(dob)}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          {errors.dob && (
            <Text style={styles(theme).error}>
              {t(`${errors.dob.message}`)}
            </Text>
          )}
        </View>
        {/* Contact Information */}
        <View style={styles(theme).inputGroup}>
          <Text style={styles(theme).inputHeading}>{t("mobile_number")}</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles(theme).input}
                placeholder={t("Enter_mobile_number")}
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={10}
                placeholderTextColor={theme.rang.ocean}
              />
            )}
            name="phone"
          />
          {errors.phone && (
            <Text style={styles(theme).error}>
              {t(`${errors.phone.message}`)}
            </Text>
          )}
        </View>
        <View style={styles(theme).inputGroup}>
          <Text style={styles(theme).inputHeading}>{t("Aadhaar_Number")}</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles(theme).input}
                placeholder={t("aadhaar_placeholder")}
                keyboardType="number-pad"
                maxLength={12}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor={theme.rang.ocean}
              />
            )}
            name="adhaarNo"
          />
          {errors.adhaarNo && (
            <Text style={styles(theme).error}>
              {t(`${errors.adhaarNo.message}`)}
            </Text>
          )}
        </View>
        {/* Address Information */}
        <View style={styles(theme).inputGroup}>
          <Text style={styles(theme).inputHeading}>{t("country")}</Text>

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Dropdown
                data={countries}
                placeholder={t("select_country")}
                onChange={(item) => onChange(item.value)} // Pass only value to react-hook-form
              />
            )}
            name="country"
          />

          {errors.country && (
            <Text style={styles(theme).error}>
              {t(`${errors.country.message}`)}
            </Text>
          )}
        </View>
        <View style={styles(theme).inputGroup}>
          <Text style={styles(theme).inputHeading}>{t("states")}</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Dropdown
                data={states}
                placeholder={t("select_state")}
                onChange={(item) => onChange(item.value)} // Pass only value to react-hook-form
              />
            )}
            name="states"
          />
          {errors.states && (
            <Text style={styles(theme).error}>
              {t(`${errors.states.message}`)}
            </Text>
          )}
        </View>
        <View style={styles(theme).inputGroup}>
          <Text style={styles(theme).inputHeading}>{t("pincode")}</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles(theme).input}
                placeholder={t("pincode_placeholder")}
                keyboardType="number-pad"
                maxLength={6}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor={theme.rang.ocean}
              />
            )}
            name="pinCode"
          />
          {errors.pinCode && (
            <Text style={styles(theme).error}>
              {t(`${errors.pinCode.message}`)}
            </Text>
          )}
        </View>
        <View style={styles(theme).inputGroup}>
          <Text style={styles(theme).inputHeading}>{t("address_label")}</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles(theme).input, { height: 80 }]}
                placeholder={t("address_placeholder")}
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor={theme.rang.ocean}
              />
            )}
            name="address"
          />
          {errors.address && (
            <Text style={styles(theme).error}>
              {t(`${errors.address.message}`)}
            </Text>
          )}
        </View>
        <View style={styles(theme).inputGroup}>
          <Text style={styles(theme).inputHeading}>
            {t("departments_label")}
          </Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Dropdown
                data={departments}
                placeholder={t("select_department")}
                onChange={(item) => onChange(item.label)} // Pass only value to react-hook-form
              />
            )}
            name="department"
          />
          {errors.states && (
            <Text style={styles(theme).error}>
              {t(`${errors.states.message}`)}
            </Text>
          )}
        </View>
        <View style={styles(theme).inputGroup}>
          <Text style={styles(theme).inputHeading}>{t("post")}</Text>
          <Controller
            control={control}
            name="departmentPost"
            render={({ field: { onChange, value } }) => {
              const selectedDepartment = watch("department");
              const posts =
                departmentPosts.find((d) => d.department === selectedDepartment)
                  ?.posts ?? [];

              return (
                <Dropdown
                  data={posts}
                  placeholder={t("select_post")}
                  onChange={(item) => onChange(item.value)}
                />
              );
            }}
          />

          {errors.states && (
            <Text style={styles(theme).error}>
              {t(`${errors.states.message}`)}
            </Text>
          )}
        </View>
        {/* Documents Section */}
        <View style={styles(theme).inputGroup}>
          <Text style={styles(theme).inputHeading}>{t("documents")}</Text>
          <CButton
            title={t("add_documents")}
            onPress={pickDocuments}
            variant="primary"
          />
          {documents?.map((doc, index) => (
            <View key={index} style={styles(theme).documentItem}>
              <Text>{doc.name || "Document " + (index + 1)}</Text>
              <Text>{Math.round((doc.size || 0) / 1024)} KB</Text>
              <Button title="Remove" onPress={() => removeDocument(index)} />
            </View>
          ))}
          {errors.documents && (
            <Text style={styles(theme).error}>
              {t(`${errors.documents.message}`)}
            </Text>
          )}
          <CButton
            title={t("submit")}
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            style={{ marginTop: D.spacing.medium }}
          />
        </View>
        <View style={{ marginVertical: D.spacing.medium }} />
      </ScrollView>
      {modalVisible && formData && (
        <OtpScreenModal
          data={formData}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
    </>
  );
};

const styles = (theme: typeof Colors | typeof DarkColors) =>
  StyleSheet.create({
    container: {
      padding: D.spacing.medium,
      backgroundColor: getTheme().background,
    },
    inputGroup: {
      padding: D.spacing.medium,
    },
    inputHeading: {
      fontFamily: fonts.medium,
      fontSize: FontSizes.inputTitle,
      color: getTheme().text.primary,
    },

    input: {
      borderColor: "#ccc",
      borderWidth: 1,
      padding: D.spacing.tiny,
      borderRadius: D.radius.small,
      marginTop: D.spacing.tiny,
      fontSize: FontSizes.input,
      fontFamily: fonts.regular,
      color: getTheme().text.primary,
    },
    error: {
      color: getTheme().rang.rosewood,
      fontSize: RFValue(11),
      marginTop: D.spacing.micro,
    },
    previewContainer: {
      marginTop: D.spacing.tiny,
      alignItems: "center",
    },
    imagePreview: {
      width: D.wp(26),
      height: D.wp(26),
      borderRadius: D.radius.round,
      marginBottom: D.spacing.micro,
      borderWidth: 2,
      borderColor: getTheme().buttons.primary.border,
    },
    documentItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: D.spacing.micro,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: D.radius.medium,
      marginTop: D.spacing.micro,
    },
    radioGroup: {
      flexDirection: "row",
      marginTop: D.spacing.micro,
    },
    radioButton: {
      padding: 10,
      marginRight: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
    },
    radioButtonSelected: {
      backgroundColor: getTheme().buttons.secondary.background,
    },
  });

export default Auth;
