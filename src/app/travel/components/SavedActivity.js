import React, { useState, useEffect } from "react";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import axios from "axios";

const SavedActivities = ({ activities, addActivity }) => {
  const [likedActivities, setLikedActivities] = useState({});
  const [savedActivities, setSavedActivities] = useState([]);
  // Fetch initial liked status for activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`/api/travel/activities`);
        setSavedActivities(response.data);
      } catch (error) {
        console.error("Error fetching liked activities:", error);
      }
    };
    fetchActivities();
  }, []);

  const toggleLike = async (activity) => {
    const isLiked = likedActivities[activity.id];

    try {
      if (isLiked) {
        // Send unlike request to API
        // await axios.delete(`/api/travel/activities`, {
        //   data: { userId, activityId: activity.id },
        // });
        setLikedActivities((prev) => ({
          ...prev,
          [activity.id]: false,
        }));
      } else {
        //save activity
        await addActivity({ userId, activityId: activity.id, ...activity });

        setLikedActivities((prev) => ({
          ...prev,
          [activity.name]: true,
        }));
      }
    } catch (error) {
      console.error("Error toggling like status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <br />
      <h2 className="text-2xl font-semibold text-gray-800">Saved Activities</h2>
      <ul className="space-y-4">
        {savedActivities.map((activity, index) => (
          <li
            key={activity.id}
            className="relative p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200"
          >
            {/* Like Button */}
            <button
              onClick={() => toggleLike(activity)}
              className="absolute top-4 right-4 text-indigo-500 focus:outline-none"
              aria-label="Like"
            >
              {likedActivities[activity.id] ? (
                <HeartIconSolid className="h-6 w-6 text-red-500" />
              ) : (
                <HeartIconOutline className="h-6 w-6 text-gray-400 hover:text-red-500" />
              )}
            </button>

            {/* Activity Details */}
            <p> {activity.destination}</p>
            <h3 className="text-xl font-medium text-indigo-600">
              {activity.name}
            </h3>
            <p className="text-gray-600 mb-2">{activity.description}</p>
            <p className="text-sm text-gray-500">
              Location: {activity.location} | Time: {activity.time}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedActivities;
