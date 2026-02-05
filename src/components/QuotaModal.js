import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; 
import { LinearGradient } from "expo-linear-gradient";

export default function QuotaModal({ visible, onNavigateToFeed, onClose }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose} 
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          <View style={styles.iconContainer}>
            <FontAwesome name="hand-stop-o" size={32} color="#bef264" />
          </View>

          <Text style={styles.title}>Quota journalier atteint</Text>
          
          <Text style={styles.message}>Tu as bien bossé ! Reviens demain ou passe Premium pour continuer à te faire roaster sans limite.</Text>

          {/* Bouton principal */}
          <TouchableOpacity 
            onPress={onNavigateToFeed} 
            activeOpacity={0.8}
            style={styles.buttonContainer}
          >
            <LinearGradient
              colors={["#bef264", "#22d3ee"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Voir le Feed</Text>

              <FontAwesome name="arrow-right" size={18} color="#0f172a" style={{ marginLeft: 10 }} />

            </LinearGradient>
          </TouchableOpacity>
          
        </View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(4, 12, 30, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: "#0D121F", 
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(190, 242, 100, 0.3)", 
    shadowColor: "#bef264",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(190, 242, 100, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#bef264", 
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF", 
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#A6A6A6", 
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
  },
  gradientButton: {
    flexDirection: "row",
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});