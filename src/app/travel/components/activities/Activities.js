"use client";
import { apiTravelService } from "@/services/travel/activitiesService";
import React, { useEffect, useState } from "react";
import CreateActivityModal from "./CreateActivityModal";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import {
  getItemsFromLocalStorage,
  removeItemFromLocalStorage,
  saveItemToLocalStorage,
} from "@/services/localStorageService";
import ActivityInfo from "./ActivityInfo";
import AddUserActivityButton from "./AddUserActivityButton";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [userActivities, setUserActivities] = useState({});

  useEffect(() => {
    fetchActivities();
    useLocalStorageActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const data = await apiTravelService.getAllActivities();
      setActivities(data);
      // const userActivitiesData = await apiTravelService.getUserActivities();
      // setUserActivities(userActivitiesData);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleActivityCreated = async () => {
    await fetchActivities();
  };
  const useLocalStorageActivities = () => {
    // Load liked items from localStorage on component mount
    const savedItems = getItemsFromLocalStorage();
    const initialActivity = {};
    savedItems.forEach((item) => {
      initialActivity[item.name] = true;
    });
    setUserActivities(initialActivity);
  };
  const toggleBookmark = (activity) => {
    const isLiked = userActivities[activity.name];

    if (isLiked) {
      removeItemFromLocalStorage(activity.name);
    } else {
      saveItemToLocalStorage(activity);
    }

    setUserActivities((prev) => ({
      ...prev,
      [activity.name]: !isLiked,
    }));
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h2>All Activities</h2>
      <CreateActivityModal onCreated={handleActivityCreated} />

      <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity, index) => (
          <li key={index + activity.id}>
            <div className="relative p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
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
              <AddUserActivityButton activity={activity} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Activities;
