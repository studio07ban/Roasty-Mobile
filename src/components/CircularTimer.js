import { StyleSheet, Text, Vibration, View } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

const CircularTimer = ({
  duration,
  onComplete,
  isPlaying = true,
  initialRemainingTime,
}) => {
  const formatTime = (remainingTime) => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const padding = seconds < 10 ? "0" : "";
    return `${minutes}:${padding}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <CountdownCircleTimer
        initialRemainingTime={initialRemainingTime}
        isPlaying={isPlaying}
        duration={duration}
        colors={["#4AEF8C", "#F7B801", "#A30000"]}
        colorsTime={[duration, duration / 2, 0]}
        onComplete={() => {
          Vibration.vibrate([0, 500, 300, 500, 300, 500]);
          if (onComplete) onComplete();
          return { shouldRepeat: false };
        }}
        size={240}
        strokeWidth={15}
        trailColor="#1e293b"
      >
        {({ remainingTime }) => (
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(remainingTime)}</Text>
            <Text style={styles.subText}>Focus</Text>
          </View>
        )}
      </CountdownCircleTimer>
    </View>
  );
};

export default CircularTimer;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  timeContainer: {
    alignItems: "center",
  },
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontVariant: ["tabular-nums"],
  },
  subText: {
    fontSize: 16,
    color: "#A6A6A6",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginTop: 5,
  },
});
