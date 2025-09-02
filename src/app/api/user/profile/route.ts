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

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Ensure addresses array exists for backward compatibility
    if (userData.profile && !userData.profile.addresses) {
      userData.profile.addresses = [];
    }

    return NextResponse.json({ ...userData, id: userDoc.id });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone, address, addAddress, image } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    console.log("User data before update:", JSON.stringify(userData, null, 2));

    let addresses = userData.profile?.addresses || [];
    console.log("Current addresses:", addresses);

    // If addAddress is provided, push to addresses array
    if (addAddress) {
      console.log("Adding new address:", addAddress);

      // If this is marked as default, remove default from all others
      if (addAddress.isDefault) {
        addresses = addresses.map((addr: any) => ({
          ...addr,
          isDefault: false,
        }));
      }

      addresses = [...addresses, addAddress];
    } else if (address) {
      // If address is provided, replace all addresses
      console.log("Replacing all addresses:", address);

      // Ensure only one default address exists
      let hasDefault = false;
      address.forEach((addr: any) => {
        if (addr.isDefault && !hasDefault) {
          hasDefault = true;
        } else if (addr.isDefault && hasDefault) {
          addr.isDefault = false;
        }
      });

      addresses = address;
    }

    console.log("Final addresses to save:", addresses);

    // Prepare update data, only include defined fields
    const updateData: any = {
      "profile.addresses": addresses,
      updatedAt: new Date().toISOString(),
    };
    if (typeof name !== "undefined") {
      updateData.name = name;
    }
    if (typeof phone !== "undefined") {
      updateData["profile.phone"] = phone;
    }
    if (typeof image !== "undefined") {
      updateData.image = image;
    }

    await updateDoc(doc(db, "users", userDoc.id), updateData);

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      {
        error: "Failed to update profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
