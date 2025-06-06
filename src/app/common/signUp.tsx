import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { BASE_URL } from "@/service/config";
import { useCreateUser } from "@/hooks/useCreateUser";
import Toast from "react-native-toast-message";
import { D } from "@/utils/dimensions";
import { mmkvStorage, tokenStorage } from "@/store/storage";
import { resetAndNavigate } from "@/utils/Helpers";
import { useUserStore } from "@/store/userStore";

interface OtpScreenModalProps {
  data: { phone: string };
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const OtpScreenModal: React.FC<OtpScreenModalProps> = ({
  data,
  modalVisible,
  setModalVisible,
}) => {
  // console.log(data);
  const setUser = useUserStore((state) => state.setUser);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult>();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState({
    sending: false,
    verifying: false,
    initialLoad: true,
  });
  const [seconds, setSeconds] = useState(0);
  const [otpError, setOTPFieldError] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // const createUserMutation = useCreateUser();

  const {
    mutate,
    isPending,
    isError,
    isSuccess,
    data: userData,
    error,
  } = useCreateUser();
  // Initialize phone number when modal opens
  useEffect(() => {
    if (modalVisible && data?.phone) {
      setLoading((prev) => ({ ...prev, initialLoad: true }));
      setPhoneNumber(data.phone);

      const timer = setTimeout(() => {
        if (data.phone.length === 10) {
          setLoading((prev) => ({ ...prev, initialLoad: false }));
          showPhoneConfirmation();
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [modalVisible, data?.phone]);

  const showPhoneConfirmation = () => {
    Alert.alert(
      "Confirm Phone Number",
      `We'll send an OTP to ${data.phone}. Is this correct?`,
      [
        {
          text: "Edit",
          onPress: () => setModalVisible(false),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => signInWithPhoneNumber(true),
        },
      ],
    );
  };

  // Timer management
  const startTimer = (duration = 60) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setSeconds(duration);

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const signInWithPhoneNumber = async (isResend = false) => {
    console.log("alert", phoneNumber);
    const numberToUse = phoneNumber.length !== 10 ? data.phone : phoneNumber;

    if (!numberToUse || numberToUse.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    setLoading((prev) => ({ ...prev, sending: true }));
    setOTPFieldError("");

    try {
      if (isResend) {
        setConfirm(undefined);
        setCode("");
      }

      const formattedNumber = `+91${numberToUse}`;
      const confirmation = await auth().signInWithPhoneNumber(formattedNumber);
      setConfirm(confirmation);
      startTimer(60);

      Toast.show({
        type: "success",
        text1: "🔔 OTP Sent!",
        text2: isResend
          ? "New OTP has been sent to your number."
          : "Enter the OTP to complete your verification.",
        position: "top",
        visibilityTime: 3000,
      });
    } catch (error: any) {
      console.log("Error in sending code:", error);
      let errorMessage = "Failed to send OTP. Please try again.";

      if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later.";
      } else if (error.code === "auth/invalid-phone-number") {
        errorMessage = "The provided phone number is invalid.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, sending: false }));
    }
  };

  const confirmCode = async () => {
    // console.log(code);
    if (!code || code.length < 6) {
      setOTPFieldError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading((prev) => ({ ...prev, verifying: true }));
    setOTPFieldError("");

    try {
      if (!confirm) throw new Error("No confirmation available");

      const userCredential = await confirm.confirm(code);
      const user = userCredential?.user;

      if (!user) {
        throw new Error("User verification failed");
      }

      const idToken = await user.getIdToken();

      await mutate(
        { idToken, data: data as any },
        {
          onSuccess: (data: any) => {
            console.log("boki token", data);
            tokenStorage.set("access_token", data.access_token);
            tokenStorage.set("refresh_token", data.refresh_token);

            console.log("navigate", data.user);

            if (data?.user) {
              const userData = data.user;

              setUser(JSON.stringify(userData));

              if (userData?.role === "helper") {
                resetAndNavigate("/Helper/(tabs)/profile");
              } else {
                resetAndNavigate("/Citizen/(tabs)/createComplaint");
              }
            } else {
              console.warn("⚠️ No user data returned. Skipping user save.");
            }
            setTimeout(() => {
              Toast.show({
                type: "success",
                text1: "✅ Verification Complete",
                text2: "You're now verified!",
                position: "top",
                visibilityTime: 3000,
                onHide: () => {},
              });
            }, 1000);
            setModalVisible(false);
            console.log("User verified:", data);
            // data.success, data.uid, data.phoneNumber

            //  ;
          },
          onError: (error) => {
            console.error("Verification failed:", error.message);
            setOTPFieldError("Invalid OTP or code expired. Please try again.");
            setModalVisible(false);
          },
        },
      );
    } catch (error: any) {
      console.log("Error in confirming code:", error);
      setOTPFieldError("Invalid OTP or code expired. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, verifying: false }));
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {loading.initialLoad ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="orange" />
              <Text style={styles.loadingText}>Preparing verification...</Text>
            </View>
          ) : !confirm ? (
            <View style={styles.phoneConfirmationContainer}>
              <Text style={styles.label}>Verify Phone Number</Text>
              <Text style={styles.phoneNumberText}>+91 {phoneNumber}</Text>
              <Text style={styles.confirmationText}>
                Is this phone number correct?
              </Text>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Edit Number</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={() => signInWithPhoneNumber()}
                  disabled={loading.sending}
                >
                  {loading.sending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Yes, Send OTP</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.otpContainer}>
              <Text style={styles.label}>Enter OTP</Text>
              <Text style={styles.subLabel}>Sent to +91 {phoneNumber}</Text>

              <TextInput
                style={[styles.input, otpError ? styles.inputError : null]}
                value={code}
                onChangeText={(text) => {
                  setCode(text);
                  setOTPFieldError("");
                }}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="123456"
                placeholderTextColor="#999"
                autoFocus={true}
              />

              {otpError && <Text style={styles.errorText}>{otpError}</Text>}

              <Text style={styles.timerText}>
                {seconds > 0 ? `Resend OTP in ${seconds}s` : "OTP expired"}
              </Text>

              <TouchableOpacity
                style={[
                  styles.buttonBase,
                  seconds > 0 ? styles.verifyButton : styles.resendButton,
                  (seconds > 0 && loading.verifying) ||
                  (seconds <= 0 && loading.sending)
                    ? styles.buttonDisabled
                    : null,
                ]}
                onPress={
                  seconds > 0 ? confirmCode : () => signInWithPhoneNumber(true)
                }
                disabled={
                  (seconds > 0 && loading.verifying) ||
                  (seconds <= 0 && loading.sending)
                }
              >
                <View style={styles.buttonContent}>
                  {seconds > 0 ? (
                    loading.verifying ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.buttonText}>Verify OTP</Text>
                    )
                  ) : loading.sending ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Resend OTP</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Toast />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    minHeight: 200,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  phoneConfirmationContainer: {
    alignItems: "center",
  },
  label: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  phoneNumberText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#007AFF",
  },
  confirmationText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  button: {
    paddingVertical: 24,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.7,
  },

  editButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  verifyButton: {
    backgroundColor: "#007AFF",
  },
  resendButton: {
    backgroundColor: "#28A745",
  },
  otpContainer: {
    alignItems: "center",
  },
  subLabel: {
    color: "#666",
    marginBottom: 20,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#f9f9f9",
  },
  inputError: {
    borderColor: "red",
    backgroundColor: "#fff6f6",
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  timerText: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
    fontSize: 14,
  },
  container: {
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
    width: D.wp(80),
    height: D.wp(80),
  },
  buttonBase: {
    minHeight: 50, // Ensure minimum height
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16, // Slightly reduced from 25
    includeFontPadding: false, // Prevent extra padding
    textAlignVertical: "center",
  },
});

export default OtpScreenModal;
