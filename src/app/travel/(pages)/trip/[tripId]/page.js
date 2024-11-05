"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteTrip, getTripById } from "@/services/travelService";
import { formatDate, getDateDifference } from "@/utils/formatDate";
import TripDetailsView from "@/app/travel/components/trip/TripDetailsView";
import ActivitiesAI from "@/app/travel/components/activities/ActivitiesAI";

export default function TripDetailsPage({ params }) {
  const { tripId } = params;
  const router = useRouter();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const tripData = await getTripById(tripId);
        setTrip(tripData);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId]);

  const handleEdit = () => {
    router.push(`/travel/trip/edit/${tripId}`); // Corrected edit route
  };

  const handleDelete = async () => {
    try {
      await deleteTrip(tripId);
      router.push("/travel/trip"); // Navigate back to trip list after deletion
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!trip) return <p>No trip data available.</p>;

  return (
    <>
      <div className="max-w-2xl mx-auto p-6 bg-white">
        <h2 className="text-2xl font-semibold mb-4">Trip Details</h2>
        <div
          className="relative  border bg-slate-50 
         flex flex-col items-center "
        >
          <TripDetailsView trip={trip} />
          {/* Actions */}
          <div className="absolute bottom-0 right-0 m-4 space-x-4">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        <ActivitiesAI destinationTrip={trip.destination} />
      </div>
    </>
  );
}
