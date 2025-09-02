import { NextRequest, NextResponse } from "next/server";
import { hash, compare } from "bcryptjs";
import { db } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export async function PUT(request: NextRequest) {
  try {
    const { email, currentPassword, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Email and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    // Find user in Firestore
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const userDoc = querySnapshot.docs[0];
    const user = userDoc.data();

    // Check if user has existing password (for OAuth users setting first password)
    if (user.password && currentPassword) {
      // Verify current password for existing password users
      const isValidPassword = await compare(currentPassword, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect" },
          { status: 401 }
        );
      }
    } else if (user.password && !currentPassword) {
      // User has password but didn't provide current password
      return NextResponse.json(
        { success: false, error: "Current password is required" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 12);

    // Update password in Firestore
    const userDocRef = doc(db, "users", userDoc.id);
    await updateDoc(userDocRef, {
      password: hashedPassword,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: user.password
        ? "Password updated successfully"
        : "Password set successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
