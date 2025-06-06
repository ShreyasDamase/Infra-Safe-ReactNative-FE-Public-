import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  SafeAreaView,
  ViewStyle,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { D } from "@/utils/dimensions";
import { Colors, DarkColors, getTheme, useAppTheme } from "@/theme/useAppTheme";
import { RFValue } from "react-native-responsive-fontsize";
import { FontSizes } from "@/theme/fonts";
import { useTranslation } from "react-i18next";

type OptionItem = {
  value: string;
  label: string;
  flag?: string;
};

interface DropDownProps {
  data: OptionItem[];
  onChange: (item: OptionItem) => void;
  placeholder: string;
  styleBox?: ViewStyle;
  styleDropdown?: ViewStyle;
}

export default function Dropdown({
  data,
  onChange,
  placeholder,
  styleBox,
  styleDropdown,
}: DropDownProps) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const toggleExpanded = useCallback(() => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        const adjustedY = y + height;
        setTop(adjustedY);
        setExpanded((prev) => !prev);
      });
    }
  }, []);

  const [value, setValue] = useState("");
  const { theme, setTheme } = useAppTheme();

  const buttonRef = useRef<View>(null);

  const [top, setTop] = useState(0);

  const onSelect = useCallback((item: OptionItem) => {
    onChange(item);
    setValue(item.label);
    setExpanded(false);
  }, []);
  return (
    <>
      <SafeAreaView />
      <View
        ref={buttonRef}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          const topOffset = layout.y;
          const heightOfComponent = layout.height;

          const finalValue =
            topOffset +
            heightOfComponent +
            (Platform.OS === "android" ? -32 : 3);

          setTop(finalValue);
        }}
        style={styleBox}
      >
        <TouchableOpacity
          style={styles(theme).button}
          activeOpacity={0.8}
          onPress={toggleExpanded}
        >
          <Text style={styles(theme).text}>{t(value) || placeholder}</Text>
          <AntDesign name={expanded ? "caretup" : "caretdown"} />
        </TouchableOpacity>
        {expanded ? (
          <Modal visible={expanded} transparent>
            <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
              <View style={styles(theme).backdrop}>
                <View
                  style={[
                    styles(theme).options,
                    {
                      top,
                    },
                    styleDropdown,
                  ]}
                >
                  <FlatList
                    keyExtractor={(item) => item.value}
                    data={data}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles(theme).optionItem}
                        onPress={() => onSelect(item)}
                      >
                        <View style={{ flexDirection: "row", gap: D.wp(3) }}>
                          <Text>{item?.flag}</Text>
                          <Text style={{ color: theme.text.primary }}>
                            {t(item.label)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => (
                      <View style={styles(theme).separator} />
                    )}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        ) : null}
      </View>
    </>
  );
}

const styles = (theme: typeof Colors | typeof DarkColors) =>
  StyleSheet.create({
    backdrop: {
      padding: D.spacing.micro,
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
    optionItem: {
      height: D.wp(10),
      justifyContent: "center",
      borderBottomColor: "#ffffff",
      borderBottomWidth: 1,
    },
    separator: {
      height: 4,
    },
    options: {
      position: "absolute",
      backgroundColor: getTheme().rang.deropDown,
      width: D.wp(91),
      padding: D.spacing.small,
      borderRadius: D.radius.medium,
      maxHeight: D.wp(70),
    },
    text: {
      fontSize: FontSizes.inputTitle,
      opacity: 0.8,
    },
    button: {
      height: D.wp(11),
      justifyContent: "space-between",
      backgroundColor: getTheme().rang.dropdownButton,
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      paddingHorizontal: 15,
      borderRadius: D.radius.small,
      borderWidth: 1,
      borderColor: "#ccc",
    },
  });
