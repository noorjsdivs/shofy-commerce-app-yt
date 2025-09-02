"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AddressManagement from "@/components/account/AddressManagement";

interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export default function AddressesClient() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch addresses
  useEffect(() => {
    if (session?.user?.email) {
      fetchAddresses();
    }
  }, [session?.user?.email]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(
        `/api/user/profile?email=${encodeURIComponent(
          session?.user?.email || ""
        )}`
      );
      const data = await response.json();
      if (data.profile?.addresses) {
        setAddresses(data.profile.addresses);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setLoading(false);
    }
  };

  const handleAddressesChange = (newAddresses: Address[]) => {
    setAddresses(newAddresses);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Addresses</h1>
        <p className="text-gray-600">
          Add, edit, or remove your saved addresses
        </p>
      </div>
      <AddressManagement
        addresses={addresses}
        onAddressesChange={handleAddressesChange}
      />
    </div>
  );
}
