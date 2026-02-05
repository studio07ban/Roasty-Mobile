import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  EmptyState,
  FilterTab,
  StatusBadge,
} from "../components/TaskComponents";
import {
  getMyTasks,
  setCurrentTask,
  toggleTaskVisibility,
} from "../redux/slices/taskSlices";

export default function TasksScreen({ navigation }) {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const [activeFilter, setActiveFilter] = useState("pending"); // 'pending', 'abandoned', 'completed'

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Chargement initial
  useEffect(() => {
    dispatch(getMyTasks());
  }, []);

  // Filtrage optimisé
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Logique spécifique pour l'onglet 'roasty'
      if (activeFilter === "roasty") {
        return task.type === "roasty";
      }

      // 2. Pour les autres onglets, on EXCLUT les 'roasty'
      // On ne veut voir que les 'challenge' (ou undefined qui est par défaut challenge)
      if (task.type === "roasty") return false;

      // 3. Filtrage classique par statut
      if (activeFilter === "pending") return task.status === "pending";
      if (activeFilter === "abandoned") return task.status === "abandoned";
      if (activeFilter === "completed") return task.status === "completed";

      return true;
    });
  }, [tasks, activeFilter]);

  // Interaction Logic
  const handleTaskPress = (item) => {
    // Si c'est un roast pur (Lecture seule) -> On ouvre la modale simple direct
    if (item.type === "roasty") {
      setSelectedTask(item);
      setModalVisible(true);
      return;
    }

    if (item.status === "pending") {
      // Si pending -> On set la tâche active et on lance le flow
      dispatch(setCurrentTask(item));
      navigation.navigate("RoastModal", { taskId: item._id });
    } else {
      // Si fini ou abandonné -> On affiche le roast (ou l'historique)
      setSelectedTask(item);
      setModalVisible(true);
    }
  };

  const renderTaskItem = ({ item }) => (
    <LinearGradient
      colors={["#c9ff53", "#22d3ee"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cardGradientBorder}
    >
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => handleTaskPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.taskTitle} numberOfLines={1}>
            {item.description}
          </Text>
          {item.type !== "roasty" && <StatusBadge status={item.status} />}
        </View>
        <Text style={styles.taskExcuse} numberOfLines={2}>
          💭 "{item.excuse}"
        </Text>
        {item.pointsEarned > 0 && (
          <Text style={styles.points}>+{item.pointsEarned} pts</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* --- FILTER TABS --- */}
          <View style={styles.tabsContainer}>
            <FilterTab
              title="À faire"
              value="pending"
              active={activeFilter}
              onPress={setActiveFilter}
            />
            <FilterTab
              title="Abandons"
              value="abandoned"
              active={activeFilter}
              onPress={setActiveFilter}
            />
            <FilterTab
              title="Terminé"
              value="completed"
              active={activeFilter}
              onPress={setActiveFilter}
            />
            <FilterTab
              title="Roasty"
              value="roasty"
              active={activeFilter}
              onPress={setActiveFilter}
            />
          </View>

          {/* --- LIST --- */}
          <FlatList
            data={filteredTasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => dispatch(getMyTasks())}
                tintColor="#FFFFFF"
              />
            }
            ListEmptyComponent={
              <EmptyState filter={activeFilter} navigation={navigation} />
            }
          />
        </View>

        {/* --- ROAST MODAL --- */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedTask?.status === "completed"
                  ? "🔥 Roast de Victoire"
                  : "🏳️ Roast d'Abandon"}
              </Text>
              <Text style={styles.modalText}>
                "{selectedTask?.roastContent}"
              </Text>

              {/* --- DISCREET TOGGLE VISIBILITY --- */}
              <TouchableOpacity
                style={styles.discreetToggle}
                onPress={() => {
                  const newStatus = !selectedTask.isPublic;
                  // UI Optimistic Update
                  setSelectedTask((prev) => ({ ...prev, isPublic: newStatus }));
                  // Redux Dispatch
                  dispatch(toggleTaskVisibility(selectedTask._id));
                }}
              >
                <Ionicons
                  name={selectedTask?.isPublic ? "eye" : "eye-off"}
                  size={20}
                  color={selectedTask?.isPublic ? "#4AEF8C" : "#94a3b8"}
                />
                <Text
                  style={[
                    styles.discreetToggleText,
                    { color: selectedTask?.isPublic ? "#4AEF8C" : "#94a3b8" },
                  ]}
                >
                  {selectedTask?.isPublic
                    ? "Visible dans le feed"
                    : "Roast Privé"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    // backgroundColor: "rgba(4, 12, 30, 0.85)", // Removed as per user request
  },
  container: {
    flex: 1,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginLeft: 20,
    marginBottom: 20,
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 160,
    height: 60,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(13, 18, 31, 0.6)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#c9ff53",
    marginHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  cardGradientBorder: {
    borderRadius: 14,
    padding: 1.5,
    marginBottom: 12,
    shadowColor: "#c9ff53",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  cardContent: {
    backgroundColor: "rgba(15, 23, 42, 0.9)", // Dark background
    padding: 15,
    borderRadius: 13, // slightly less than outer
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 10,
  },
  taskExcuse: {
    fontSize: 14,
    color: "#94a3b8",
    fontStyle: "italic",
  },
  points: {
    marginTop: 8,
    alignSelf: "flex-start",
    color: "#4AEF8C",
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "rgba(74, 239, 140, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#0D121F",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#4AEF8C",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4AEF8C",
    marginBottom: 16,
    textTransform: "uppercase",
  },
  modalText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
    fontStyle: "italic",
  },
  modalButton: {
    backgroundColor: "#4AEF8C",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#040C1E",
    fontWeight: "bold",
    fontSize: 16,
  },
  discreetToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    padding: 8,
  },
  discreetToggleText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});
