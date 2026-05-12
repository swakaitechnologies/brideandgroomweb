import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";
import type { AxiosError } from "axios";

export interface Interaction {
  id: string;
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  updatedAt: string;
  profile?: {
    firstName: string;
    lastName: string;
    city: string;
    state: string;
    dob: string;
    gender: string;
    profession: string;
    isKycVerified?: boolean;
    photos?: { url: string; isMain: boolean }[];
  };
}

export interface InteractionState {
  sentInterests: Interaction[];
  receivedInterests: Interaction[];
  sentContactRequests: Interaction[];
  receivedContactRequests: Interaction[];
  loading: boolean;
  error: string | null;
}

const initialState: InteractionState = {
  sentInterests: [],
  receivedInterests: [],
  sentContactRequests: [],
  receivedContactRequests: [],
  loading: false,
  error: null,
};

export const sendInterest = createAsyncThunk(
  "interaction/sendInterest",
  async (receiverId: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/interests/send", { receiverId });
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to send interest",
      );
    }
  },
);

export const respondToInterest = createAsyncThunk(
  "interaction/respondToInterest",
  async (
    {
      interestId,
      status,
    }: { interestId: string; status: "accepted" | "declined" },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/interests/response", { interestId, status });
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to respond to interest",
      );
    }
  },
);

export const fetchInterests = createAsyncThunk(
  "interaction/fetchInterests",
  async (type: "sent" | "received", { rejectWithValue }) => {
    try {
      const response = await api.get(`/interests?type=${type}`);
      return { type, data: response.data.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch interests",
      );
    }
  },
);

export const sendContactRequest = createAsyncThunk(
  "interaction/sendContactRequest",
  async (receiverId: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/contact-requests/send", { receiverId });
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to send contact request",
      );
    }
  },
);

export const respondToContactRequest = createAsyncThunk(
  "interaction/respondToContactRequest",
  async (
    {
      requestId,
      status,
    }: { requestId: string; status: "accepted" | "declined" },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/contact-requests/response", { requestId, status });
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to respond to contact request",
      );
    }
  },
);

export const fetchContactRequests = createAsyncThunk(
  "interaction/fetchContactRequests",
  async (type: "sent" | "received", { rejectWithValue }) => {
    try {
      const response = await api.get(`/contact-requests?type=${type}`);
      return { type, data: response.data.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch contact requests",
      );
    }
  },
);

const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Sent Interest
    builder.addCase(sendInterest.fulfilled, (state, action) => {
      state.sentInterests.push(action.payload);
    });
    // Respond Interest
    builder.addCase(respondToInterest.fulfilled, (state, action) => {
      const index = state.receivedInterests.findIndex(
        (i) => i.id === action.payload.id,
      );
      if (index !== -1) state.receivedInterests[index] = action.payload;
    });
    // Fetch Interests
    builder.addCase(fetchInterests.fulfilled, (state, action) => {
      if (action.payload.type === "sent")
        state.sentInterests = action.payload.data;
      else state.receivedInterests = action.payload.data;
    });
    // Sent Contact Request
    builder.addCase(sendContactRequest.fulfilled, (state, action) => {
      state.sentContactRequests.push(action.payload);
    });
    // Respond Contact Request
    builder.addCase(respondToContactRequest.fulfilled, (state, action) => {
      const index = state.receivedContactRequests.findIndex(
        (i) => i.id === action.payload.id,
      );
      if (index !== -1) state.receivedContactRequests[index] = action.payload;
    });
    // Fetch Contact Requests
    builder.addCase(fetchContactRequests.fulfilled, (state, action) => {
      if (action.payload.type === "sent")
        state.sentContactRequests = action.payload.data;
      else state.receivedContactRequests = action.payload.data;
    });
  },
});

export default interactionSlice.reducer;





