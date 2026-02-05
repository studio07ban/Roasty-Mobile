import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Easing, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { checkActiveTask } from "../redux/slices/taskSlices";

// --- 1. NAVIGATION IMPORTS ---
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// --- 2. SCREEN IMPORTS ---
import CompletionScreen from "../screens/CompletionScreen";
import CreateFlowScreen from "../screens/CreateFlowScreen";
import FeedScreen from "../screens/FeedScreen";
import FocusScreen from "../screens/FocusScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import LoginScreen from "../screens/LoginScreen";
import MyTasksScreen from "../screens/MyTasksScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/RegisterScreen";
import RoastResultScreen from "../screens/RoastResultScreen";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// --- Settings legal ---
import TermsScreen from "../screens/TermsScreen";
import PrivacyScreen from "../screens/PrivacyScreen";
import AboutScreen from "../screens/AboutScreen";

// --- 3. CONFIGURATION ---
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Composant vide pour l'interception du clic sur "Nouveau"
const NullComponent = () => null;

// --- COMPOSANT BOUTON PULSANT ---
const PulsingAddButton = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);

  return (
    <View
      style={{
        width: 82,
        height: 82,
        borderRadius: 50,
        backgroundColor: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 60,
        zIndex: 10,
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Neon Glow Ring */}
        <View
          style={{
            position: "absolute",
            width: 82,
            height: 82,
            borderRadius: 41,
            borderWidth: 2,
            borderColor: "#bef264",
            shadowColor: "#bef264",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 10,
            elevation: 10,
          }}
        />
        <LinearGradient
          colors={["#bef264", "#22d3ee"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 72,
            height: 72,
            borderRadius: 40,
            borderWidth: 2,
            borderColor: "#0f172a",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#bef264",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Ionicons name="add" size={55} color="#0f172a" />
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

// --- 4. DÉFINITION DES TABS (INTERNE AU FICHIER) ---
function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopWidth: 0,
          elevation: 0,
          height: 90,
          paddingBottom: 30,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#bef264",
        tabBarInactiveTintColor: "#64748b",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: "Feed",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarLabel: "Leaderboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />

      {/* Bouton central qui ouvre la modale */}
      <Tab.Screen
        name="Nouveau"
        component={NullComponent}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("CreateFlow");
          },
        })}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => <PulsingAddButton />,
        }}
      />

      <Tab.Screen
        name="Tâches"
        component={MyTasksScreen}
        options={{
          tabBarLabel: "Tâches",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// --- 5. NAVIGATEUR PRINCIPAL (EXPORT) ---
export default function AppNavigator() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const { currentTask } = useSelector((state) => state.tasks);

  // Vérification de la persistance (Tâche active ?)
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(checkActiveTask());
    }
  }, [isAuthenticated, dispatch]);

  // 2. Rediriger si on détecte une tâche en cours (persistence)
  // Note: On utilise useNavigationContainerRef pour avoir accès à isReady() et navigate()
  const navigationRef = useNavigationContainerRef();
  useEffect(() => {
    if (
      currentTask &&
      currentTask.status === "in_progress" &&
      navigationRef.isReady()
    ) {
      // On redirige vers Focus SANS possibilité de retour (reset de la stack ou replace, mais ici traverse stack)
      navigationRef.navigate("Focus");
    }
  }, [currentTask]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0f172a",
        }}
      >
        <ActivityIndicator size="large" color="#bef264" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // --- UTILISATEUR CONNECTÉ ---
          <>
            <Stack.Screen name="Main" component={MainAppTabs} />
            {/* Pages Paramètres & Légal (Header activé pour le bouton retour) */}
            <Stack.Screen
              name="Terms"
              component={TermsScreen}
              options={{
                headerShown: true,
                title: "CGU",
                headerTransparent: true, // Couleur de ton Design System
                headerTintColor: "#fff", // Texte blanc
                headerBackTitleVisible: false, // Cache le texte "Retour" sur iOS (plus propre)
              }}
            />
            <Stack.Screen
              name="Privacy"
              component={PrivacyScreen}
              options={{
                headerShown: true,
                title: "Confidentialité",
                headerTransparent: true,
                headerTintColor: "#fff",
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen
              name="About"
              component={AboutScreen}
              options={{
                headerShown: true,
                title: "À propos",
                headerTransparent: true,
                headerTintColor: "#fff",
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Group
              screenOptions={{ presentation: "modal", headerShown: false }}
            >
              <Stack.Screen name="CreateFlow" component={CreateFlowScreen} />
              <Stack.Screen name="RoastModal" component={RoastResultScreen} />
            </Stack.Group>
            <Stack.Screen
              name="Focus"
              component={FocusScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="CompletionScreen"
              component={CompletionScreen}
              options={{
                gestureEnabled: false,
                presentation: "fullScreenModal", // Empêche le swipe down "page sheet" sur iOS
              }}
            />
          </>
        ) : (
          // --- UTILISATEUR NON CONNECTÉ ---
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
