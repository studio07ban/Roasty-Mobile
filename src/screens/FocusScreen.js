import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import CircularTimer from "../components/CircularTimer";
import { updateTaskStatus } from "../redux/slices/taskSlices";

// Palette Neon

export default function FocusScreen({ navigation }) {
  const dispatch = useDispatch();
  const { currentTask } = useSelector((state) => state.tasks);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [isTimerFinished, setIsTimerFinished] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // 1. Bloquer le retour arrière
  useEffect(() => {
    // Désactiver le geste de retour (iOS)
    navigation.setOptions({
      gestureEnabled: false,
      headerLeft: () => null, // Cacher bouton retour natif si présent
    });

    // Bloquer le bouton physique (Android)
    const backAction = () => {
      Alert.alert("Interdit !", "Pas de fuite possible. Assume ou abandonne.", [
        { text: "OK", onPress: () => null, style: "cancel" },
      ]);
      return true; // Bloque l'action par défaut
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  // Durée dynamique depuis l'IA (en secondes) ou 25 min par défaut (1500s)
  // const [isPlaying, setIsPlaying] = useState(true); // PLUS DE PAUSE
  const duration = currentTask?.timerDuration || 25 * 60;

  // Calcul du temps restant en fonction du startedAt
  let initialRemainingTime = duration;
  if (currentTask?.startedAt) {
    const startTime = new Date(currentTask.startedAt).getTime();
    const now = new Date().getTime();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    initialRemainingTime = Math.max(0, duration - elapsedSeconds);
  }

  // --- LOGIC: Step Locking ---
  const isStepLocked = (index) => {
    return index === 2 && !isTimerFinished;
  };

  const toggleStep = (index) => {
    if (isStepLocked(index)) {
      Alert.alert(
        "Pas si vite !",
        "Attends la fin du chrono pour débloquer cette étape."
      );
      return;
    }

    setCheckedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleTimerComplete = () => {
    // Le timer est fini, on débloque le dernier checkbox et on permet la validation
    setIsTimerFinished(true);
    // On ne valide plus automatiquement. L'user doit cocher et cliquer.
  };

  const handleValidateTask = () => {
    setIsTimerActive(false);
    dispatch(updateTaskStatus({ id: currentTask._id, status: "completed" }))
      .unwrap()
      .then((data) => {
        navigation.navigate("CompletionScreen", {
          isSuccess: true,
          pointsEarned: data.pointsEarned || 0,
          isLevelUp: data.isLevelUp || false,
        });
      })
      .catch((err) => {
        const errorMessage = err?.message || JSON.stringify(err);
        if (
          errorMessage.includes("déjà finie") ||
          errorMessage.includes("abandonnée") ||
          errorMessage.includes("400")
        ) {
          Alert.alert(
            "Déjà validé !",
            "Cette tâche est déjà cloturée. Retour à l'accueil.",
            [
              {
                text: "OK",
                onPress: () =>
                  navigation.reset({ index: 0, routes: [{ name: "Main" }] }),
              },
            ]
          );
        } else {
          Alert.alert("Erreur", "Impossible de valider la tâche.");
        }
      });
  };

  const handleGiveUp = () => {
    Alert.alert(
      "Abandonner ?",
      "Tu vas vraiment laisser gagner la flemme ?",
      [
        { text: "Non, je continue", style: "cancel" },
        {
          text: "Oui, je suis faible",
          style: "destructive",
          onPress: () => {
            setIsTimerActive(false);
            // On récupère les index cochés pour les points partiels
            const stepIndices = Object.keys(checkedSteps)
              .filter((key) => checkedSteps[key])
              .map(Number);

            dispatch(
              updateTaskStatus({
                id: currentTask._id,
                status: "abandoned",
                checkedStepIndices: stepIndices,
                timerFinished: isTimerFinished,
              })
            )
              .unwrap()
              .then((payload) => {
                navigation.navigate("CompletionScreen", {
                  isSuccess: false,
                  pointsEarned: payload.pointsEarned || 0,
                  isLevelUp: false, // Pas de level up en cas d'abandon
                });
              })
              .catch((err) => {
                console.error(err);
                // Si le backend dit que c'est déjà fini (400), on redirige l'utilisateur
                // Le message d'erreur est souvent dans err.message ou err (selon axios/redux)
                const errorMessage = err?.message || JSON.stringify(err);

                if (
                  errorMessage.includes("déjà finie") ||
                  errorMessage.includes("abandonnée") ||
                  errorMessage.includes("400")
                ) {
                  Alert.alert(
                    "Déjà fait !",
                    "Cette tâche est déjà cloturée. Retour à l'accueil.",
                    [
                      {
                        text: "OK",
                        onPress: () =>
                          navigation.reset({
                            index: 0,
                            routes: [{ name: "Main" }],
                          }),
                      },
                    ]
                  );
                } else {
                  Alert.alert(
                    "Erreur",
                    "Impossible d'abandonner. Vérifie ta connexion."
                  );
                }
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Check if all 3 steps are checked
  const allStepsChecked =
    currentTask?.actionPlan?.length === 3 &&
    checkedSteps[0] &&
    checkedSteps[1] &&
    checkedSteps[2];

  const canValidate = isTimerFinished && allStepsChecked;

  // Fallback si pas de tâche (accès direct)
  if (!currentTask) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.text}>Aucune tâche en cours.</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Main" }],
            })
          }
        >
          <Text style={{ color: "#4AEF8C", marginTop: 20 }}>
            Retour à l'accueil
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#040C1E" />
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SHUT UP & WORK</Text>
          <Text style={styles.subHeader}>
            Ta mission :{" "}
            <Text style={styles.missionText}>{currentTask.description}</Text>
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* TIMER CENTRAL */}
          <View style={styles.timerContainer}>
            <CircularTimer
              duration={duration}
              initialRemainingTime={initialRemainingTime}
              onComplete={handleTimerComplete}
              isPlaying={isTimerActive}
            />
          </View>

          {/* ACTION PLAN */}
          <View style={styles.actionPlanContainer}>
            <Text style={styles.sectionTitle}>TA TODO LIST :</Text>
            {currentTask.actionPlan?.map((step, index) => {
              const locked = isStepLocked(index);
              const checked = checkedSteps[index];

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.stepItem,
                    checked && styles.stepItemChecked,
                    locked && { opacity: 0.5 },
                  ]}
                  onPress={() => toggleStep(index)}
                  disabled={locked && false}
                >
                  <Ionicons
                    name={
                      locked
                        ? "lock-closed"
                        : checked
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={24}
                    color={locked ? "#FF5252" : checked ? "#4AEF8C" : "#94a3b8"}
                  />
                  <Text
                    style={[styles.stepText, checked && styles.stepTextChecked]}
                  >
                    {step}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* FOOTER ACTIONS */}
        <View style={styles.footer}>
          {/* PLUS DE BOUTON PAUSE */}

          {canValidate ? (
            <TouchableOpacity
              onPress={handleValidateTask}
              style={styles.validateButton}
            >
              <Text style={styles.validateButtonText}>
                VALIDER LA MISSION (JACKPOT)
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleGiveUp}
              style={styles.giveUpButton}
            >
              <Text style={styles.giveUpText}>J'abandonne (Honteux)</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040C1E",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Espace pour le footer
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  header: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#4AEF8C",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    textAlign: "center",
  },
  subHeader: {
    color: "#94a3b8",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  missionText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  actionPlanContainer: {
    paddingHorizontal: 24,
    marginTop: 10,
  },
  sectionTitle: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D121F",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  stepItemChecked: {
    borderColor: "rgba(74, 239, 140, 0.3)",
    backgroundColor: "rgba(74, 239, 140, 0.05)",
  },
  stepText: {
    color: "#FFFFFF",
    marginLeft: 15,
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
  stepTextChecked: {
    textDecorationLine: "line-through",
    color: "#94a3b8",
    opacity: 0.7,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 30,
    paddingTop: 20,
    backgroundColor: "#040C1E", // Cache le contenu scrollé
    gap: 15,
  },
  pauseButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  pauseButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  giveUpButton: {
    padding: 10,
  },
  giveUpText: {
    color: "#FF5252",
    textDecorationLine: "underline",
    fontSize: 14,
    opacity: 0.8,
  },
  validateButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: "#4AEF8C",
    shadowColor: "#4AEF8C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  validateButtonText: {
    color: "#040C1E",
    fontWeight: "900",
    fontSize: 16,
    textTransform: "uppercase",
  },
});
