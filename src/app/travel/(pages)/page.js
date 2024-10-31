// src/app/itinerary/page.js

"use client";

import { useState } from "react";
import TripForm from "../components/TripForm";
import ItineraryResult from "../components/ItineraryResult";

export default function TravelPage() {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handler to fetch itinerary based on form input
  const fetchItinerary = async (tripPreferences) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/travel/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripPreferences),
      });

      if (!response.ok) throw new Error("Failed to fetch itinerary");

      const data = await response.json();
      setItinerary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TripForm onSubmit={fetchItinerary} />
      {loading && <p>Loading itinerary...</p>}
      {error && <p>Error: {error}</p>}
      {itinerary && <ItineraryResult itinerary={itinerary.itinerary} />}
    </div>
  );
}
