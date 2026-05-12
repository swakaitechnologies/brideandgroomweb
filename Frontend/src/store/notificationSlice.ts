import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "@/services/api";

const API_URL = "/notifications";

export interface Notification {
  id: string;
  userId: string;
  senderId: string;
  type:
  | "interest"
  | "contact_request"
  | "system"
  | "message"
  | "block"
  | "unblock"
  | "kyc";
  message: string;
  isRead: boolean;
  relatedId: string;
  createdAt: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications",
      );
    }
  },
);

export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await api.put(`${API_URL}/${notificationId}/read`);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark as read",
      );
    }
  },
);

export const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await api.put(`${API_URL}/read-all`);
      return true;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark all as read",
      );
    }
  },
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(
        (n: Notification) => !n.isRead,
      ).length;
    });
    builder.addCase(markAsRead.fulfilled, (state, action) => {
      const n = state.notifications.find((n) => n.id === action.payload);
      if (n && !n.isRead) {
        n.isRead = true;
        state.unreadCount -= 1;
      }
    });
    builder.addCase(markAllAsRead.fulfilled, (state) => {
      state.notifications.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;





