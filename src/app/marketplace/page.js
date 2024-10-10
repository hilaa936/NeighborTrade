"use client";

import { useEffect, useState } from "react";
import MarketplaceList from "@/components/MarketplaceList";
import { fetchAllProduce } from "@/services/produceService"; // Use the fetchAll function to get all produce

export default function MarketplacePage() {
  const [produces, setProduces] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  useEffect(() => {
    // Fetch all produce when the page loads
    const loadAllProduce = async () => {
      try {
        setLoading(true);
        const data = await fetchAllProduce(); // Fetch all produce from the service
        setProduces(data); // Set the fetched produce data to the state
      } catch (error) {
        console.error("Error fetching produce:", error);
      } finally {
        setLoading(false); // Stop the loading state
      }
    };
    loadAllProduce();
  }, []);

  if (loading) {
    return <p>Loading marketplace items...</p>; // Display loading message while data is being fetched
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      {produces.length > 0 ? (
        <MarketplaceList produces={produces} />
      ) : (
        <p>No produce available in the marketplace.</p>
      )}
    </div>
  );
}
