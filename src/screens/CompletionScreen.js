import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const CompletionScreen = ({ navigation, route }) => {
  // isSuccess : true (validé) ou false (abandonné)
  const { 
    isSuccess = false, 
    pointsEarned = 0, 
    isLevelUp = false 
  } = route.params || {};

  const confettiRef = useRef(null);

  // Si succès => confettis au lancement
  useEffect(() => {
    if (isSuccess && confettiRef.current?.start) {
      confettiRef.current.start();
    }
  }, [isSuccess]);

  const handleGoHome = () => {
    // Reset de la navigation 
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }], // Feed
    });
  };

  const handleNewTask = () => {
    // reset la pile de navigation => écran de création
    navigation.reset({
      index: 1,
      routes: [{ name: 'Main' }, { name: 'CreateFlow' }],
    });
  };

  // --- CONTENU DYNAMIQUE ---
  const themeColor = isSuccess ? '#4AEF8C' : '#FF5252'; // Vert ou Rouge
  const iconName = isSuccess ? 'trophy' : 'skull';
  const titleText = isSuccess ? 'MISSION ACCOMPLIE' : 'ÉCHEC DE LA MISSION';
  const subTitleText = isSuccess ? 'La dopamine coule à flots !' : 'La flemme a gagné... pour cette fois.';

  return (
    <View style={styles.container}>
      
      {/* CANON A CONFETTIS (if isSuccess) */}
      {isSuccess && (
        <ConfettiCannon
          ref={confettiRef}
          count={200}
          origin={{ x: -10, y: 0 }} // Depuis le coin haut gauche
          autoStart={false} 
          fadeOut
          fallSpeed={3000}
        />
      )}

      <SafeAreaView style={styles.content}>
        
        {/* GROS ICONE CENTRAL */}
        <View style={[styles.iconContainer, { borderColor: themeColor, shadowColor: themeColor }]}>
          <Ionicons name={iconName} size={80} color={themeColor} />
        </View>

        {/* TEXTES */}
        <Text style={[styles.title, { color: themeColor }]}>{titleText}</Text>
        <Text style={styles.subtitle}>{subTitleText}</Text>

        {/* SCORE BOARD */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Points gagnés</Text>
          <Text style={[styles.scoreValue, { color: isSuccess || pointsEarned > 0 ? '#fff' : '#888' }]}>
            {pointsEarned > 0 ? `+${pointsEarned}` : '0'}
          </Text>
        </View>

        {/* NOTIFICATION LEVEL UP */}
        {isLevelUp && (
          <View style={styles.levelUpBanner}>
            <Text style={styles.levelUpText}> NIVEAU SUPÉRIEUR ATTEINT !</Text>
          </View>
        )}

        {/* ACTIONS */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: themeColor }]} 
            onPress={handleGoHome}
          >
            <Text style={styles.primaryButtonText}>Retour au QG</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNewTask} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Nouvelle Mission</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040C1E',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#0D121F',
    borderRadius: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  scoreLabel: {
    color: '#94a3b8',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  levelUpBanner: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)', // Or transparent
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  levelUpText: {
    color: '#FFD700', // Or
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  footer: {
    width: '100%',
    gap: 15,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#040C1E',
    fontWeight: '900',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default CompletionScreen;