# 🔥 Roast My Excuses - Mobile App (MVP)

🧠 Voir le Repository Backend : [Lien vers le repo backend](https://github.com/studio07ban/Roasty-Backend.git)

---

<p align="center">
  <img width="585" height="1266" alt="Image" src="https://github.com/user-attachments/assets/93ba5abf-4d62-45dc-b23e-8e4fa5fe28c8" />
</p>

> **"Arrête de te mentir. Laisse l'IA le faire pour toi."**

Bienvenue sur le repo mobile de **Roast My Excuses**. Une application conçue pour humilier ta procrastination avec humour et bienveillance (ou pas).

---

## 📱 Fonctionnalités Clés (MVP)

### 1. **L'IA Roast Master (Double Personnalité)**

- **Mode Roasty** 💀 : Le mode "Sauvage". Envoie ton excuse, reçois une humiliation technique et violente. Zéro pitié.
- **Mode Challenge** 🏋️‍♂️ : Le mode "Coach Exaspéré". L'IA se moque de toi gentiment et te donne 3 étapes simples pour démarrer.

### 2. **Le Feed de la Honte**

- **Top Roast** 🏆 : Le roast le plus liké est épinglé en mode "Gold" tout en haut. La gloire par l'humiliation.
- **Fil Chronologique** : Découvre les dernières excuses des autres utilisateurs.
- **Onglet Amis** : Un fil privé réservé à tes potes (si tu en as, sinon c'est vide comme ta vie sociale).

### 3. **Classement & Gamification**

- **Leaderboard** : Grimpe les échelons de la "Honte" (ProEndormi, ProCrastinateur, ProFlemmard, ProActif).
- **Series** : Preserve ta série de roasts ou abandonne comme d'habitude.
- **Points** : Gagne des points en essayant d'être productif pour une fois.

### 4. **Confidentialité Totale**

- **Mode Fantôme** 👻 : Un switch global pour disparaître du feed si tu as trop honte.
- **Discrétion par Tâche** 👁️ : Cache un roast spécifique si celui là pique trop pour toi.

---

## 🛠 Stack Technique

- **Framework** : React Native (Expo SDK 50+)
- **State Management** : Redux Toolkit (avec Persist)
- **UI/UX** : Expo Linear Gradient, Vector Icons, Styles néons custom
- **Navigation** : React Navigation (Stack)
- **Backend Connexion** : Axios

---

## 🚀 Installation & Lancement

### 1. Pré-requis

- **Node.js** (v18+)
- **Expo Go** installé sur ton téléphone (ou Simulateur iOS/Android).
- Le backend (`roast-my-excuses-backend`) doit tourner en local ou être déployé.

### 2. Setup

```bash
# Cloner le repo
git clone https://github.com/HrodWolfS/roast-my-excuses-mobile.git
cd roast-my-excuses-mobile

# Installer les dépendances
npm install
```

### 3. Configuration Env

Crée un fichier `.env` à la racine (ou utilise `EXPO_PUBLIC_API_URL`) :

```env
EXPO_PUBLIC_API_URL=http://TON_IP_LOCALE:3000
```

### 4. Démarrage

```bash
npx expo start
```

Scanne le QR Code avec Expo Go.

---

## 🧪 Tests

Le projet utilise **Jest** pour les tests unitaires.

```bash
npm test
```

---

## 📂 Structure du Projet

```
src/
├── components/   # Boutons, Cartes, Modales réutilisables
├── navigation/   # AppNavigator (Routes)
├── redux/        # Slices (Auth, Feed, Tasks)
├── screens/      # Écrans (Login, Feed, Profile...)
├── services/     # API (Axios + Interceptors)
└── constants/    # Textes légaux, thèmes
```

---

_Fait avec ❤️ et beaucoup de sarcasme pour s'adresser à n'importe qui, qui souhaite faire n'importe quoi._

---

<p align="center">
  <img width="585" height="1266" alt="Image" src="https://github.com/user-attachments/assets/d078332b-49ed-4607-af72-7476b5a09bbb" />
</p>
