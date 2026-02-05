import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLayoutEffect, useState } from "react";
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView
} from "react-native";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { RoastProgressBar } from "../components/RoastProgressBar";
import { createTask } from "../redux/slices/taskSlices";

import QuotaModal from "../components/QuotaModal";

// Design System Colors
const COLORS = {
  background: "#040C1E",
  card: "#0D121F",
  primary: "#4AEF8C",
  secondary: "#40FAEF",
  text: "#FFFFFF",
  textSecondary: "#A6A6A6",
  danger: "#FF5252",
};

export default function CreateFlowScreen({ navigation }) {
  // 1. État Local
  const [task, setTask] = useState("");
  const [excuse, setExcuse] = useState("");
  const [mode, setMode] = useState("challenge");
  const [errors, setErrors] = useState({ task: null, excuse: null });
  const [isQuotaModalVisible, setQuotaModalVisible] = useState(false);

  const dispatch = useDispatch();
  const { loading, error: apiError } = useSelector((state) => state.tasks);

  // 2. Configuration du Header (Croix de fermeture)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // 3. Logique de Validation
  const validate = () => {
    let isValid = true;
    let newErrors = { task: null, excuse: null };

    if (task.trim().length < 10) {
      newErrors.task = "La tâche doit faire au moins 10 caractères.";
      isValid = false;
    }

    if (excuse.trim().length < 5) {
      newErrors.excuse = "L'excuse doit faire au moins 5 caractères.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 4. Handler de Soumission modififé pour Redux
  const handleSubmit = async () => {
    if (!validate()) return;
    const taskData = {
      description: task,
      excuse: excuse,
      type: mode,
    };

    try {
      await dispatch(createTask(taskData)).unwrap();
      navigation.navigate("RoastModal");
      setTask("");
      setExcuse("");
    } catch (err) {
      console.error("Erreur création task:", err);
      if (err.status === 403) {
        setQuotaModalVisible(true);
      }
    }
  };

  if (loading) {
    return (
      <RoastProgressBar
        isActive={true}
        label="Analyse de ton incompétence à venir..."
      />
    );
  }

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nouvelle Excuse</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={28} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <KeyboardDismissWrapper>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }} 
            keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
          >
            <ScrollView 
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled" 
            >
            <View style={styles.formContainer}>
              {/* INPUT TÂCHE */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tâche à éviter</Text>
                <TextInput
                  multiline={true}
                  numberOfLines={3}
                  style={[styles.input, errors.task && styles.inputError]}
                  placeholder="Ex: Finir le rapport trimestriel..."
                  placeholderTextColor="#9fb6c9"
                  value={task}
                  onChangeText={(t) => {
                    setTask(t);
                    if (errors.task) setErrors({ ...errors, task: null });
                  }}
                  maxLength={120}
                />
                {errors.task && (
                  <Text style={styles.errorText}>{errors.task}</Text>
                )}
                <Text style={styles.charCounter}>{task.length}/120</Text>
              </View>

              {/* INPUT EXCUSE */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Excuse / Raison</Text>
                <TextInput
                  multiline={true}
                  numberOfLines={3}
                  style={[styles.input, errors.excuse && styles.inputError]}
                  placeholder="Ex: J'ai poney aquatique..."
                  placeholderTextColor="#9fb6c9"
                  value={excuse}
                  onChangeText={(t) => {
                    setExcuse(t);
                    if (errors.excuse) setErrors({ ...errors, excuse: null });
                  }}
                  maxLength={80}
                />
                {errors.excuse && (
                  <Text style={styles.errorText}>{errors.excuse}</Text>
                )}
                <Text style={styles.charCounter}>{excuse.length}/80</Text>
              </View>

              {/* TOGGLE MODE */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleOption,
                    mode === "challenge" && styles.toggleActive,
                  ]}
                  onPress={() => setMode("challenge")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      mode === "challenge" && styles.toggleTextActive,
                    ]}
                  >
                    Challenge
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.toggleOption,
                    mode === "roasty" && styles.toggleActive,
                  ]}
                  onPress={() => setMode("roasty")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      mode === "roasty" && styles.toggleTextActive,
                    ]}
                  >
                    Roasty
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>
                {mode === "challenge"
                  ? "Reçois un plan d'action et lance un timer."
                  : "Juste un roast brutal pour rire."}
              </Text>
            </View>
            </ScrollView>
            {/* BOUTON VALIDER */}
            <View style={styles.footer}>
              {/* Affichage de l'erreur API si elle existe */}
              {apiError && (
                <Text
                  style={{
                    color: COLORS.danger,
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  {apiError}
                </Text>
              )}

              <TouchableOpacity
                style={[
                  styles.submitButtonContainer,
                  loading && { opacity: 0.7 },
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <LinearGradient
                  colors={["#bef264", "#22d3ee"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButtonGradient}
                >
                  <Text style={styles.submitButtonText}>
                    {loading ? "Chargement..." : "Valider"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </KeyboardDismissWrapper>
      </View>
      <QuotaModal
        visible={isQuotaModalVisible}
        onClose={() => setQuotaModalVisible(false)}
        onNavigateToFeed={() => {
          setQuotaModalVisible(false);
          navigation.navigate("Main", { screen: "Feed" });
        }}
      />
    </ImageBackground>
  );
}

// Wrapper pour gérer le dismiss keyboard uniquement sur mobile
// Sur Web, TouchableWithoutFeedback peut bloquer le focus des inputs
const KeyboardDismissWrapper = ({ children }) => {
  if (Platform.OS === "web") {
    return <View style={{ flex: 1 }}>{children}</View>;
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {children}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.card,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "transparent",
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    color: "#dce8f7",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "transparent",
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "#c9ff53",
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: "#dce8f7",
    fontSize: 15,
    shadowColor: "#c9ff53",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    minHeight: 50,
    textAlignVertical: "top", // Pour l'alignement du multiline
  },
  inputError: {
    borderColor: COLORS.danger,
    shadowColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    fontWeight: "bold",
  },
  charCounter: {
    color: "#9fb6c9",
    fontSize: 12,
    textAlign: "right",
    marginTop: 5,
    marginRight: 5,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(13, 18, 31, 0.6)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#c9ff53",
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  toggleActive: {
    backgroundColor: "#c9ff53",
  },
  toggleText: {
    color: "#9fb6c9",
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#0f172a",
    fontWeight: "bold",
  },
  helperText: {
    color: "#9fb6c9",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  footer: {
    padding: 20,
    borderTopWidth: 0,
  },
  submitButtonContainer: {
    shadowColor: "#26f0ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    borderRadius: 16,
  },
  submitButtonGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
