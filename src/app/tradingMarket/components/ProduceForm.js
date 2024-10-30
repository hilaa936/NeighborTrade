"use client";

import { useState, useEffect } from "react";

export default function ProduceForm({ produce = null, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state for form

  useEffect(() => {
    if (produce) {
      setName(produce.name);
      setDescription(produce.description || "");
      setQuantity(produce.quantity || 1);
    } else {
      setName("");
      setDescription("");
      setQuantity(1);
    }
  }, [produce]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || quantity <= 0) {
      alert(
        "Name and Quantity are required, and Quantity must be greater than 0"
      );
      setLoading(false);
      return;
    }

    // Pass the data back to the parent via the onSubmit callback
    onSubmit({
      id: produce?.id || null,
      name,
      description,
      quantity,
    });

    setLoading(false);
    onClose(); // Close the form after submission
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4">
        {produce ? "Edit Produce" : "New Produce"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border p-2 rounded"
            min="1"
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? "Saving..." : produce ? "Save Changes" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
