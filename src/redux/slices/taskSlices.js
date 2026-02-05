import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// On importe ton instance API configurée (avec le token header auto)
import api from "../../services/api";

// --- THUNKS (Actions Asynchrones) ---

// 1. Créer une tâche (Le cœur du réacteur)
export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData, { rejectWithValue }) => {
    console.log("REDUX THUNK: createTask started with data:", taskData);
    try {
      // taskData contient { description, excuse, type }
      const response = await api.post("/tasks", taskData);
      console.log("REDUX THUNK: API response received:", response.data);
      // On retourne la tâche créée (qui contient le roast !)
      return response.data.data;
    } catch (error) {
      console.error("REDUX THUNK: API Error:", error);
      return rejectWithValue({
        message: error.response?.data?.message || "Erreur lors du roast",
        status: error.response?.status,
      });
    }
  }
);

// 2. Récupérer le feed
export const getFeedTasks = createAsyncThunk(
  "tasks/getFeed",
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tasks/feed?page=${page}`);
      return response.data.data; // Supposons que ça renvoie { tasks, pagination }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur chargement feed"
      );
    }
  }
);

// 2.5 Vérifier s'il y a une tâche active ("in_progress")
// Utile pour la persistance : si l'user tue l'app et revient
export const checkActiveTask = createAsyncThunk(
  "tasks/checkActive",
  async (_, { rejectWithValue }) => {
    try {
      // On suppose un endpoint qui renvoie la tâche active s'il y en a une
      const response = await api.get("/tasks/active");
      // Si 200 OK mais null, pas de tâche. Si tâche, on la renvoie.
      return response.data.data;
    } catch (error) {
      // Si 404, c'est qu'il n'y a pas de tâche active, on ne rejette pas forcément en erreur
      if (error.response && error.response.status === 404) {
        return null;
      }
      return rejectWithValue(
        error.response?.data?.message || "Erreur check active task"
      );
    }
  }
);

// 3. Mettre à jour le statut (ex: pending -> in_progress -> done)
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ id, status, ...rest }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/tasks/${id}/status`, {
        status,
        ...rest,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur update status"
      );
    }
  }
);

// 4. Récupérer mes tâches (Historique)
export const getMyTasks = createAsyncThunk(
  "tasks/getMyTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/tasks");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur récupération de mes tâches"
      );
    }
  }
);

// 5. Toggle Visibility (Public/Private)
export const toggleTaskVisibility = createAsyncThunk(
  "tasks/toggleVisibility",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/visibility`);
      return { id: taskId, isPublic: response.data.isPublic };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur toggle visibility"
      );
    }
  }
);

// --- SLICE ---

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    currentTask: null,
    feedTasks: [],
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Actions synchrones (si besoin plus tard, ex: nettoyer l'erreur)
    clearError: (state) => {
      state.error = null;
    },
    // Utile quand on quitte l'écran de résultat pour revenir à zéro
    resetCurrentTask: (state) => {
      state.currentTask = null;
    },
    // Ajout pour permettre de définir la tâche courante depuis la liste
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Gestion de createTask ---
      .addCase(createTask.pending, (state) => {
        console.log("REDUX REDUCER: createTask.pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        console.log("REDUX REDUCER: createTask.fulfilled", action.payload);
        state.loading = false;
        // BINGO : On stocke la réponse ici.
        // L'écran suivant (RoastResult) n'aura qu'à lire state.tasks.currentTask
        state.currentTask = action.payload;
      })
      .addCase(createTask.rejected, (state, action) => {
        console.log("REDUX REDUCER: createTask.rejected", action.payload);
        state.loading = false;
        state.error = action.payload?.message || "Une erreur est survenue";
      })

      // --- Gestion de getFeedTasks (Préparation) ---
      .addCase(getFeedTasks.pending, (state) => {
        // On pourrait avoir un loading séparé feedLoading pour ne pas bloquer toute l'app
        state.loading = true;
      })
      .addCase(getFeedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedTasks = action.payload.tasks;
      })
      .addCase(getFeedTasks.rejected, (state, action) => {
        state.loading = false;
        // On ne bloque pas l'user si le feed plante, on log juste
        console.error("Feed error", action.payload);
      })

      // --- Gestion de checkActiveTask ---
      .addCase(checkActiveTask.fulfilled, (state, action) => {
        // Si une tâche active est trouvée, on la met dans currentTask
        // Ce qui permettra à l'AppNavigator de rediriger vers Focus
        if (action.payload) {
          state.currentTask = action.payload;
        }
      })
      .addCase(checkActiveTask.rejected, (state, action) => {
        // Silent fail or minimal logging, not critical to block app
        console.log("Check active task failed", action.payload);
      })

      // --- Gestion de updateTaskStatus ---
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Si c'est la tâche courante qu'on met à jour, on update le state
        if (state.currentTask && state.currentTask._id === action.payload._id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Gestion de getMyTasks ---
      .addCase(getMyTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload; // On remplit la liste
      })
      .addCase(getMyTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Gestion de toggleTaskVisibility ---
      .addCase(toggleTaskVisibility.fulfilled, (state, action) => {
        const { id, isPublic } = action.payload;
        // Update dans la liste
        const taskInList = state.tasks.find((t) => t._id === id);
        if (taskInList) {
          taskInList.isPublic = isPublic;
        }
        // Update task courante si match
        if (state.currentTask && state.currentTask._id === id) {
          state.currentTask.isPublic = isPublic;
        }
      });
  },
});

export const { clearError, resetCurrentTask, setCurrentTask } =
  taskSlice.actions;
export default taskSlice.reducer;
