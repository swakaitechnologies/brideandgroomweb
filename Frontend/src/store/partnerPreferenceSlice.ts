import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "@/services/api";

const API_URL = "/partner-preferences";

// Types corresponding to the Backend model
export interface PartnerPreferenceData {
  id?: string;
  userId?: string;
  minAge?: number;
  maxAge?: number;
  minHeight?: string;
  maritalStatus?: string[];
  diet?: string;
  education?: string;
  workSector?: string[];
  incomeRange?: string;
  religion?: string;
  caste?: string;
  casteNoBar?: boolean;
  motherTongue?: string;
  country?: string;
  city?: string; // Comma separated string or JSON string from frontend
}

export interface PartnerPreferenceState {
  data: PartnerPreferenceData | null;
  loading: boolean;
  error: string | null;
}

const initialState: PartnerPreferenceState = {
  data: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchPreferences = createAsyncThunk(
  "partnerPreference/fetchPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch preferences",
      );
    }
  },
);

export const updatePreferences = createAsyncThunk(
  "partnerPreference/updatePreferences",
  async (preferenceData: PartnerPreferenceData, { rejectWithValue }) => {
    try {
      const response = await api.put(API_URL, preferenceData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update preferences",
      );
    }
  },
);

export const resetPreferences = createAsyncThunk(
  "partnerPreference/resetPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/reset`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset preferences",
      );
    }
  },
);

const partnerPreferenceSlice = createSlice({
  name: "partnerPreference",
  initialState,
  reducers: {
    clearPreferences: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Preferences
    builder.addCase(fetchPreferences.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchPreferences.fulfilled,
      (state, action: PayloadAction<PartnerPreferenceData>) => {
        state.loading = false;
        state.data = action.payload;
      },
    );
    builder.addCase(fetchPreferences.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Preferences
    builder.addCase(updatePreferences.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updatePreferences.fulfilled,
      (state, action: PayloadAction<PartnerPreferenceData>) => {
        state.loading = false;
        state.data = action.payload;
      },
    );
    builder.addCase(updatePreferences.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Reset Preferences
    builder.addCase(resetPreferences.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resetPreferences.fulfilled, (state) => {
      state.loading = false;
      state.data = null; // Reset to null so frontend uses defaults
    });
    builder.addCase(resetPreferences.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearPreferences } = partnerPreferenceSlice.actions;
export default partnerPreferenceSlice.reducer;





