import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AdwallScreen() {
  return (
    <View style={styles.container}>
      <Text>Screen: AdwallScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
