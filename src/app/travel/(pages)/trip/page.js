// pages/trip.js
"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Modal from "@/components/layout/Modal";
import CreateTrip from "../../components/trip/CreateTrip";
import { fetchTrips } from "@/services/travelService";
import { useRouter } from "next/navigation";

const TripPage = () => {
  const router = useRouter();
  const user = useUser();

  const [trips, setTrips] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await fetchTrips();
        setTrips(data);
      } catch (error) {
        console.error("Failed to load trips:", error);
      }
    };

    loadTrips();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTripCreated = async () => {
    const data = await fetchTrips();
    setTrips(data);
    handleCloseModal();
  };
  const handleTripClick = (tripId) => {
    router.push(`/travel/trip/${tripId}`);
  };
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Trips</h1>
      <button
        onClick={handleOpenModal}
        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
      >
        Create New Trip
      </button>

      {/* Modal for creating a trip */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {user && (
          <CreateTrip
            onClose={handleCloseModal}
            userId={user.id}
            onTripCreated={handleTripCreated}
          />
        )}
      </Modal>

      <ul className="mt-6 space-y-4">
        {trips.map((trip) => (
          <li
            key={trip.id}
            className="p-4 border border-gray-300 rounded-md"
            onClick={() => handleTripClick(trip.id)}
          >
            <h3 className="text-lg font-semibold">{trip.name}</h3>
            <p>Destination: {trip.destination}</p>
            <p>Date: {new Date(trip.tripDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripPage; // Wrap with withAuth
