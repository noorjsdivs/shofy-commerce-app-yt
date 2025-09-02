import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export async function DELETE(request: NextRequest) {
  try {
    const { email, addressIndex } = await request.json();

    if (!email || addressIndex === undefined) {
      return NextResponse.json(
        { error: "Email and address index are required" },
        { status: 400 }
      );
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    let addresses = userData.profile?.addresses || [];

    // Remove address at specified index
    if (addressIndex >= 0 && addressIndex < addresses.length) {
      addresses.splice(addressIndex, 1);
    } else {
      return NextResponse.json(
        { error: "Invalid address index" },
        { status: 400 }
      );
    }

    await updateDoc(doc(db, "users", userDoc.id), {
      "profile.addresses": addresses,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error("Address deletion error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete address",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
