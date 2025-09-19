"use client";

import { useUserSync } from "@/hooks/useUserSync";

interface UserSyncProviderProps {
  children: React.ReactNode;
}

export function UserSyncProvider({ children }: UserSyncProviderProps) {
  // This hook synchronizes NextAuth session data with Redux store
  useUserSync();

  return <>{children}</>;
}
