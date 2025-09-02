import OrdersList from "@/components/account/OrdersList";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function OrdersPage() {
  return (
    <ProtectedRoute loadingMessage="Loading your orders...">
      <div>
        <OrdersList showHeader={true} />
      </div>
    </ProtectedRoute>
  );
}
