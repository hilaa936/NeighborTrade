import { formatDate, getDateDifference } from "@/utils/formatDate";
import React from "react";

const TripDetailsView = ({ trip }) => {
  const { name } = trip;
  return (
    <div className="max-w-xl mx-auto p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        {trip.name || "Unnamed Trip"}
      </h2>
      <p>{trip.description}</p>
      <div className="flex flex-col justify-center">
        {/* Destination */}
        <div className="flex justify-center items-center">
          <span className="font-semibold text-gray-600 mr-2">Destination:</span>
          <span className="text-gray-700">
            {trip.destination || "Not specified"}
          </span>
        </div>
        <div className="flex justify-center items-center m-5">
          {/* Start Date */}
          <div className="flex flex-col items-center   p-3">
            <span className="font-semibold text-gray-600 mr-2">start:</span>
            <span className="text-gray-700">
              {formatDate(trip.tripStartDate)}
            </span>
          </div>
          <span className="items-center">&#8658;</span>
          {/* End Date */}
          <div className="flex flex-col items-center p-3">
            <span className="font-semibold text-gray-600 mr-2">end:</span>
            <span className="text-gray-700">
              {formatDate(trip.tripEndDate)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center pb-3">
          <span className="font-semibold text-blue-600 mr-2">
            {getDateDifference(trip.tripStartDate, trip.tripEndDate)}
          </span>
        </div>
        {/* Interests */}
        {trip.userPreferences?.interests?.length > 0 && (
          <div className="flex justify-center items-center md:col-span-2">
            <span className="font-semibold text-gray-600 mr-2">Interests:</span>
            <span className="text-gray-700">
              {trip?.userPreferences?.interests}
            </span>
          </div>
        )}
        {/* Pace */}
        {trip?.userPreferences?.budgetLevel && (
          <div className="flex justify-center items-center">
            <span className="font-semibold text-gray-600 mr-2">
              Travel Pace:
            </span>
            <span className="text-gray-700">
              {trip.userPreferences?.budgetLevel}
            </span>
          </div>
        )}

        {/* style */}
        {trip.style && (
          <div className="flex justify-center items-center">
            <span className="font-semibold text-gray-600 mr-2">
              Travel style:
            </span>
            <span className="text-gray-700">{trip.style}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetailsView;
