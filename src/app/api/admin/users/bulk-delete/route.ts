import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

export async function DELETE(request: NextRequest) {
  try {
    const { userIds } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid user IDs provided" },
        { status: 400 }
      );
    }

    // Create a batch for efficient deletion
    const batch = writeBatch(db);

    // Delete users
    for (const userId of userIds) {
      const userRef = doc(db, "users", userId);
      batch.delete(userRef);
    }

    // Also delete related orders for these users
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    const ordersToDelete = ordersSnapshot.docs.filter((orderDoc) => {
      const orderData = orderDoc.data();
      return userIds.some((userId) => {
        // Get user data to match by email
        return orderData.customerEmail; // We'll need to check if this matches any deleted user
      });
    });

    // Get user emails before deletion to match with orders
    const usersToDelete: string[] = [];
    for (const userId of userIds) {
      try {
        const userDoc = await getDocs(
          query(collection(db, "users"), where("__name__", "==", userId))
        );
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          if (userData.email) {
            usersToDelete.push(userData.email);
          }
        }
      } catch (error) {
        console.error(`Error getting user ${userId}:`, error);
      }
    }

    // Delete related orders
    const ordersSnapshot2 = await getDocs(collection(db, "orders"));
    ordersSnapshot2.docs.forEach((orderDoc) => {
      const orderData = orderDoc.data();
      if (usersToDelete.includes(orderData.customerEmail)) {
        batch.delete(orderDoc.ref);
      }
    });

    // Commit the batch
    await batch.commit();

    return NextResponse.json({
      message: `Successfully deleted ${userIds.length} users and their related data`,
    });
  } catch (error) {
    console.error("Error deleting users:", error);
    return NextResponse.json(
      { error: "Failed to delete users" },
      { status: 500 }
    );
  }
}
