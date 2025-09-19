"use client";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Props {
  session: Session | null;
}

const SignOutButton = ({ session }: Props) => {
  const handleSignOut = async () => {
    try {
      // Clear localStorage data
      localStorage.clear();

      // Clear sessionStorage data
      sessionStorage.clear();

      // Clear specific cookies by setting them to expire
      const cookiesToClear = [
        "next-auth.session-token",
        "next-auth.csrf-token",
        "__Secure-next-auth.session-token",
        "__Host-next-auth.csrf-token",
        "cart-items",
        "user-preferences",
        "wishlist-items",
      ];

      cookiesToClear.forEach((cookieName) => {
        // Clear cookie by setting it to expire in the past
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        // Also try clearing without domain for broader compatibility
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      });

      // Sign out through NextAuth
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });

      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error during sign out:", error);
      toast.error("Error occurred during logout");
    }
  };

  return (
    <div>
      {session?.user && <button onClick={handleSignOut}>Sign out</button>}
      {!session?.user && (
        <Link
          href={"/auth/signin"}
          className="hover:text-theme-color duration-300 cursor-pointer"
        >
          Please login to view your cart
        </Link>
      )}
    </div>
  );
};

export default SignOutButton;
