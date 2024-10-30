// src/app/tripPreferences/page.js
"use client";
import { useRouter } from "next/navigation";
import TripForm from "../components/TripForm";

export default function TripPreferencesPage() {
  const router = useRouter();

  const handleFormSubmit = async (preferences) => {
    // Post preferences to itinerary API endpoint to generate preliminary itinerary
    const response = await fetch("/api/itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preferences),
    });

    if (response.ok) {
      const itinerary = await response.json();
      // Pass the generated itinerary to the next page
      router.push({
        pathname: "/itinerary",
        query: { data: JSON.stringify(itinerary) },
      });
    } else {
      console.error("Error generating itinerary");
    }
  };

  return (
    <div>
      <h1>Select Your Trip Preferences</h1>
      <TripForm onSubmit={handleFormSubmit} />
    </div>
  );
}
