import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// On garde les couleurs du Design System pour les éléments
const COLORS = {
  card: "rgba(13, 18, 31, 0.8)",
  text: "#FFFFFF",
  textSecondary: "#A6A6A6",
  primary: "#4AEF8C",
};

const TEAM_MEMBERS = [
  { name: "Rodolphe", role: "aka Roasty" },
  { name: "Pierre", role: "aka “t'as vu ce que j’ai fait”" },
  { name: "Enzo", role: "aka le berloule" },
  { name: "Maxyme", role: "aka avec un y" },
  { name: "Cedric", role: "aka Atchoum" },
];

export default function AboutScreen() {
  const navigation = useNavigation(); // Initialize navigation hook

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
        {/* HEADER NAVIGATION (Fixe) */}
        <View style={styles.navHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* HEADER LOGO */}
          <View style={styles.header}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.appName}>Roast My Excuses</Text>
            <Text style={styles.version}>v1.0.0</Text>
          </View>

          {/* TEAM SECTION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>L'ÉQUIPE</Text>
            <View style={styles.teamContainer}>
              {TEAM_MEMBERS.map((member, index) => (
                <View key={index} style={styles.memberRow}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* FOOTER */}
          <Text style={styles.copyright}>
            Copyright © 2025 Roast My Excuses.
          </Text>
          <Text style={styles.copyright}>
            Fait avec ❤️ (et beaucoup d'humour)
          </Text>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(4, 12, 30, 0.6)",
  },
  scrollContent: {
    padding: 24,
    alignItems: "center",
  },
  navHeader: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
    alignItems: "flex-start", // Aligne le bouton à gauche
  },
  backBtn: {
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 0, // Plus besoin de marge énorme
  },
  // NOUVEAU STYLE POUR LE LOGO (Plus de bordure, plus de fond)
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  version: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: "monospace",
  },
  section: {
    width: "100%",
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  teamContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  memberRow: {
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    paddingBottom: 8,
  },
  memberName: { fontSize: 18, fontWeight: "600", color: COLORS.text },
  memberRole: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
  copyright: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 4,
  },
});
