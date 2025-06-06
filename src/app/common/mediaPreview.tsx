import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC } from "react";
import { mergeTypes } from "zod";
import { Colors } from "@/theme/Colors";
import DarkColors from "@/theme/DarkColors";
import { useAppTheme } from "@/theme/useAppTheme";
import { D } from "@/utils/dimensions";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
type MediaType = "picture" | "video";
interface MediaPreviewProp {
  uri: string;
  type: MediaType;
  onClose: () => void;
}

const MediaPreview: FC<MediaPreviewProp> = ({ uri, type, onClose }) => {
  const { theme } = useAppTheme();

  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.play();
  });
  return (
    <Modal transparent animationType="fade">
      <View style={styles(theme).overlayContainer}>
        <View style={styles(theme).container}>
          <TouchableOpacity style={styles(theme).close} onPress={onClose}>
            <Ionicons name="close" size={30} />
          </TouchableOpacity>
          <View style={styles(theme).mediaContainer}>
            {uri ? (
              type === "picture" ? (
                <Image
                  source={{ uri: uri }}
                  style={styles(theme).mediaContente}
                />
              ) : (
                <VideoView
                  player={player}
                  style={styles(theme).mediaContente}
                />
              )
            ) : (
              <View>
                <Image
                  source={require("@/assets/images/vector/nomedia.png")}
                  style={{ width: D.wp(60), height: D.wp(60) }}
                  tintColor={theme.rang.boxBorder}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MediaPreview;

const styles = (theme: typeof Colors | typeof DarkColors) =>
  StyleSheet.create({
    overlayContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    container: {
      margin: D.spacing.large,
      backgroundColor: "white",
      width: D.wp(90),
      height: D.hp(60),
      borderRadius: D.radius.large,
      alignItems: "center",
      justifyContent: "center",
      elevation: 8,
    },
    close: {
      marginBottom: D.spacing.small,
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 100,
    },
    mediaContainer: {
      width: D.wp(81.5),
      height: D.hp(50),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
      borderRadius: D.radius.large,
      elevation: 8,
    },
    mediaContente: {
      width: "100%",
      height: "100%",
      borderRadius: D.radius.large,
      overflow: "hidden",
    },
  });
