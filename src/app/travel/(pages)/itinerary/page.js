"use client";
import { useEffect, useState } from "react";
import ItineraryView from "../../components/ItineraryView";
import PageTitle from "@/components/layout/PageTitle";
import PreferencesView from "../../components/PreferencesView";

export default function ItineraryPage() {
  const [itineraryData, setItineraryData] = useState(null);
  const [preferencesData, setPreferencesData] = useState(null);

  useEffect(() => {
    // Retrieve itinerary data from localStorage
    const storedItinerary = localStorage.getItem("itineraryData");
    const storedPreferencesValues = localStorage.getItem("preferencesData");

    if (storedItinerary) {
      setItineraryData(JSON.parse(storedItinerary));
    }
    if (storedPreferencesValues) {
      setPreferencesData(JSON.parse(storedPreferencesValues));
    }
  }, []);
  return (
    <div className="container mx-auto p-6">
      <PageTitle title="Your Preliminary Itinerary" />
      {/* Display form values with enhanced styling */}
      <PreferencesView preferencesData={preferencesData} />
      {itineraryData ? (
        <ItineraryView itinerary={itineraryData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
