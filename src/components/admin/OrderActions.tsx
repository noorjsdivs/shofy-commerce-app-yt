import Link from "next/link";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

interface OrderActionsProps {
  orderId: string;
  userId?: string;
  onDelete: () => void;
  showViewDetails?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

const OrderActions = ({
  orderId,
  userId,
  onDelete,
  showViewDetails = true,
  showEdit = true,
  showDelete = true,
}: OrderActionsProps) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
        .then((response) => {
          if (response.ok) {
            onDelete();
          } else {
            alert("Failed to delete order");
          }
        })
        .catch((error) => {
          console.error("Error deleting order:", error);
          alert("Failed to delete order");
        });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {showViewDetails && (
        <Link
          href={`/admin/orders/${orderId}`}
          className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
          title="View Details"
        >
          <FiEye className="w-4 h-4" />
        </Link>
      )}

      {showEdit && (
        <Link
          href={`/admin/orders/${orderId}/edit`}
          className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
          title="Edit Order"
        >
          <FiEdit className="w-4 h-4" />
        </Link>
      )}

      {showDelete && (
        <button
          onClick={handleDelete}
          className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
          title="Delete Order"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default OrderActions;
