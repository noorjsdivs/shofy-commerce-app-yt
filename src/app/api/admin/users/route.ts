import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { USER_ROLES } from "@/lib/rbac/permissions";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    // Fetch real users from Firebase
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      role: doc.data().role || "user", // Default to user role if not set
    })) as any[];

    // Get order counts for each user
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    const orders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    const usersWithOrderCount = users.map((user) => ({
      ...user,
      role: user.role || "user", // Default to 'user' role if not set
      orders: orders.filter((order) => order.customerEmail === user.email)
        .length,
      totalSpent: orders
        .filter((order) => order.customerEmail === user.email)
        .reduce((sum, order) => sum + (order.total || 0), 0),
    }));

    return NextResponse.json(usersWithOrderCount);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, name, email, role } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role !== undefined) {
      const validRoles = Object.values(USER_ROLES);
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: `Invalid role. Valid roles are: ${validRoles.join(", ")}` },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;

    // Update user in Firebase
    await updateDoc(doc(db, "users", userId), updateData);

    return NextResponse.json({
      success: true,
      message: `User updated successfully${role ? ` with role: ${role}` : ""}`,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Delete user from Firebase
    await deleteDoc(doc(db, "users", userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
