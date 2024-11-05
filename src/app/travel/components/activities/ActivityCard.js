import React from "react";
// import AddUserActivityForm from "@/components/AddUserActivityForm";

const ActivityCard = ({ activity, userActivities }) => {
  return (
    <div className="border rounded-lg shadow-lg p-4 mb-4 bg-white">
      <h3 className="text-lg font-semibold">{activity?.name}</h3>
      <p className="text-gray-600">{activity?.description}</p>
      <p className="text-gray-500">Location: {activity.location}</p>
      <p className="text-gray-500">Category: {activity.category}</p>
      <p className="text-gray-500">Tags: {activity?.tags?.join(", ")}</p>

      {/* Render the AddUserActivityForm for this activity */}
      {/* <AddUserActivityForm
        activity={activity}
        userActivities={userActivities}
      /> */}
    </div>
  );
};

export default ActivityCard;
