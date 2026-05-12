import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";
import type { AxiosError } from "axios";

const API_URL = "/messages";

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatPartner {
  userId: string;
  profile: {
    firstName: string;
    lastName: string;
    gender: string;
    isKycVerified?: boolean;
    photos?: { url: string; isMain: boolean }[];
  };
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
  isBlocked?: boolean;
  iBlocked?: boolean;
}

export interface ChatState {
  chatList: ChatPartner[];
  activeChatMessages: Message[];
  loading: boolean;
  error: string | null;
  // Floating UI State
  isFloatingOpen: boolean;
  isFloatingMinimized: boolean;
  floatingActivePartnerId: string | null;
}

const initialState: ChatState = {
  chatList: [],
  activeChatMessages: [],
  loading: false,
  error: null,
  isFloatingOpen: false,
  isFloatingMinimized: false,
  floatingActivePartnerId: null,
};

export const fetchChatList = createAsyncThunk(
  "chat/fetchChatList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/list`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch chat list",
      );
    }
  },
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (otherUserId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${otherUserId}`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch messages",
      );
    }
  },
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { receiverId, content }: { receiverId: string; content: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(`${API_URL}/send`, { receiverId, content });
      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to send message",
      );
    }
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.activeChatMessages.push(action.payload);
    },
    setFloatingOpen: (state, action: PayloadAction<boolean>) => {
      state.isFloatingOpen = action.payload;
    },
    setFloatingMinimized: (state, action: PayloadAction<boolean>) => {
      state.isFloatingMinimized = action.payload;
    },
    setFloatingActivePartner: (state, action: PayloadAction<string | null>) => {
      state.floatingActivePartnerId = action.payload;
    },
    openFloatingChatWith: (state, action: PayloadAction<string>) => {
      state.isFloatingOpen = true;
      state.isFloatingMinimized = false;
      state.floatingActivePartnerId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatList.fulfilled, (state, action) => {
        state.chatList = action.payload;
        state.loading = false;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.activeChatMessages = action.payload;
        state.loading = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.activeChatMessages.push(action.payload);
        // Update last message in chat list
        const partner = state.chatList.find(
          (p) => p.userId === action.payload.receiverId,
        );
        if (partner) {
          partner.lastMessage = action.payload.content;
          partner.lastMessageTime = action.payload.createdAt;
        }
      });
  },
});

export const { 
  addMessage, 
  setFloatingOpen, 
  setFloatingMinimized, 
  setFloatingActivePartner, 
  openFloatingChatWith 
} = chatSlice.actions;
export default chatSlice.reducer;





