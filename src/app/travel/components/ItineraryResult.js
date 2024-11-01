// src/app/itinerary/components/ItineraryResult.js

export default function ItineraryResult({ itinerary }) {
  return (
    <div className="container mx-auto p-6 space-y-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 m-8">
        Your Travel Itinerary
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {itinerary.days.map((dayPlan, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition duration-300 hover:shadow-xl"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Day {dayPlan.day}
              </h2>

              {/* Activities Section */}
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Activities
                </h3>
                <ul className="space-y-2">
                  {dayPlan.activities.map((activity, idx) => (
                    <li
                      key={idx}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <p className="font-medium text-gray-700">
                        {activity.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.location} | {activity.time}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meals Section */}
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Meals
                </h3>
                <ul className="space-y-2">
                  {dayPlan.meals.map((meal, idx) => (
                    <li
                      key={idx}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <p className="font-medium text-gray-700">{meal.type}</p>
                      <p className="text-sm text-gray-500">
                        {meal.restaurant} - {meal.location}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Accommodation Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Accommodation
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="font-medium text-gray-700">
                    {dayPlan.accommodation.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {dayPlan.accommodation.address}
                  </p>
                  <p className="text-sm text-gray-500">
                    Price Range: {dayPlan.accommodation.price_range}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
