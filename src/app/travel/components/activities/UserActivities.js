"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { apiTravelService } from "@/services/travel/activitiesService";

const UserActivities = () => {
  const user = useUser(); // Get the logged-in user from context
  const [userActivities, setUserActivities] = useState([]);

  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        const data = await apiTravelService.getUserActivities(); // No need to pass token
        setUserActivities(data);
      } catch (error) {
        console.error("Error fetching user activities:", error);
      }
    };

    fetchUserActivities();
  }, [user]); // Optional: re-fetch if user changes

  return (
    <div className="flex flex-col items-center w-full p-5 border-t-2">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Your Activities
      </h2>
      {user ? (
        <>
          <ul>
            {userActivities.map((userActivity) => (
              <li key={userActivity.id}>
                {userActivity.activity.name} - Status: {userActivity.status}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p> Please log in to see your activities.</p>
      )}
    </div>
  );
};

export default UserActivities;
