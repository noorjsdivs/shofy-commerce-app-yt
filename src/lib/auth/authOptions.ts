import { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { UserRole } from "@/lib/rbac/roles";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Query user from Firestore
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", credentials.email));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            return null;
          }

          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            userData.password || ""
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: userDoc.id,
            email: userData.email,
            name: userData.name,
            image: userData.image || null,
            role: userData.role || "user",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth providers (Google, GitHub)
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Check if user already exists in Firestore
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", user.email));
          const querySnapshot = await getDocs(q);

          // If user doesn't exist, create them in Firestore
          if (querySnapshot.empty && user.email) {
            await addDoc(usersRef, {
              name: user.name || "",
              email: user.email,
              image: user.image || "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              emailVerified: true, // OAuth emails are verified by the provider
              role: "user",
              provider: account.provider,
              profile: {
                firstName: user.name?.split(" ")[0] || "",
                lastName: user.name?.split(" ").slice(1).join(" ") || "",
                phone: "",
                addresses: [],
              },
              preferences: {
                newsletter: false,
                notifications: true,
              },
              cart: [],
              wishlist: [],
              orders: [],
            });
          }
        } catch (error) {
          console.error("Error creating OAuth user:", error);
          return false; // Prevent sign-in if there's an error
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
        // Store the image in the token for persistence
        if (user.image) {
          token.picture = user.image;
        }
      }

      // If we don't have role in token, fetch it from database
      if (token.id && !token.role) {
        try {
          const userDoc = await getDoc(doc(db, "users", token.id as string));
          if (userDoc.exists()) {
            token.role = userDoc.data().role || "user";
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          token.role = "user";
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        // Ensure image is properly passed through
        if (token.picture && !session.user.image) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
  },
};
