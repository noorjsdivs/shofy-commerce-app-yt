import SettingsClient from "@/components/account/SettingsClient";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SettingsPage() {
  return (
    <ProtectedRoute loadingMessage="Loading settings...">
      <SettingsClient />
    </ProtectedRoute>
  );
}
