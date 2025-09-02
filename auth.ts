import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/authOptions";

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
