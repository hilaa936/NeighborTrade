// /src/components/produce/ProduceCard.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";

const produceMock = {
  id: 1, // Unique identifier for the produce
  name: "Tomatoes", // The name of the produce
  description: "Fresh organic tomatoes grown in home garden.", // Description of the produce
  quantity: 10, // The quantity available for trade (e.g., 10 kg)
  unit: "kg", // The unit of measurement for the produce (e.g., kilograms)
  produceStatus: "Available", // Status of the produce (Available, Out of Stock, etc.)
  ownerId: 1, // The ID of the trader who owns the produce
  dateAdded: "2024-10-01T10:00:00Z", // ISO timestamp of when the produce was added
  owner: {
    id: 1, // The trader's ID
    username: "johnDoe", // The trader's username
    email: "john@example.com", // Trader's email (could be hidden in public view)
    role: "Trader", // The role of the user (Trader)
  },
};
const ProduceCard = ({ produce = produceMock }) => {
  const router = useRouter(); // Initialize the Next.js router

  // Function to handle the Start Trade button click
  const handleStartTrade = () => {
    // Navigate to the trade initiation page with the produce ID
    router.push(`/trade/${produce.id}`);
  };
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Card Body */}
      <div className="p-6">
        {/* Produce Name */}
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          {produce.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-5 line-clamp-3">{produce.description}</p>

        {/* Info Section */}
        <div className="flex justify-between items-center mb-4">
          {/* Quantity */}
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Quantity:</span> {produce.quantity}{" "}
            {produce.unit}
          </p>

          {/* Availability Status */}
          <p
            className={`text-sm font-semibold ${
              produce.produceStatus === "Available"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {produce.produceStatus}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStartTrade} // Attach click event handler
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Start Trade
        </button>
      </div>
    </div>
  );
};

export default ProduceCard;
