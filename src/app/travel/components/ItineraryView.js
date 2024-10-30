// src/components/ItineraryView.js
"use client";
export default function ItineraryView({ itinerary }) {
  return (
    <div>
      {itinerary.days.map((day, index) => (
        <div key={index}>
          <h2>
            Day {index + 1} - {day.date}
          </h2>
          <ul>
            {day.activities.map((activity, idx) => (
              <li key={idx}>
                {activity.time}: {activity.type} - {activity.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
