import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const getFeed = createAsyncThunk(
  "feed/getFeed",
  async (scope = "global", { rejectWithValue }) => {
    try {
      // scope peut être 'global' ou 'friends'
      const res = await api.get(`/feed?scope=${scope}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur chargement feed"
      );
    }
  }
);

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    items: [],
    feedLoading: false,
    feedError: null,
  },
  reducers: {
    clearFeedError: (state) => {
      state.feedError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.items = action.payload || [];
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError = action.payload || "Erreur chargement feed";
      });
  },
});

export const { clearFeedError } = feedSlice.actions;
export default feedSlice.reducer;
