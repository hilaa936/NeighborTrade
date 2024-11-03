// components/CreateTrip.js
import { useState } from "react";
import axios from "axios";
const DESTINATIONS = [
  "New York",
  "Los Angeles",
  "San Francisco",
  "Miami",
  "Chicago",
  "Paris",
  "London",
  "Tokyo",
  "Sydney",
  "Rome",
];

const CreateTrip = ({ onClose, userId, onTripCreated }) => {
  const today = new Date().toISOString().split("T")[0];

  const [tripData, setTripData] = useState({
    name: "",
    userPreferences: {},
    tripStartDate: today,
    tripEndDate: today,
    tripType: "",
    destination: "", // DESTINATIONS[0],
  });

  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleDestInput = (e) => {
    const { name, value, type, checked } = e.target;
    setTripData((prev) => ({ ...prev, destination: value }));
    if (value.length > 0) {
      const suggestions = DESTINATIONS.filter((dest) =>
        dest.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredDestinations(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };
  const handleSuggestionClick = (suggestion) => {
    setTripData((prev) => ({ ...prev, destination: suggestion }));
    setShowSuggestions(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData({
      ...tripData,
      [name]: value,
    });
  };

  const handlePreferencesChange = (e) => {
    const { name, value } = e.target;
    setTripData((prevState) => ({
      ...prevState,
      userPreferences: {
        ...prevState.userPreferences,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/travel/trip", { ...tripData, userId });
      onTripCreated(); // Refresh trip list after successful creation
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Trip</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Trip Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Trip Name
          </label>
          <input
            type="text"
            name="name"
            value={tripData.name}
            onChange={handleInputChange}
            required
            placeholder="E.g., Honeymoon with my love"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Trip Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            name="tripStartDate"
            min={today}
            value={tripData.tripStartDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Trip End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            name="tripEndDate"
            value={tripData.tripEndDate}
            min={tripData.tripStartDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Trip Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Trip Type
          </label>
          <select
            name="tripType"
            value={tripData.tripType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Type</option>
            <option value="solo">Solo</option>
            <option value="couple">Couple</option>
            <option value="friends">Friends</option>
            <option value="family">Family</option>
            <option value="kids">With Kids</option>
          </select>
        </div>
        {/* Destination with Autocomplete */}
        <div className="mb-4 relative">
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700"
          >
            Destination
          </label>
          <input
            type="text"
            name="destination"
            id="destination"
            value={tripData.destination}
            onChange={handleDestInput}
            className="w-full mt-1 block  px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
            autoComplete="off"
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No results found</li>
              )}
            </ul>
          )}
        </div>

        {/* User Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preferences
          </label>
          <input
            type="text"
            name="interests"
            onChange={handlePreferencesChange}
            placeholder="E.g., Beach, Hiking"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="budgetLevel"
            onChange={handlePreferencesChange}
            placeholder="E.g., Budget, Mid-Range, Luxury"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md mt-4 hover:bg-indigo-700"
        >
          Create Trip
        </button>
      </form>
    </div>
  );
};

export default CreateTrip;
