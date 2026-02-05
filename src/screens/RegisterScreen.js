import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { clearError, registerUser } from "../redux/slices/authSlice";

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();

  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Mémoire locale
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  // Redirection si authentifié (ici désactivée car pas d'auth)
  useEffect(() => {
    if (isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }], // Assuming TabNavigator is the main one
      });
    }
  }, [isAuthenticated, navigation]);

  const validateInputs = () => {
    if (!userName || !email || !password) {
      setLocalError("Remplis tout, ne commence pas à flemmarder.");
      return false;
    }

    if (userName.length < 3) {
      setLocalError("Ton blaze doit faire au moins 3 caractères.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError("Ton email est aussi faux que tes excuses.");
      return false;
    }

    if (password.length < 8) {
      setLocalError("8 caractères minimum. T'as la flemme même pour ça ?");
      return false;
    }

    return true;
  };

  const handleRegister = () => {
    setLocalError("");
    dispatch(clearError());

    if (!validateInputs()) return;

    dispatch(registerUser({ userName, email, password }));
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(4,11,22,0.35)", "rgba(4,11,22,0.8)"]}
        style={styles.gradientOverlay}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.inner}>
            <View style={styles.logoBlock}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.brand}>RoastMyExcuses</Text>
              <Text style={styles.tagline}>
                La procrastination s'arrête ici.
              </Text>
            </View>

            {localError || error ? (
              <Text style={styles.errorText}>{localError || error}</Text>
            ) : null}

            <View style={styles.form}>
              <Text style={styles.label}>Pseudo</Text>
              <TextInput
                style={styles.input}
                placeholder="bossdelaflemme"
                placeholderTextColor="#9fb6c9"
                value={userName}
                onChangeText={setUserName}
                autoCapitalize="none"
              />

              <Text style={[styles.label, { marginTop: 14 }]}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="boss@flemme.com"
                placeholderTextColor="#9fb6c9"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={[styles.label, { marginTop: 14 }]}>
                Mot de passe
              </Text>
              <TextInput
                style={styles.input}
                placeholder="8 caractères minimum"
                placeholderTextColor="#9fb6c9"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={styles.cta}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#c9ff53", "#26f0ff"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.ctaGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#0b0b0b" />
                  ) : (
                    <Text style={styles.ctaText}>S'INSCRIRE</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.bottomLink}>
                  Déjà un compte ?{" "}
                  <Text style={styles.bottomLinkAccent}>SE CONNECTER</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 30,
    justifyContent: "center",
  },
  logoBlock: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 180,
    height: 150,
    marginBottom: 1,
  },
  brand: {
    fontSize: 28,
    fontWeight: "800",
    color: "#dce8f7",
  },
  tagline: {
    marginTop: 6,
    color: "#26f0ff",
    fontSize: 15,
  },
  form: {
    backgroundColor: "transparent",
    borderRadius: 16,
    padding: 18,
  },
  label: {
    color: "#dce8f7",
    marginBottom: 6,
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
  },
  cta: {
    marginTop: 34,
    shadowColor: "#26f0ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    borderRadius: 16, // Added to match gradient radius
  },
  ctaGradient: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    color: "#0b0b0b",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  errorText: {
    color: "rgba(245, 8, 8, 0.75)",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "700",
    backgroundColor: "rgba(241, 91, 91, 0.1)",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(236, 34, 34, 0.5)",
  },
  linkButton: {
    marginTop: 14,
    alignItems: "center",
  },
  bottomLink: {
    color: "#7ea3c9",
    fontSize: 13,
  },
  bottomLinkAccent: {
    color: "#c9ff53",
    fontWeight: "800",
  },
});
