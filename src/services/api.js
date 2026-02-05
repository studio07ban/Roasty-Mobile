import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Sur Android Emulator, 10.0.2.2 = L'ordinateur qui fait tourner l'émulateur
// Sur iOS Simulator, localhost fonctionne
// Sur un vrai téléphone, il faut ton IP locale
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    timeout: 10000,
  },
});

// Interceptor pour ajouter le token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
