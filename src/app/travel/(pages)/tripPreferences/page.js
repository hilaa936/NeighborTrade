// src/app/tripPreferences/page.js
"use client";
import { useRouter } from "next/navigation";
import TripForm from "../../components/TripForm";

export default function TripPreferencesPage() {
  const router = useRouter();

  const handleFormSubmit = async (preferences) => {
    // Post preferences to itinerary API endpoint to generate preliminary itinerary
    const response = await fetch("/api/travel/itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preferences),
    });

    if (response.ok) {
      const data = await response.json();
      // Store itinerary in localStorage
      localStorage.setItem("itineraryData", JSON.stringify(data));
      // Store formValues in localStorage
      localStorage.setItem("preferencesData", JSON.stringify(preferences));

      // Navigate to the itinerary page
      router.push("/travel/itinerary");
    } else {
      console.error("Error generating itinerary");
    }
  };

  return (
    <div className="min-h-screen  items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold m-4 text-center text-blue-600">
        Plan Your Perfect Getaway
      </h1>
      <p className="text-gray-600 text-center mb-6">
        Tell us a bit about what you're looking for, and we’ll create a
        customized itinerary for your journey.
      </p>
      <TripForm onSubmit={handleFormSubmit} />
    </div>
  );
}
