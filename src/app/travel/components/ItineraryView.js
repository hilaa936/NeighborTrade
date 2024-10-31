// src/components/ItineraryView.js
"use client";

export default function ItineraryView({ itinerary }) {
  return (
    <div className="flex flex-col gap-6">
      {itinerary.days.map((day, index) => (
        <div
          key={index}
          className="bg-gray-100 p-3 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row gap-4"
        >
          <h2 className="text-lg font-semibold mb-2 ">
            Day {index + 1} - {day.date}
          </h2>
          <ul>
            {day.activities.map((activity, idx) => (
              <li key={idx} className="mb-2">
                {activity.time}: {activity.type} - {activity.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
