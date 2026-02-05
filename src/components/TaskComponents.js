import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const FilterTab = ({ title, value, active, onPress }) => (
  <TouchableOpacity
    style={[styles.tab, active === value && styles.activeTab]}
    onPress={() => onPress(value)}
  >
    <Text style={[styles.tabText, active === value && styles.activeTabText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export const StatusBadge = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case "abandoned":
        return { bg: "#F8D7DA", text: "#721C24", label: "🏳️ Abandon" };
      case "completed":
        return { bg: "#D4EDDA", text: "#155724", label: "✅ Fait" };
      default:
        return { bg: "#E2E3E5", text: "#383D41", label: "🛑 À faire" };
    }
  };
  const style = getStyle();
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.badgeText, { color: style.text }]}>
        {style.label}
      </Text>
    </View>
  );
};

export const EmptyState = ({ filter, navigation }) => {
  let message = "Aucune tâche ici.";
  let cta = null;
  let navigationTarget = "CreateFlow"; // Default target

  if (filter === "pending") {
    message = "Aucune excuse en attente ? C'est louche.";
    cta = "Roaster une excuse";
  } else if (filter === "abandoned") {
    message = "Aucun abandon ? Impressionnant (ou tu mens).";
  } else if (filter === "completed") {
    message = "Rien de fini... La procrastination gagne du terrain.";
  }

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{message}</Text>
      {cta && (
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate(navigationTarget)}
        >
          <Text style={styles.ctaText}>{cta}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // FilterTab Styles
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#c9ff53",
    borderColor: "transparent", // No border needed for active state in new design or maybe it is? Leaderboard just has bg.
  },
  tabText: {
    color: "#9fb6c9",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#0f172a",
    fontWeight: "bold",
  },

  // StatusBadge Styles
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: "bold" },

  // EmptyState Styles
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: {
    fontSize: 16,
    color: "#CBD5E1",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  ctaButton: {
    backgroundColor: "#4AEF8C", // Neon Green du thème
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  ctaText: { color: "#040C1E", fontWeight: "bold" },
});
