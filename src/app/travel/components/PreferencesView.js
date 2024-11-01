import React from "react";
import { formatDate, getDateDifference } from "@/utils/formatDate";

const PreferencesView = ({ preferencesData }) => {
  return (
    <>
      {preferencesData && (
        <div className="max-w-xl mx-auto bg-blue-50 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Your Preferences Trip Details
          </h2>

          <div className="flex flex-col justify-center">
            {/* Destination */}
            <div className="flex justify-center items-center">
              <span className="font-semibold text-gray-600 mr-2">
                Destination:
              </span>
              <span className="text-gray-700">
                {preferencesData.destination}
              </span>
            </div>
            <div className="flex justify-center items-center m-5">
              {/* Start Date */}
              <div className="flex flex-col items-center   p-3">
                <span className="font-semibold text-gray-600 mr-2">start:</span>
                <span className="text-gray-700">
                  {formatDate(preferencesData.startDate)}
                </span>
              </div>
              <span className="items-center">&#8658;</span>
              {/* End Date */}
              <div className="flex flex-col items-center p-3">
                <span className="font-semibold text-gray-600 mr-2">end:</span>
                <span className="text-gray-700">
                  {formatDate(preferencesData.endDate)}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center pb-3">
              <span className="font-semibold text-blue-600 mr-2">
                {getDateDifference(
                  preferencesData.startDate,
                  preferencesData.endDate
                )}
              </span>
            </div>
            {/* Interests */}
            {preferencesData.interests.length > 0 && (
              <div className="flex justify-center items-center md:col-span-2">
                <span className="font-semibold text-gray-600 mr-2">
                  Interests:
                </span>
                <span className="text-gray-700">
                  {preferencesData.interests.join(", ")}
                </span>
              </div>
            )}
            {/* Pace */}
            <div className="flex justify-center items-center">
              <span className="font-semibold text-gray-600 mr-2">
                Travel Pace:
              </span>
              <span className="text-gray-700">{preferencesData.pace}</span>
            </div>
            {/* style */}
            <div className="flex justify-center items-center">
              <span className="font-semibold text-gray-600 mr-2">
                Travel style:
              </span>
              <span className="text-gray-700">{preferencesData.style}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreferencesView;
