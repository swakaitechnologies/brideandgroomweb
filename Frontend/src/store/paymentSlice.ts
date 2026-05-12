import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export interface Plan {
  id: string;
  name: string;
  slug: string;
  durationDays: number;
  price: Record<string, number>;
  features: string[];
  maxContacts: number;
  maxMessages: number;
  priority: number;
  badge: string | null;
  freeTrialDays: number;
}

export interface SubscriptionInfo {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  plan: Plan;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  gateway: string;
  status: string;
  createdAt: string;
  plan: { name: string; slug: string };
}

export interface PaymentState {
  plans: Plan[];
  currentSubscription: SubscriptionInfo | null;
  isPremium: boolean;
  paymentHistory: PaymentRecord[];
  pagination: { page: number; total: number; totalPages: number };
  loading: boolean;
  error: string | null;
  orderData: any | null;
}

const initialState: PaymentState = {
  plans: [],
  currentSubscription: null,
  isPremium: false,
  paymentHistory: [],
  pagination: { page: 1, total: 0, totalPages: 0 },
  loading: false,
  error: null,
  orderData: null,
};

export const fetchPlans = createAsyncThunk(
  "payment/fetchPlans",
  async (country: string = "ALL", { rejectWithValue }) => {
    try {
      const res = await api.get(`/payments/plans?country=${country}`);
      return res.data.plans;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load plans");
    }
  }
);

export const fetchMySubscription = createAsyncThunk(
  "payment/fetchMySubscription",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/payments/my-subscription");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load subscription");
    }
  }
);

export const createPaymentOrder = createAsyncThunk(
  "payment/createOrder",
  async ({ planId, currency }: { planId: string; currency: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/payments/create-order", { planId, currency });
      return res.data.order;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create order");
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (verificationData: any, { rejectWithValue }) => {
    try {
      const res = await api.post("/payments/verify", verificationData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Verification failed");
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  "payment/fetchHistory",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const res = await api.get(`/payments/history?page=${page}&limit=10`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load history");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderData = null;
    },
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Plans
      .addCase(fetchPlans.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPlans.fulfilled, (state, action) => { state.loading = false; state.plans = action.payload; })
      .addCase(fetchPlans.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      // My Subscription
      .addCase(fetchMySubscription.fulfilled, (state, action) => {
        state.currentSubscription = action.payload.subscription;
        state.isPremium = action.payload.isPremium;
      })
      // Create Order
      .addCase(createPaymentOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createPaymentOrder.fulfilled, (state, action) => { state.loading = false; state.orderData = action.payload; })
      .addCase(createPaymentOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      // Verify Payment
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.currentSubscription = action.payload.subscription;
        state.isPremium = true;
        state.orderData = null;
      })
      // Payment History
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.paymentHistory = action.payload.payments;
        state.pagination = action.payload.pagination;
      });
  },
});

export const { clearOrderData, clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
