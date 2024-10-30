"use client";

import { useState, useEffect } from "react";
import ProducesList from "@/app/tradingMarket/components/ProducesList";
import {
  fetchTraderProduce,
  addNewProduce,
  updateProduce,
  deleteProduce,
} from "@/services/produceService"; // Import the services
import { useSession } from "next-auth/react"; // Import useSession from NextAuth
import ProduceForm from "../components/ProduceForm";

export default function ProduceManagementPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduce, setCurrentProduce] = useState(null); // Holds the produce to edit
  const [produces, setProduces] = useState([]); // Holds the list of produces
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [submitting, setSubmitting] = useState(false); // Loading state for form submission
  const { data: session } = useSession(); // Get session data (traderId)

  useEffect(() => {
    // Only fetch data if the session is available
    if (session?.user?.id) {
      loadProduces();
    }
  }, [session]); // Run when session changes

  // Load produce data
  const loadProduces = async () => {
    try {
      setLoading(true);
      const data = await fetchTraderProduce(session.user.id); // Fetch produces by traderId (session user id)
      setProduces(data); // Set the fetched produces to the state
    } catch (error) {
      console.error("Error fetching produces:", error);
    } finally {
      setLoading(false); // Stop the loading state
    }
  };

  // Handle edit button click
  const handleEditProduce = (produce) => {
    setCurrentProduce(produce); // Load the selected produce into the form
    setIsFormOpen(true); // Open the form
  };

  // Handle new produce button click
  const handleNewProduce = () => {
    setCurrentProduce(null); // Clear form for new produce
    setIsFormOpen(true); // Open the form
  };

  // Close the form
  const handleCloseForm = () => {
    setIsFormOpen(false); // Close the form
  };

  // Handle form submission (add or update)
  const handleFormSubmit = async (produceData) => {
    if (!session?.user?.id) {
      alert("User is not authenticated");
      return;
    }

    const traderId = session.user.id;

    setSubmitting(true); // Set submitting state

    try {
      if (produceData.id) {
        // Update existing produce
        await updateProduce(produceData.id, { ...produceData, traderId });
      } else {
        // Add new produce
        await addNewProduce({ ...produceData, traderId });
      }
      await loadProduces(); // Reload the produce list after successful submission
    } catch (error) {
      console.error("Error handling form submission:", error);
    } finally {
      setIsFormOpen(false); // Close the form after submission
      setSubmitting(false); // End submitting state
    }
  };

  // Handle deleting an item from the list
  const handleDeleteProduce = async (id) => {
    try {
      await deleteProduce(id); // Call delete service
      await loadProduces(); // Reload the produce list after deleting
    } catch (error) {
      console.error("Error deleting produce:", error);
    }
  };

  if (loading) {
    return <p>Loading produces...</p>; // Show loading state while loading produces
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Manage Produce</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleNewProduce}
        >
          + New Item
        </button>
      </div>

      {/* Smooth toggling for the form */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isFormOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ProduceForm
          produce={currentProduce}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          submitting={submitting} // Pass the submitting state to disable the form during submission
        />
      </div>

      {/* List of produces */}
      <ProducesList
        produces={produces}
        onEdit={handleEditProduce}
        onDelete={handleDeleteProduce} // Pass the delete handler
      />
    </div>
  );
}
