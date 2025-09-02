import AccountClient from "@/components/account/AccountClient";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AccountPage() {
  return (
    <ProtectedRoute loadingMessage="Loading your account...">
      <AccountClient />
    </ProtectedRoute>
  );
}
