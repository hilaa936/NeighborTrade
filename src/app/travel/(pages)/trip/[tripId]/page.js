"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteTrip, getTripById } from "@/services/travelService";
import { formatDate, getDateDifference } from "@/utils/formatDate";

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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Trip Details</h2>
      <div className="max-w-xl mx-auto bg-blue-50 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          {trip.name || "Unnamed Trip"}
        </h2>
      </div>
      <p>
        <strong>Destination:</strong> {trip.destination || "Not specified"}
      </p>
      <p>
        <strong>Start Date:</strong> {formatDate(trip.tripStartDate)}
      </p>
      <p>
        <strong>End Date:</strong> {formatDate(trip.tripEndDate)}
      </p>
      <p>
        <strong>Duration:</strong>{" "}
        {getDateDifference(trip.tripStartDate, trip.tripEndDate)} days
      </p>
      <p>
        <strong>Interests:</strong>{" "}
        {trip.userPreferences?.interests
          ? trip.userPreferences.interests
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
              .join(", ")
          : "No interests available"}
      </p>

      <p>
        <strong>Budget Level:</strong>{" "}
        {trip.userPreferences?.budgetLevel || "Not specified"}
      </p>

      {/* Actions */}
      <div className="mt-6 space-x-4">
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Edit Trip
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Delete Trip
        </button>
      </div>
    </div>
  );
}
