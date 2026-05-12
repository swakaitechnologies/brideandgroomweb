import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import profileReducer, { type ProfileState } from "./profileSlice";
import partnerPreferenceReducer, { type PartnerPreferenceState } from "./partnerPreferenceSlice";
import privacyReducer, { type PrivacyState } from "./privacySlice";
import matchesReducer, { type MatchesState } from "./matchesSlice";
import interactionReducer, { type InteractionState } from "./interactionSlice";
import notificationReducer, { type NotificationState } from "./notificationSlice";
import chatReducer, { type ChatState } from "./chatSlice";
import paymentReducer, { type PaymentState } from "./paymentSlice";

const rootReducer = combineReducers({
  profile: profileReducer,
  partnerPreference: partnerPreferenceReducer,
  privacy: privacyReducer,
  matches: matchesReducer,
  interaction: interactionReducer,
  notification: notificationReducer,
  chat: chatReducer,
  payment: paymentReducer,
});

export interface RootState {
  profile: ProfileState;
  partnerPreference: PartnerPreferenceState;
  privacy: PrivacyState;
  matches: MatchesState;
  interaction: InteractionState;
  notification: NotificationState;
  chat: ChatState;
  payment: PaymentState;
}

const persistConfig = {
  key: "root",
  version: 2,
  storage,
  whitelist: ["matches"], // Only persist matches slice (Recently Viewed / Shortlist)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = typeof window !== "undefined" ? persistStore(store) : null;

export type AppDispatch = typeof store.dispatch;





