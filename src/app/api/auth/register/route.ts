import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, oauth, image } = await request.json();

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // For non-OAuth registration, password is required
    if (!oauth && (!password || password.length < 6)) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const existingUser = await getDocs(q);

    if (!existingUser.empty) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password only for non-OAuth users
    let hashedPassword = null;
    if (password && !oauth) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    // Create user in Firestore
    const userDoc = await addDoc(usersRef, {
      name,
      email,
      password: hashedPassword,
      image: image || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: oauth ? true : false, // OAuth emails are pre-verified
      role: "user",
      provider: oauth ? "oauth" : "credentials",
      profile: {
        firstName: name.split(" ")[0] || "",
        lastName: name.split(" ").slice(1).join(" ") || "",
        phone: "",
        addresses: [], // Use addresses array instead of single address
      },
      preferences: {
        newsletter: false,
        notifications: true,
      },
      cart: [],
      wishlist: [],
      orders: [],
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: userDoc.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
