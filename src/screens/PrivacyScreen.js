import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PRIVACY_TEXT } from "../constants/legalText";

const COLORS = {
  primary: "#4AEF8C",
  text: "#E2E8F0", // Lighter white/grey
  card: "rgba(13, 18, 31, 0.9)", // Darker, less transparent
  neonBlue: "#22d3ee",
};

export default function PrivacyScreen() {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Confidentialité</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{PRIVACY_TEXT}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backBtn: {
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  content: { padding: 20, paddingTop: 0 },
  textContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(34, 211, 238, 0.3)", // Neon Blue border
    marginBottom: 40,
  },
  text: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    textAlign: "justify",
  },
});
