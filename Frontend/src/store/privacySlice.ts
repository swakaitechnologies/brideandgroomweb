import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "@/services/api";

const API_URL = "/privacy";

// Types corresponding to the Backend model
export interface PrivacySettings {
  id?: string;
  userId?: string;
  profileVisibility: "Everyone" | "Members" | "Interacted";
  photoVisibility: "All" | "Verified" | "Selected" | "None";
  photoLock: boolean;
  phoneVisibility: "Hidden" | "Matches" | "Paid";
  emailVisibility: "Hidden" | "Matches";
  twoFactorEnabled: boolean;
  isDeactivated: boolean;
}

export interface PrivacyState {
  data: PrivacySettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: PrivacyState = {
  data: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchPrivacySettings = createAsyncThunk(
  "privacy/fetchPrivacySettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch privacy settings",
      );
    }
  },
);

export const updatePrivacySettings = createAsyncThunk(
  "privacy/updatePrivacySettings",
  async (settings: Partial<PrivacySettings>, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URL, settings);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update privacy settings",
      );
    }
  },
);

const privacySlice = createSlice({
  name: "privacy",
  initialState,
  reducers: {
    clearPrivacySettings: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Settings
    builder.addCase(fetchPrivacySettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchPrivacySettings.fulfilled,
      (state, action: PayloadAction<PrivacySettings>) => {
        state.loading = false;
        state.data = action.payload;
      },
    );
    builder.addCase(fetchPrivacySettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Settings
    builder.addCase(updatePrivacySettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updatePrivacySettings.fulfilled,
      (state, action: PayloadAction<PrivacySettings>) => {
        state.loading = false;
        state.data = action.payload;
      },
    );
    builder.addCase(updatePrivacySettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearPrivacySettings } = privacySlice.actions;
export default privacySlice.reducer;





