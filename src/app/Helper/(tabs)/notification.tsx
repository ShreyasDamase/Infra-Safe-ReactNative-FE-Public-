import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { logOut } from "@/service/authService";

const notification = () => {
  return (
    <View>
      <Text>notification</Text>
      <Button onPress={() => logOut()} title="logout" />
    </View>
  );
};

export default notification;

const styles = StyleSheet.create({});
