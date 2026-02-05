import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { clearError, loginUser } from "../redux/slices/authSlice";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  const handleLogin = () => {
    setLocalError(null);
    dispatch(clearError());

    if (email.length === 0 || password.length === 0) {
      setLocalError(
        "Nan, t'as vraiment pas le droit d'avoir autant la flemme."
      );
      return;
    }

    /* Useless gérer dans le back et empeche de se log par UserName.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError("On a pas les yeux en face des trous?");
      return;
    }
    */

    dispatch(loginUser({ email, password })).then((resultAction) => {
      if (loginUser.fulfilled.match(resultAction)) {
        setEmail("");
        setPassword("");
        /*navigation.navigate("Main");
        Quand l'utilisateur se connecte il obtient un token 
         qui l'envoie direct sur le Main, 
         pas besoin de nav en plus :)*/
      }
    });
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      resizeMode="cover"
      style={styles.background}
    >
      <LinearGradient
        colors={["rgba(4,11,22,0.35)", "rgba(4,11,22,0.8)"]}
        style={styles.gradientOverlay}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.inner}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoBlock}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.brand}>RoastMyExcuses</Text>
              <Text style={styles.tagline}>
                La procrastination s'arrête ici.
              </Text>
            </View>

            {(localError || error) && (
              <Text style={styles.errorText}>{localError || error}</Text>
            )}

            <View style={styles.form}>
              <Text style={styles.label}>Email ou Username</Text>
              <TextInput
                style={styles.input}
                placeholder="boss@flemme.com"
                placeholderTextColor="#9fb6c9"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={[styles.label, { marginTop: 14 }]}>
                Mot de passe
              </Text>
              <TextInput
                style={styles.input}
                placeholder="unvraimotdepasse"
                placeholderTextColor="#9fb6c9"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />

              <TouchableOpacity>
                <Text style={styles.forgotPassword}>
                  Mot de passe oublié ? Tant pis pour toi. Vilain.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cta}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#bef264", "#22d3ee"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#0f172a" />
                  ) : (
                    <Text style={styles.ctaText}>SE CONNECTER</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={styles.bottomLink}>
                  Pas encore de compte ?{" "}
                  <Text style={styles.bottomLinkAccent}>CRÉER UN COMPTE</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  inner: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 30,
  },
  logoBlock: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 180,
    height: 150,
    marginTop: 10,
    marginBottom: 10,
    resizeMode: "contain",
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
    padding: 10,
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
  forgotPassword: {
    color: "#38bdf8",
    textAlign: "right",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 30,
  },
  cta: {
    marginTop: 34,
    shadowColor: "#26f0ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    borderRadius: 16,
  },
  ctaGradient: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    color: "#0f172a",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 1,
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
    marginTop: 20,
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
