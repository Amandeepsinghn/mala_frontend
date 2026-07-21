"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileResponse } from "@/types/api";

interface AuthState {
  token: string | null;
  user: UserProfileResponse | null;
  setAuth: (token: string, user?: UserProfileResponse | null) => void;
  setUser: (user: UserProfileResponse | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user = null) => set({ token, user }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "mala-auth" },
  ),
);
