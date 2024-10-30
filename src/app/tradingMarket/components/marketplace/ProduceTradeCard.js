// src/components/marketplace/ProduceTradeCard.js

import React from "react";

const ProduceTradeCard = ({ produce }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      {/* Produce Image */}
      <div className="h-32 w-full overflow-hidden rounded-md mb-4">
        <img
          src={produce.imageUrl || "/images/default-produce.png"}
          alt={produce.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Produce Info */}
      <div>
        <h2 className="text-xl font-semibold">{produce.name}</h2>
        <p className="text-gray-600">
          {produce.description || "No description available"}
        </p>
        <p className="mt-2 text-sm font-medium">Quantity: {produce.quantity}</p>
      </div>

      {/* Action Button */}
      <div className="mt-4">
        <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
          Propose Trade
        </button>
      </div>
    </div>
  );
};

export default ProduceTradeCard;
