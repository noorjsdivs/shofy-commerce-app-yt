"use client";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Props {
  session: Session | null;
}

const SignOutButton = ({ session }: Props) => {
  const handleSignOut = () => {
    signOut();
    toast.success("Log out successfully!");
  };
  const handleSignIn = () => {
    signIn();
    toast.success("Logged in successfully!");
  };
  return (
    <div>
      {session?.user && <button onClick={handleSignOut}>Sign out</button>}
      {!session?.user && (
        <Link
          href={"/signin"}
          className="hover:text-theme-color duration-300 cursor-pointer"
        >
          Please login to view your cart
        </Link>
      )}
    </div>
  );
};

export default SignOutButton;
