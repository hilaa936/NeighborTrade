"use client";

import { useEffect, useState } from "react";
import { fetchAllProduce } from "@/services/produceService"; // Use the fetchAll function to get all produce
import SearchBar from "@/app/tradingMarket/components/marketplace/SearchBar";
import MarketplaceList from "../components/marketplace/MarketplaceList";
const produceList = [
  {
    id: 1,
    name: "Tomatoes",
    description: "Fresh organic tomatoes grown in home garden.",
    quantity: 10,
    unit: "kg",
    produceStatus: "Available",
    ownerId: 1,
    dateAdded: "2024-10-01T10:00:00Z",
    owner: {
      id: 1,
      username: "johnDoe",
      email: "john@example.com",
      role: "Trader",
    },
  },
  {
    id: 2,
    name: "Carrots",
    description: "Crunchy home-grown carrots.",
    quantity: 15,
    unit: "kg",
    produceStatus: "Out of Stock",
    ownerId: 2,
    dateAdded: "2024-09-25T08:30:00Z",
    owner: {
      id: 2,
      username: "janeDoe",
      email: "jane@example.com",
      role: "Trader",
    },
  },
  {
    id: 3,
    name: "Apples",
    description: "Crisp, juicy apples from the backyard.",
    quantity: 5,
    unit: "kg",
    produceStatus: "Available",
    ownerId: 3,
    dateAdded: "2024-10-05T14:00:00Z",
    owner: {
      id: 3,
      username: "mikeSmith",
      email: "mike@example.com",
      role: "Trader",
    },
  },
];

export default function MarketplacePage() {
  const [produce, setProduce] = useState([]);
  const [filteredProduce, setFilteredProduce] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  useEffect(() => {
    // Fetch all produce when the page loads
    const loadAllProduce = async () => {
      try {
        setLoading(true);
        const data = await fetchAllProduce(); // Fetch all produce from the service
        setProduce(data); // Set the fetched produce data to the state
        setFilteredProduce(data);
      } catch (error) {
        console.error("Error fetching produce:", error);
      } finally {
        setLoading(false); // Stop the loading state
      }
    };
    loadAllProduce();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredProduce(produce); // Reset to full list if search is cleared
    } else {
      const filtered = produce.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProduce(filtered);
    }
  };
  if (loading) {
    return <p>Loading marketplace items...</p>; // Display loading message while data is being fetched
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Marketplace
      </h1>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading produce...</p>
      ) : filteredProduce.length > 0 ? (
        <div className="produce-grid">
          <MarketplaceList produceList={filteredProduce} />
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No produce available for trade at the moment.
        </p>
      )}
    </div>
  );
}
