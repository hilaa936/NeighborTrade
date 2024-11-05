"use client";
import { useEffect, useState } from "react";
import ActivitiesResult from "../ActivitiesResult";
import axios from "axios";
import ActivityCard from "./ActivityCard";
import ActivityInfo from "./ActivityInfo";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { fetchMockActivitiesAI } from "./mockActivities";

const ActivitiesAI = ({ destinationTrip = "", userActivities = [] }) => {
  const [destination, setDestination] = useState(destinationTrip);
  const [activitiesData, setActivitiesData] = useState(null);
  useEffect(() => {
    if (destinationTrip) {
      loadActivities(destinationTrip);
    }
  }, []);
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assume fetchActivities is a function that calls OpenAI API and returns activities data
    await loadActivities(destination);
  };
  const loadActivities = async (dest) => {
    // Assume fetchActivities is a function that calls OpenAI API and returns activities data
    const data = await fetchMockActivitiesAI();
    setActivitiesData(data);
  };
  const addActivity = async (activity) => {
    await apiTravelService.createActivity(activity);
  };

  return (
    <div className="justify-items-center">
      {/* Destination Form */}
      {!destinationTrip && (
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
      )}

      {/* Display Activities Results */}
      {activitiesData && (
        <>
          <h2 className="m-5 text-xl  text-gray-800">
            Top Activities
            {destinationTrip && (
              <span className="text-2xl font-semibold"> {destinationTrip}</span>
            )}
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {activitiesData.activities.map((activity, index) => (
              <div key={index + "-" + activity.id} className="min-w-[300px]">
                <div className="m-7 relative p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                  {/* Like Button */}
                  <button
                    onClick={() => toggleBookmark(activity)}
                    className="absolute top-4 right-4 text-indigo-500 focus:outline-none"
                    aria-label="Like"
                  >
                    {userActivities[activity.name] ? (
                      <BookmarkIconSolid className="h-6 w-6 text-red-500" />
                    ) : (
                      <BookmarkIconOutline className="h-6 w-6 text-gray-400 hover:text-red-500" />
                    )}
                  </button>

                  <ActivityInfo activity={activity} />
                  {/* <AddUserActivityButton activity={activity} /> */}
                </div>
              </div>
            ))}
          </div>
          {/* <ActivitiesResult
            activities={activitiesData.activities}
            addActivity={addActivity}
          /> */}
        </>
      )}
    </div>
  );
};

export default ActivitiesAI;

// Mocked API Call
async function fetchActivities_Mock(destination) {
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
