import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import {
  BackHandler,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { resetCurrentTask, updateTaskStatus } from "../redux/slices/taskSlices";

export default function RoastResultScreen({ navigation }) {
  const dispatch = useDispatch();
  const { currentTask } = useSelector((state) => state.tasks);

  // sécurité : pas de tâche en cours = on reload et on renvoie au Feed
  useEffect(() => {
    if (!currentTask) {
      navigation.replace("Main");
    }
  }, [currentTask]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleGoHome
    );
    return () => backHandler.remove();
  }, [currentTask]);

  // permet de reset = pas d'historique et retour propre sur le Feed
  const handleGoHome = () => {
    dispatch(resetCurrentTask());
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
    return true;
  };

  const handleStartFocus = async () => {
    try {
      await dispatch(
        updateTaskStatus({
          id: currentTask._id,
          status: "in_progress",
        })
      ).unwrap();
      // On ne navigue plus manuellement ici !
      // C'est l'AppNavigator qui va détecter le changement de status et rediriger vers Focus.
      // navigation.navigate("Focus");
    } catch (error) {
      console.error("Erreur start focus:", error);
    }
  };

  const renderActionPlan = () => {
    if (currentTask.type !== "challenge" || !currentTask.actionPlan) {
      return null;
    } else {
      return (
        <View style={styles.actionPlanContainer}>
          <Text style={styles.sectionTitle}>Plan de bataille</Text>
          {currentTask.actionPlan.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepBullet}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>
                {step.replace(/^Étape \d+\s*:\s*/i, "")}
              </Text>
            </View>
          ))}
        </View>
      );
    }
  };

  const renderStartButton = () => {
    if (currentTask.type !== "challenge") {
      return null;
    } else {
      return (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleStartFocus}
        >
          <LinearGradient
            colors={["#c9ff53", "#26f0ff"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientButton}
          >
            <Text style={styles.primaryButtonText}>JE ME LANCE !</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
  };

  if (!currentTask) return null;

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(4,11,22,0.6)", "rgba(4,11,22,0.95)"]}
        style={styles.gradientOverlay}
      />

      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <Text style={styles.headerTitle}>VERDICT</Text>
          <Text style={styles.subHeader}>Roasty a parlé. Ca va piquer.</Text>

          {/* ROAST */}
          <View style={styles.roastContainer}>
            <Text style={styles.roastText}>"{currentTask.roastContent}"</Text>
          </View>

          {/* PLAN D'ACTION */}
          {renderActionPlan()}

          {/* BOUTONS */}
          <View style={styles.footer}>
            {/* "Je me lance" */}
            {renderStartButton()}

            {/* Retour */}
            <TouchableOpacity
              onPress={handleGoHome}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>
                {currentTask.type === "challenge"
                  ? "Je préfère rien faire, comme toujours."
                  : "J'ai compris, je retourne à ma médiocrité."}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 50,
  },

  // Header
  headerTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#ff4d4d",
    textAlign: "center",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 2,
    textShadowColor: "rgba(255, 77, 77, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subHeader: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 30,
  },

  // Roast
  roastContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 77, 77, 0.3)",
    marginBottom: 30,
  },
  roastText: {
    color: "#e2e8f0",
    fontSize: 18,
    lineHeight: 28,
    fontStyle: "italic",
    textAlign: "center",
    fontWeight: "500",
  },

  // Plan d'action
  actionPlanContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#bef264",
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    padding: 12,
    borderRadius: 12,
  },
  stepBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#bef264",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    color: "#0f172a",
    fontWeight: "bold",
    fontSize: 14,
  },
  stepText: {
    color: "#cbd5e1",
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },

  // Footer + buttons
  footer: {
    marginTop: 10,
    gap: 16,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#26f0ff",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#0b0b0b",
    fontWeight: "900",
    fontSize: 18,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  secondaryButton: {
    paddingVertical: 15,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#94a3b8",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
