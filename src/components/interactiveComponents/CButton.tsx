import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { D } from "@/utils/dimensions";
import { getTheme } from "@/theme/useAppTheme";
import { fonts, FontSizes } from "@/theme/fonts";
import { string } from "zod";
interface CustomButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "outline";
  style?: ViewStyle;
  textColor?: string;
  textSize?: number;
}
const CButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  style,
  textColor,
  textSize,
}) => {
  const isOutline = variant === "outline";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isOutline ? styles.outline : styles.primary,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? "#000" : "#fff"} />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline ? styles.outlineText : styles.primaryText,
            textColor && { color: textColor },
            typeof textSize === "number" && { fontSize: textSize },
          ]}
        >
          {title.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: D.spacing.tiny,
    paddingHorizontal: D.spacing.tiny,
    borderRadius: D.radius.small,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: getTheme().buttons.primary.background,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: getTheme().buttons.primary.border,
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: FontSizes.button,
    fontFamily: fonts.SemiBold,
  },
  primaryText: {
    color: getTheme().buttons.primary.text,
  },
  outlineText: {
    color: getTheme().buttons.primary.border,
  },
});
