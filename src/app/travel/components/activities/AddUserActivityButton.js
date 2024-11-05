import { createUserActivity } from "@/services/travel/activitiesService";
import React, { useState } from "react";

const AddUserActivityButton = ({ activity }) => {
  const [status, setStatus] = useState("INTERESTED");
  const [notes, setNotes] = useState("");
  const [isAdding, setIsAdding] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track error state

  const handleAddUserActivity = async () => {
    setIsAdding(true); // Set loading state
    setError(null); // Reset any previous error

    const userActivityData = {
      activityId: activity.id,
      status,
      notes,
    };
    console.log(userActivityData);
    try {
      await createUserActivity(userActivityData); // Call the service to add user activity
      alert("Activity added successfully!"); // Notify user on success
      setStatus("INTERESTED"); // Reset status to default
      setNotes(""); // Reset notes
    } catch (error) {
      console.error("Error adding user activity:", error);
      setError("Failed to add activity. Please try again."); // Set error message
    } finally {
      setIsAdding(false); // Reset loading state
    }
  };

  return (
    <div className="mt-4">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
      >
        <option value="INTERESTED">Interested</option>
        <option value="GOING">Going</option>
        <option value="NOT_GOING">Not Going</option>
      </select>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter any notes..."
        className="mt-2 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
      />
      <button
        onClick={handleAddUserActivity}
        disabled={isAdding} // Disable button while adding
        className="mt-2 bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-500"
      >
        {isAdding ? "Adding..." : "Add to My Activities"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
      {/* Display error message */}
    </div>
  );
};

export default AddUserActivityButton;
