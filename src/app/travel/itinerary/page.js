// src/app/itinerary/page.js
"use client";
import { useRouter } from "next/navigation";
import ItineraryView from "../components/ItineraryView";

export default function ItineraryPage() {
  const router = useRouter();
  const itineraryData = router?.query?.data
    ? JSON.parse(router.query.data)
    : null;

  return (
    <div>
      <h1>Your Preliminary Itinerary</h1>
      {itineraryData ? (
        <ItineraryView itinerary={itineraryData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
