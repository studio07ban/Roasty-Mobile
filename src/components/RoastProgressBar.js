import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";

const BACKWARD_MESSAGES = [
  "Attends... j'ai oublié un truc.",
  "Oups, j'ai mal compté là.",
  "On peut revenir en arrière ? Trop tard. Ah bah si.",
  "Minute papillon, on recommence un bout.",
  "Je refais les calculs, bouge pas.",
];

const FORWARD_MESSAGES = [
  "Ok, on avance là. Enfin !",
  "Pas mal, tu te réveilles.",
  "On y est presque... enfin, presque presque.",
  "Je sens que tu transpires de productivité.",
  "Continue, surprends-moi.",
];

const NEAR_END_MESSAGES = [
  "Dernière ligne droite, pas de panique.",
  "Ne gâche pas tout maintenant.",
  "Encore un effort, après tu peux scroller TikTok",
  "On voit la lumière au bout du tunnel.",
];

const END_MESSAGES = [
  "Attends t'as vraiment cru que je réfléchissait ?",
  "Oh mais attends un peu j'ai pas finis !!",
  "Attends encore je réfléchis un peu...",
  "On est bien entre nous là hein ?",
];

export const RoastProgressBar = ({
  isActive = true,
  onFinished,
  label = "Chargement de ta motivation...",
}) => {
  const [progress, setProgress] = useState(0); //pourcentage de 0 à 100 qui va changer dcp
  const [message, setMessage] = useState(null); //phrase affichée pdt le chargement

  const animatedProgress = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null); //pour stocker setInterval

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress / 100,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false, // width ne supporte pas le native driver
    }).start();
  }, [progress]);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      setMessage(null); 
      return;
    }
    intervalRef.current = setInterval(() => {
      setProgress((current) => {
        if (current === 100) {
          return current;
        }

        const random = Math.random();
        let next = current;

        if (random < 0.15 && current > 20) {
          const backwardStep = 10 + Math.random() * 25;
          next = Math.max(0, current - backwardStep);

          const msg =
            BACKWARD_MESSAGES[
              Math.floor(Math.random() * BACKWARD_MESSAGES.length)
            ];
          setMessage(msg);
        } else {
          const forwardStep = 5 + Math.random() * 15; // entre 5 et 20
          next = Math.min(100, current + forwardStep);

          if (next > 80) {
            const msg =
              NEAR_END_MESSAGES[
                Math.floor(Math.random() * NEAR_END_MESSAGES.length)
              ];
            setMessage(msg);
          } else if (random > 0.6) {
            const msg =
              FORWARD_MESSAGES[
                Math.floor(Math.random() * FORWARD_MESSAGES.length)
              ];
            setMessage(msg);
          }
        }

        if (next >= 100) {
          const msg =
              END_MESSAGES[
                Math.floor(Math.random() * END_MESSAGES.length)
              ]
          setMessage(msg);

          if (onFinished) {
            onFinished();
          }
          return 100;
        }

        return next;
      });
    }, 800); // change tout les 800ms

    return () => clearInterval(intervalRef.current);
  }, [isActive, onFinished]);

  const widthInterpolation = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>

        <View style={styles.barOuter}>
          <Animated.View
            style={[styles.barInner, { width: widthInterpolation }]}
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.percentText}>{Math.round(progress)}%</Text>
          {message && <Text style={styles.messageText}>{message}</Text>}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  container: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  label: {
    color: "#E5F5FF",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
    textAlign: "center",
  },
  barOuter: {
    width: "80%",
    maxWidth: 480,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#3BFF9C",
    backgroundColor: "#020617",
    overflow: "hidden",
    shadowColor: "#3BFF9C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  barInner: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#3BFF9C",
  },
  infoRow: {
    marginTop: 8,
    alignItems: "center",
  },
  percentText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 4,
  },
  messageText: {
    color: "#3BFFDF",
    fontSize: 13,
  },
});
