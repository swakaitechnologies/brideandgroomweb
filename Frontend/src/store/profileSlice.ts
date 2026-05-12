import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "@/services/api";
import type { AxiosError } from "axios";

// Define the API URL
const API_URL = "/profile";

// Types corresponding to the Backend model
export interface ProfileData {
  id?: string;
  userId?: string;
  customId?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  height?: string;
  weight?: string;
  maritalStatus?: string;
  gender?: string;
  isGenderLocked?: boolean;
  createdBy?: string;
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  relocate?: string;
  religion?: string;
  caste?: string;
  subCaste?: string;
  motherTongue?: string;
  culture?: string;
  highestDegree?: string;
  college?: string;
  profession?: string;
  industry?: string;
  company?: string;
  income?: string;
  familyType?: string;
  familyLocation?: string;
  familyAbout?: string;
  fatherStatus?: string;
  motherStatus?: string;
  siblings?: string;
  brothers?: string;
  sisters?: string;
  diet?: string;
  smoking?: string;
  drinking?: string;
  activity?: string;
  bio?: string;
  hobby?: string;
  hobbies?: string;
  expectations?: string;
  lookingFor?: string;
  preferredAge?: string;
  preferredLocation?: string;
  dealBreakers?: string;
  mobile?: string;
  email?: string;
  contactTime?: string;
  horoscopeDob?: string;
  horoscopeTime?: string;
  horoscopePlace?: string;
  zodiacSign?: string;
  verificationStatus?: string;
  rejectionReason?: string;
  isKycVerified?: boolean;
  photosLocked?: boolean;
  photos?: { url: string; isMain: boolean; isLocked?: boolean }[];
  socialLinks?: Record<string, string>;
  partnerPreference?: {
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
    city?: string;
  };
  user?: {
    isOnline: boolean;
    lastSeen: string;
  };
}

export interface SuccessStory {
  id: string;
  partnerOneName: string;
  partnerTwoName: string;
  story: string;
  image?: string;
  weddingDate?: string;
}

export interface ProfileState {
  data: ProfileData | null;
  allProfiles: ProfileData[];
  searchResults: ProfileData[];
  selectedProfile: ProfileData | null;
  viewers: ProfileData[];
  dailyPicks: ProfileData[];
  successStories: SuccessStory[];
  filterMetadata: Record<string, string[]> | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  allProfiles: [],
  searchResults: [],
  selectedProfile: null,
  viewers: [],
  dailyPicks: [],
  successStories: [],
  filterMetadata: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

export const fetchAllProfiles = createAsyncThunk(
  "profile/fetchAllProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/all`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch matches",
      );
    }
  },
);

export const fetchProfileById = createAsyncThunk(
  "profile/fetchProfileById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile details",
      );
    }
  },
);

export const fetchWhoViewedMe = createAsyncThunk(
  "profile/fetchWhoViewedMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/viewers`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch viewers",
      );
    }
  },
);

export const fetchDailyPicks = createAsyncThunk(
  "profile/fetchDailyPicks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/daily-picks`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch daily picks",
      );
    }
  },
);

export const fetchSuccessStories = createAsyncThunk(
  "profile/fetchSuccessStories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/stories");
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch success stories",
      );
    }
  },
);

export const fetchFilterMetadata = createAsyncThunk(
  "profile/fetchFilterMetadata",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/metadata`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch filter metadata",
      );
    }
  },
);

export const searchProfiles = createAsyncThunk(
  "profile/searchProfiles",
  async (params: Record<string, string | number | boolean>, { rejectWithValue }) => {
    try {
      // Filter out 'any' values and empty strings to keep URL clean
      const filteredParams = Object.keys(params).reduce((acc: Record<string, string | number | boolean>, key) => {
        if (params[key] && params[key] !== "any") {
          acc[key] = params[key];
        }
        return acc;
      }, {});

      const response = await api.get(`${API_URL}/search`, {
        params: filteredParams,
      });
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to search profiles",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData: ProfileData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URL, profileData);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProfile.fulfilled,
      (state, action: PayloadAction<ProfileData>) => {
        state.loading = false;
        state.data = action.payload;
      },
    );
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateProfile.fulfilled,
      (state, action: PayloadAction<ProfileData>) => {
        state.loading = false;
        state.data = action.payload;
      },
    );
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch All Profiles
    builder.addCase(fetchAllProfiles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchAllProfiles.fulfilled,
      (state, action: PayloadAction<ProfileData[]>) => {
        state.loading = false;
        state.allProfiles = action.payload;
      },
    );
    builder.addCase(fetchAllProfiles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Profile By ID
    builder.addCase(fetchProfileById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProfileById.fulfilled,
      (state, action: PayloadAction<ProfileData>) => {
        state.loading = false;
        state.selectedProfile = action.payload;
      },
    );
    builder.addCase(fetchProfileById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Who Viewed Me
    builder.addCase(fetchWhoViewedMe.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchWhoViewedMe.fulfilled,
      (state, action: PayloadAction<ProfileData[]>) => {
        state.loading = false;
        state.viewers = action.payload;
      },
    );
    builder.addCase(fetchWhoViewedMe.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Search Profiles
    builder.addCase(searchProfiles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      searchProfiles.fulfilled,
      (state, action: PayloadAction<ProfileData[]>) => {
        state.loading = false;
        state.searchResults = action.payload;
      },
    );
    builder.addCase(searchProfiles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    // Daily Picks
    builder.addCase(fetchDailyPicks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchDailyPicks.fulfilled,
      (state, action: PayloadAction<ProfileData[]>) => {
        state.loading = false;
        state.dailyPicks = action.payload;
      },
    );
    builder.addCase(fetchDailyPicks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Success Stories
    builder.addCase(fetchSuccessStories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchSuccessStories.fulfilled,
      (state, action: PayloadAction<SuccessStory[]>) => {
        state.loading = false;
        state.successStories = action.payload;
      },
    );
    builder.addCase(fetchSuccessStories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Filter Metadata
    builder.addCase(fetchFilterMetadata.fulfilled, (state, action) => {
      state.filterMetadata = action.payload;
    });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;





