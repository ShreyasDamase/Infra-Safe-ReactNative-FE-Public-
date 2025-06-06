import {
  Alert,
  Button,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import CameraModel from "@/app/common/cameraModel";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import * as Crypto from "expo-crypto";
import axios from "axios";
import { BASE_URL } from "@/service/config";
import { useCreateComplaint } from "@/hooks/useCreateComplaint";
import { getCurrentLocationDetails } from "@/utils/mapUtils";
import { Colors, DarkColors, getTheme, useAppTheme } from "@/theme/useAppTheme";
import { TypeOf } from "zod";
import { useTranslation } from "react-i18next";
import { RFValue } from "react-native-responsive-fontsize";
import { fonts } from "@/theme/fonts";
import { Entypo, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { D } from "@/utils/dimensions";
import MediaPreview from "@/app/common/mediaPreview";
import Dropdown from "@/components/interactiveComponents/DropDown";
import CButton from "@/components/interactiveComponents/CButton";
import { useUserStore } from "@/store/userStore";
interface Coords {
  latitude: number;
  longitude: number;
}

const createComplaint = () => {
  const [cameraVisible, setCameraVisible] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<any>(null);
  const [capturedVideo, setCapturedVideo] = useState<any>();
  const [mediaPreview, setMediaPreview] = useState<boolean>();
  const [place, setPlace] = useState<any>();
  const [coords, setCoords] = useState<Coords | undefined>();
  const [complaint, setComplaint] = useState<string>("");
  const [detail, setDetaile] = useState("");
  const [cameraMode, setCameraMode] = useState<"picture" | "video">("picture"); // New state for camera mode

  const { t } = useTranslation();
  const { theme } = useAppTheme();

  const { user } = useUserStore();
  const parsedUser = typeof user === "string" ? JSON.parse(user) : user;
  console.log("mmkv storage use", user);

  const { mutate, isPending, isError, isSuccess, data, error } =
    useCreateComplaint();
  const generateUniqueId = async () => {
    const randomBytes = await Crypto.getRandomBytesAsync(16);
    return [...randomBytes]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const player = useVideoPlayer(capturedVideo?.uri, (player) => {
    player.loop = true;
    // player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  const formData = new FormData();

  const handleSubmit = async () => {
    if (!capturedPhoto?.uri || !complaint || !place) {
      Alert.alert("Error", "Title or media missing");
      return;
    }

    try {
      const formData = new FormData();

      // append image (can make logic conditional if only image/video present)
      formData.append("pictureData", {
        uri: capturedPhoto.uri,
        name: `${await generateUniqueId()}.jpg`,
        type: "image/jpeg",
      } as any);

      formData.append("videoData", {
        uri: capturedVideo.uri,
        name: `${await generateUniqueId()}.mp4`,
        type: "video/mp4",
      } as any);
      formData.append("complaint", complaint);
      formData.append("address", detail);

      formData.append("detail", detail);
      formData.append("user", user);
      formData.append("coords", JSON.stringify(coords));

      // const response = await axios.post(`${BASE_URL}/complaint`, formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      // console.log("Upload successful:", response.data);

      await mutate(formData, {
        onSuccess: (data: any) => {
          console.log(data);
          Alert.alert("Success", "Complaint submitted");
        },
        onError: (error) => {
          console.log(error);
        },
      });
    } catch (err) {
      console.error("Upload failed:", err);
      Alert.alert("Error", "Failed to submit complaint");
    }
  };

  const fetchCurrentLocation = async () => {
    const data = await getCurrentLocationDetails();
    if (data) {
      console.log("📍 Current Location =>", data);
      setPlace(data);

      // { latitude: ..., longitude: ..., address: 'Some Street, Pune, Maharashtra, India' }
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      const data = await getCurrentLocationDetails();
      if (data) {
        console.log("📍 Current Location =>", data);
        // { latitude: ..., longitude: ..., address: 'Some Street, Pune, Maharashtra, India' }
      }
      setPlace(data);
      // setCoords({ latitude: data.latitude, longitude: data.longitude });

      setCoords({ latitude: 73.816556, longitude: 18.590152 });
    };
    fetchLocation();
  }, []);

  return (
    <>
      <StatusBar
        barStyle={getTheme().statusbar.barStyle}
        backgroundColor={getTheme().statusbar.backgroundColor}
      />
      <SafeAreaView
        style={{
          backgroundColor: theme.rang.background,
          flex: 1,
        }}
      >
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : -50}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          > */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="always"
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: fonts.medium,
              fontSize: RFValue(18),
              color: theme.text.primary,
              marginTop: D.spacing.medium,
            }}
          >
            {t("report_issue")}
          </Text>
          <View
            style={{
              borderColor: theme.rang.boxBorder,
              borderWidth: 1,
              marginHorizontal: D.hp(3),
            }}
          />
          <View
            style={{
              flexDirection: "row",
              padding: D.spacing.medium,
            }}
          >
            <FontAwesome6
              name="map-pin"
              size={20}
              color={theme.rang.blackWhite}
            />
            <Text
              style={{
                marginLeft: D.spacing.small,
                color: theme.text.primary,
              }}
              ellipsizeMode="tail"
              numberOfLines={3}
            >
              {/* {place?.address
                ? place.address
                    .substring(place.address.indexOf(",") + 1)
                    .trim()
                    .replace(/\s+/g, " ")
                : "Fetching location..."} */}
              {place?.address
                ? "Road No. 4, Pimple Gurav, Pimpri-Chinchwad, Maharashtra"
                : "Fetching location..."}
            </Text>
          </View>
          <Text>{JSON.stringify(coords)}</Text>

          <View
            style={{
              marginHorizontal: D.spacing.medium,
            }}
          >
            <View>
              {/* picture and video section */}
              <Text
                style={{
                  color: theme.text.secondary,
                  margin: D.spacing.medium,
                }}
              >
                {t("Media")}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "space-between",
                  alignContent: "center",
                  paddingHorizontal: D.spacing.tiny,
                }}
              >
                <View>
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      backgroundColor: theme.rang.mediaContainer,
                      padding: D.spacing.small,
                      borderRadius: D.radius.large,
                      elevation: 8,
                    }}
                    onPress={() => {
                      setCameraMode("picture");
                      setCameraVisible(true);
                    }}
                  >
                    <Entypo
                      name="camera"
                      size={28}
                      color={theme.rang.borderPlaceholder}
                    />
                    <Text
                      style={{
                        color: theme.text.primary,
                        fontFamily: fonts.regular,
                        marginVertical: D.spacing.micro,
                      }}
                    >
                      {t("Capture_Photo")}
                    </Text>
                    {capturedPhoto ? (
                      <View
                        style={{
                          width: D.wp(35),
                          alignItems: "center",
                          marginTop: D.wp(1),
                        }}
                      >
                        <Image
                          source={{ uri: capturedPhoto.uri }}
                          style={{
                            width: D.wp(35),
                            height: D.wp(27),
                            borderRadius: D.radius.large,
                          }}
                          resizeMode="cover"
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          width: D.wp(35),
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={require("@/assets/images/vector/imageplaceholder.png")}
                          style={{ width: D.wp(40), height: D.wp(30) }}
                          resizeMode="stretch"
                          tintColor={theme.rang.borderPlaceholder}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      backgroundColor: theme.rang.mediaContainer,
                      borderRadius: D.radius.large,
                      margin: D.spacing.medium,
                      padding: D.spacing.tiny,
                      elevation: 8,
                    }}
                    onPress={() => {
                      setCameraMode("picture");
                      setMediaPreview(true);
                    }}
                  >
                    <Text style={{ color: theme.text.primary }}>
                      {t("Preview")}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      backgroundColor: theme.rang.mediaContainer,
                      padding: D.spacing.small,
                      borderRadius: D.radius.large,
                      elevation: 8,
                    }}
                    onPress={() => {
                      setCameraMode("video");
                      setCameraVisible(true);
                    }}
                  >
                    <Entypo
                      name="video-camera"
                      size={28}
                      color={theme.rang.borderPlaceholder}
                    />
                    <Text
                      style={{
                        color: theme.text.primary,
                        fontFamily: fonts.regular,
                        marginVertical: D.spacing.micro,
                      }}
                    >
                      {t("Capture_Video")}
                    </Text>
                    {capturedVideo ? (
                      <View
                        style={{
                          width: D.wp(35),
                          alignItems: "center",
                          marginTop: D.wp(1),
                        }}
                      >
                        <Image
                          source={{ uri: capturedVideo.uri }}
                          style={{
                            width: D.wp(35),
                            height: D.wp(27),
                            borderRadius: D.radius.large,
                          }}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          width: D.wp(35),
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={require("@/assets/images/vector/videoplaceholder.png")}
                          style={{ width: D.wp(40), height: D.wp(30) }}
                          resizeMode="stretch"
                          tintColor={theme.rang.borderPlaceholder}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      backgroundColor: theme.rang.mediaContainer,
                      borderRadius: D.radius.large,
                      margin: D.spacing.medium,
                      padding: D.spacing.tiny,
                      elevation: 8,
                    }}
                    onPress={() => {
                      setCameraMode("video");
                      setMediaPreview(true);
                    }}
                  >
                    <Text style={{ color: theme.text.primary }}>
                      {t("Preview")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{ alignItems: "center" }}>
              <Dropdown
                data={[
                  { label: "Pipeline Leak", value: "pipeline_leak" },
                  { label: "Fire", value: "fire" },
                  { label: "Road Damage", value: "road_damage" },
                  { label: "Electrical Fault", value: "electrical_fault" },
                  { label: "Water Supply Issue", value: "water_supply" },
                  { label: "Garbage Overflow", value: "garbage_overflow" },
                  { label: "Other", value: "other" },
                ]}
                onChange={(item) => setComplaint(item.value)}
                placeholder={t("Select_complaint_type")}
                styleBox={{
                  paddingHorizontal: D.spacing.tiny,
                }}
                styleDropdown={{
                  marginTop: 2,
                }}
              />
            </View>

            <View
              style={{
                padding: D.spacing.tiny,
                marginVertical: D.spacing.medium,
              }}
            >
              <TextInput
                placeholder={t("Complaint_detail")}
                value={detail}
                onChangeText={setDetaile}
                multiline
                placeholderTextColor={theme.forms.input.placeholder}
                style={{
                  borderColor: theme.rang.boxBorder,
                  borderWidth: 1,
                  borderRadius: D.radius.medium,
                  color: theme.text.primary,
                  fontFamily: fonts.regular,
                  minHeight: 60,
                  padding: D.spacing.small,
                }}
              />

              <CButton
                title={t("submit")}
                onPress={handleSubmit}
                variant="outline"
                style={{
                  marginTop: D.wp(5),
                  borderColor: theme.rang.boxBorder,
                }}
                textColor={theme.text.primary}
              />
            </View>
          </View>
        </ScrollView>
        {/* </TouchableWithoutFeedback>
        </KeyboardAvoidingView> */}
      </SafeAreaView>

      {mediaPreview && (
        <MediaPreview
          uri={
            cameraMode === "picture" ? capturedPhoto?.uri : capturedVideo?.uri
          }
          type={cameraMode}
          onClose={() => setMediaPreview(false)}
        />
      )}

      <CameraModel
        visible={cameraVisible}
        cameraMode={cameraMode}
        onCapturePhoto={(photo) => {
          setCapturedPhoto(photo);
          setCameraVisible(false);
        }}
        onCaptureVideo={(video) => {
          setCapturedVideo(video);
          setCameraVisible(false); // optionally close camera
        }}
        onClose={() => setCameraVisible(false)}
      />
    </>
  );
};

export default createComplaint;

const styles = (theme: typeof Colors | typeof DarkColors) =>
  StyleSheet.create({
    video: {
      width: 350,
      height: 275,
    },
  });
