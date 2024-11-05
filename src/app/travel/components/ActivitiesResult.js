import React, { useState, useEffect } from "react";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import {
  getItemsFromLocalStorage,
  removeItemFromLocalStorage,
  saveItemToLocalStorage,
} from "@/services/localStorageService";

const ActivitiesResult = ({ activities }) => {
  const [likedActivities, setLikedActivities] = useState({});

  useEffect(() => {
    // Load liked items from localStorage on component mount
    const savedItems = getItemsFromLocalStorage();
    const initialLikes = {};
    savedItems.forEach((item) => {
      initialLikes[item.name] = true;
    });
    setLikedActivities(initialLikes);
  }, []);

  const toggleLike = (activity) => {
    const isLiked = likedActivities[activity.name];

    if (isLiked) {
      removeItemFromLocalStorage(activity.name);
    } else {
      saveItemToLocalStorage(activity);
    }

    setLikedActivities((prev) => ({
      ...prev,
      [activity.name]: !isLiked,
    }));
  };

  return (
    <div className="space-y-6">
      <ul className="space-y-4">
        {activities?.map((activity, index) => (
          <li
            key={index}
            className="relative p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200"
          >
            {/* Like Button */}
            <button
              onClick={() => toggleLike(activity)}
              className="absolute top-4 right-4 text-indigo-500 focus:outline-none"
              aria-label="Like"
            >
              {likedActivities[activity.name] ? (
                <BookmarkIconSolid className="h-6 w-6 text-red-500" />
              ) : (
                <BookmarkIconOutline className="h-6 w-6 text-gray-400 hover:text-red-500" />
              )}
            </button>

            {/* Activity Details */}
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

export default ActivitiesResult;
