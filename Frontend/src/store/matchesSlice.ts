import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MatchData } from "@/components/matches/MatchCard";

export interface MatchesState {
  shortlisted: MatchData[];
  recentlyViewed: MatchData[];
  liked: MatchData[]; // Full profile data of liked profiles
}

const initialState: MatchesState = {
  shortlisted: [],
  recentlyViewed: [],
  liked: [],
};

const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    toggleShortlist: (state, action: PayloadAction<MatchData>) => {
      const index = state.shortlisted.findIndex(
        (m) => m.id === action.payload.id,
      );
      if (index >= 0) {
        state.shortlisted.splice(index, 1);
      } else {
        state.shortlisted.push(action.payload);
      }
    },
    toggleLike: (state, action: PayloadAction<MatchData>) => {
      const index = state.liked.findIndex((m) => m.id === action.payload.id);
      if (index >= 0) {
        state.liked.splice(index, 1);
      } else {
        state.liked.push(action.payload);
      }
    },
    clearShortlist: (state) => {
      state.shortlisted = [];
    },
    addToRecentlyViewed: (state, action: PayloadAction<MatchData>) => {
      // Remove if already exists to move it to the top
      state.recentlyViewed = state.recentlyViewed.filter(
        (m) => m.id !== action.payload.id,
      );
      // Add to start
      state.recentlyViewed.unshift(action.payload);
      // Keep only last 100
      if (state.recentlyViewed.length > 100) {
        state.recentlyViewed.pop();
      }
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
    },
  },
});

export const {
  toggleShortlist,
  toggleLike,
  clearShortlist,
  addToRecentlyViewed,
  clearRecentlyViewed,
} = matchesSlice.actions;
export default matchesSlice.reducer;





