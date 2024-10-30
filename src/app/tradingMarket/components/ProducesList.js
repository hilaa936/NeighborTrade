import { useState } from "react";
import { deleteProduce } from "@/services/produceService";

export default function ProducesList({ produces, onEdit, onDelete }) {
  const [loadingId, setLoadingId] = useState(null); // Track loading state for deletion

  // Handle deleting a produce item
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setLoadingId(id); // Set loading for the specific item being deleted
      try {
        await deleteProduce(id); // Call the delete service
        onDelete(id); // Call the onDelete function to update the parent state
      } catch (error) {
        console.error("Error deleting produce:", error);
      } finally {
        setLoadingId(null); // End loading after deletion
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {produces.length > 0 ? (
        produces.map((produce) => (
          <div
            key={produce?.id}
            className={`p-4 rounded-lg shadow-md relative ${
              !produce?.isAvailable ? "bg-gray-300" : "bg-white"
            }`} // Gray background if unavailable
          >
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">{produce?.name}</h2>
              <div className="space-x-2">
                {produce?.isAvailable ? (
                  <>
                    <button
                      onClick={() => onEdit(produce)} // Open form for editing
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(produce.id)} // Handle deletion
                      className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
                      disabled={loadingId === produce?.id} // Disable button while loading
                    >
                      {loadingId === produce?.id ? "Deleting..." : "Remove"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onEdit(produce)} // Open form for restoring
                    className="text-orange-500 hover:text-orange-700"
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-700">
              {produce?.description || "No description available."}
            </p>
            <div className="mt-4">
              <span>Quantity: {produce?.quantity}</span>
            </div>
          </div>
        ))
      ) : (
        <p>No produces available.</p>
      )}
    </div>
  );
}
