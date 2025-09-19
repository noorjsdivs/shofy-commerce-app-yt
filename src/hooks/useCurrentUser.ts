import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FirestoreUser } from "@/lib/firebase/userService";

export function useCurrentUser(): {
  user: FirestoreUser | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  userRole: string;
} {
  const userInfo = useSelector((state: RootState) => state.shopy.userInfo);

  return {
    user: userInfo,
    isAdmin: userInfo?.role === "admin",
    isAuthenticated: !!userInfo,
    userId: userInfo?.id || null,
    userRole: userInfo?.role || "user",
  };
}
