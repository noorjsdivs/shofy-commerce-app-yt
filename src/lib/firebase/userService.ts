import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export interface FirestoreUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  provider?: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    addresses: Array<{
      id: string;
      type: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      isDefault: boolean;
    }>;
  };
  preferences: {
    newsletter: boolean;
    notifications: boolean;
  };
  cart: any[];
  wishlist: any[];
  orders: any[];
}

export async function fetchUserFromFirestore(
  userId: string
): Promise<FirestoreUser | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: userId,
        ...userData,
      } as FirestoreUser;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user from Firestore:", error);
    return null;
  }
}

export async function getCurrentUserData(
  session: any
): Promise<FirestoreUser | null> {
  if (!session?.user?.id) {
    return null;
  }

  return await fetchUserFromFirestore(session.user.id);
}
