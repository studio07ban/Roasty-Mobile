import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const ROW_HEIGHT = 64;

export function TabButton({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tabButton, active ? styles.tabButtonActive : null]}
    >
      <Text style={[styles.tabText, active ? styles.tabTextActive : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function LeaderboardRow({ item, isMe }) {
  const isTopThree = item.rank <= 3;
  const badgeStyle =
    item.rank === 1
      ? styles.rankBadgeGold
      : item.rank === 2
      ? styles.rankBadgeSilver
      : item.rank === 3
      ? styles.rankBadgeBronze
      : null;

  return (
    <LinearGradient
      colors={["#c9ff53", "#22d3ee"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.rowGradientBorder, isMe && styles.rowGradientBorderMe]}
    >
      <View style={[styles.rowContent, isMe && styles.rowContentMe]}>
        {isTopThree ? (
          <View style={[styles.rankBadge, badgeStyle]}>
            <Text style={[styles.rankText, styles.rankTextTop]}>
              {item.rank}.
            </Text>
          </View>
        ) : (
          <Text style={styles.rankText}>{item.rank}.</Text>
        )}

        <View style={styles.userBlock}>
          <Text style={[styles.username, isMe ? styles.usernameMe : null]}>
            {item.username}
          </Text>
        </View>

        <Text style={styles.points}>{item.points} pts</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // --- TABS STYLES ---
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: "#c9ff53",
  },
  tabText: {
    color: "#9fb6c9",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#0f172a",
    fontWeight: "bold",
  },

  // --- ROW STYLES ---
  rowGradientBorder: {
    borderRadius: 14,
    padding: 1.5,
    marginBottom: 10,
    shadowColor: "#c9ff53",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  rowGradientBorderMe: {
    shadowColor: "#22d3ee", // Cyan neon shadow
    shadowOpacity: 0.6,
  },
  rowContent: {
    height: ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 13,
    backgroundColor: "rgba(15, 23, 42, 0.95)", // Almost opaque dark
  },
  rowContentMe: {
    backgroundColor: "rgba(15, 23, 42, 0.95)", // Same as others, no distinct background
  },

  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18, // Circle
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  rankBadgeGold: {
    backgroundColor: "#FDB931", // Gold
    borderColor: "#FFD700",
    shadowColor: "#FFD700",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  rankBadgeSilver: {
    backgroundColor: "#D7D7D7", // Silver
    borderColor: "#E0E0E0",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  rankBadgeBronze: {
    backgroundColor: "#A77044", // Bronze
    borderColor: "#CD7F32",
    shadowColor: "#CD7F32",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  rankText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
    marginRight: 10,
  },
  rankTextTop: {
    color: "#0f172a", // Dark text on bright badges
    textShadowColor: "rgba(255,255,255,0.5)",
    textShadowRadius: 1,
    marginRight: 0,
  },
  userBlock: {
    flex: 1,
  },
  username: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  usernameMe: {
    color: "#22d3ee", // Cyan text for me
    fontWeight: "900",
    fontSize: 16,
    textShadowColor: "rgba(34, 211, 238, 0.5)",
    textShadowRadius: 8,
  },
  points: {
    width: 110,
    color: "#c9ff53",
    textAlign: "right",
    fontWeight: "800",
  },
});
