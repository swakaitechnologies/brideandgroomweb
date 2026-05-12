import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  mobile: string;
  isOnline?: boolean;
  lastSeen?: string;
  isBlocked?: boolean;

}

interface AuthState {
  user: User | null;
  setAuth: (user: User) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (user) => set({ user }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch (error) {
          console.error("Logout API failed", error);
        } finally {
          set({ user: null });
          // Clear persists
          localStorage.removeItem("auth-storage");
          // Force a full page reload to clear all state variables and Redux
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);





