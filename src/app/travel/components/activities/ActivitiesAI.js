"use client";
import { useState } from "react";
import ActivitiesResult from "../ActivitiesResult";
import axios from "axios";
import SavedActivities from "../SavedActivity";

const ActivitiesAI = () => {
  const [destination, setDestination] = useState("");
  const [activitiesData, setActivitiesData] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assume fetchActivities is a function that calls OpenAI API and returns activities data
    const data = await fetchActivities(destination);
    setActivitiesData(data);
  };
  const addActivity = async (activity) => {
    await axios.post(`/api/travel/activities`, {
      destination: destination,
      ...activity,
    });
  };
  return (
    <div className="justify-items-center">
      {/* Destination Form */}
      <form onSubmit={handleSubmit} className="mb-8 w-64 space-y-4">
        <label
          htmlFor="destination"
          className="block text-sm font-medium text-gray-700"
        >
          Destination
        </label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter a destination"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-700 focus:outline-none"
        >
          Get Activities
        </button>
      </form>

      {/* Display Activities Results */}
      {activitiesData && (
        <ActivitiesResult
          activities={activitiesData.activities}
          addActivity={addActivity}
        />
      )}

      <SavedActivities />
    </div>
  );
};

export default ActivitiesAI;

// Mocked API Call
async function fetchActivities(destination) {
  // In a real scenario, replace this with OpenAI API call, here mocked for example purposes
  const mockData = {
    activities: [
      {
        name: "City Tour",
        description: "Explore the best spots in the city.",
        location: destination,
        time: "2023-12-20T09:00:00Z",
      },
      {
        name: "Hiking Adventure",
        description: "Enjoy beautiful trails and nature.",
        location: `${destination} National Park`,
        time: "2023-01-29T09:00:00Z",
      },
    ],
  };
  return new Promise((resolve) => setTimeout(() => resolve(mockData), 1000));
}
