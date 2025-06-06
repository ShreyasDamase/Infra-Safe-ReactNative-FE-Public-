import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
} from "react-native";
import React, { FC, useRef, useState } from "react";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
} from "expo-camera";
type Cmode = "picture" | "video";
type CameraModelProps = {
  visible: boolean;
  onCapturePhoto?: (photo: any) => void;
  onCaptureVideo?: (video: any) => void;
  cameraMode: Cmode;
  onClose: () => void;
};
const CameraModel: FC<CameraModelProps> = ({
  visible,
  onCapturePhoto,
  onCaptureVideo,
  cameraMode,
  onClose,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [micPermissionChecked, setMicPermissionChecked] = useState(false);
  // const [cameraMode, setCameraMode] = useState<"picture" | "video">("picture"); // New state for camera mode
  const cameraRef = useRef<CameraView>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTimeRef = useRef<number>(0);
  const MIN_RECORDING_DURATION = 4000; // 4 seconds in ms
  const MAX_RECORDING_DURATION = 15000; // 15 seconds in ms
  const checkMicrophonePermission = async () => {
    const { status } = await Camera.getMicrophonePermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Microphone Permission Needed",
        "Please allow microphone access to record videos with sound.",
      );
    }
    setMicPermissionChecked(true);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!micPermissionChecked) {
    checkMicrophonePermission();
    return <View />;
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true,
        });
        onCapturePhoto?.(photo);

        console.log("Photo taken:", photo);
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to take picture");
      }
    }
  };

  const startRecording = async () => {
    if (cameraRef.current && !isRecording) {
      try {
        setIsRecording(true);
        setRecordingProgress(0);
        recordingStartTimeRef.current = Date.now();

        const interval = 100;
        let elapsed = 0;

        recordingTimerRef.current = setInterval(() => {
          elapsed += interval;
          setRecordingProgress(
            Math.min((elapsed / MAX_RECORDING_DURATION) * 100, 100),
          );

          if (elapsed >= MAX_RECORDING_DURATION) {
            stopRecording();
          }
        }, interval);

        // 🔽 Capture video data here
        const video = await cameraRef.current.recordAsync({
          maxDuration: MAX_RECORDING_DURATION / 1000, // in seconds
        });

        console.log("🎥 Video recorded:", video); // Logs URI, duration, etc.
        onCaptureVideo?.(video);

        // You can also access:
        // console.log("URI:", video.uri);
      } catch (error) {
        console.error("Error recording video:", error);
        Alert.alert("Error", "Failed to start recording");
        stopRecording();
      }
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;

    const recordingDuration = Date.now() - recordingStartTimeRef.current;

    // Enforce minimum recording duration
    if (recordingDuration < MIN_RECORDING_DURATION) {
      const remainingTime = MIN_RECORDING_DURATION - recordingDuration;
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (cameraRef.current) {
      try {
        await cameraRef.current.stopRecording();
      } catch (error) {
        console.error("Error stopping recording:", error);
      } finally {
        setIsRecording(false);
        setRecordingProgress(0);
      }
    }
  };
  const handleCloseRequest = async () => {
    if (isRecording && cameraRef.current) {
      try {
        const video = await cameraRef.current.stopRecording();
        console.log("Recording stopped on back gesture/close");

        // Send video to parent
        onCaptureVideo?.(video);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }

    setIsRecording(false); // reset recording flag
    // custom prop to close modal
    onClose();
  };

  return (
    <Modal
      visible={visible}
      hardwareAccelerated={true}
      statusBarTranslucent={true}
      presentationStyle="fullScreen"
      animationType="slide"
      transparent={false}
      onRequestClose={handleCloseRequest}
    >
      <View style={styles.container}>
        {/* Mode selector buttons */}
        {/* <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              cameraMode === "picture" && styles.activeModeButton,
            ]}
            onPress={() => setCameraMode("picture")}
          >
            <Text style={styles.modeButtonText}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              cameraMode === "video" && styles.activeModeButton,
            ]}
            onPress={() => setCameraMode("video")}
          >
            <Text style={styles.modeButtonText}>Video</Text>
          </TouchableOpacity>
        </View> */}

        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          enableTorch={false}
          zoom={0}
          mode={cameraMode}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip</Text>
            </TouchableOpacity>

            <View style={styles.captureButtonContainer}>
              {cameraMode === "video" && isRecording && (
                <View
                  style={[
                    styles.progressBar,
                    { width: `${recordingProgress}%` },
                  ]}
                />
              )}

              <TouchableOpacity
                style={[styles.button, styles.captureButton]}
                onPress={
                  cameraMode === "picture"
                    ? takePicture
                    : isRecording
                      ? stopRecording
                      : startRecording
                }
                delayLongPress={cameraMode === "video" ? 300 : 0}
              >
                <View
                  style={[
                    styles.captureButtonInner,
                    cameraMode === "video" && isRecording
                      ? styles.recordingButton
                      : null,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
};

export default CameraModel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  permissionText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  // Mode selector styles
  modeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  modeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  activeModeButton: {
    backgroundColor: "white",
  },
  modeButtonText: {
    color: "white",
    fontSize: 16,
  },
  activeModeButtonText: {
    color: "black",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 20,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    borderRadius: 50,
    marginHorizontal: 10,
    marginBottom: 50,
  },
  captureButtonContainer: {
    position: "relative",
    alignItems: "center",
  },
  progressBar: {
    position: "absolute",
    top: -10,
    height: 4,
    backgroundColor: "red",
    borderRadius: 2,
  },
  captureButton: {
    borderWidth: 2,
    borderColor: "white",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
  },
  recordingButton: {
    backgroundColor: "red",
    borderRadius: 10,
    width: 40,
    height: 40,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
