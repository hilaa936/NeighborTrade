import { useState, useEffect } from "react";
import DateDifference from "./DateDifference";
import { getDateDifference } from "@/utils/formatDate";

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

export default function TripForm({ onSubmit }) {
  // Set today's date as the default start & end date
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    destination: "",
    startDate: today,
    endDate: today,
    interests: [],
    pace: "moderate",
  });
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "destination") {
      setFormData((prev) => ({ ...prev, destination: value }));
      if (value.length > 0) {
        const suggestions = DESTINATIONS.filter((dest) =>
          dest.toLowerCase().startsWith(value.toLowerCase())
        );
        setFilteredDestinations(suggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        interests: checked
          ? [...prev.interests, value]
          : prev.interests.filter((i) => i !== value),
      }));
    } else if (name === "startDate") {
      setFormData((prev) => ({
        ...prev,
        startDate: value,
        endDate: value > prev.endDate ? value : prev.endDate, // Update end date if start date is later
      }));
    } else if (name === "endDate") {
      setFormData((prev) => ({ ...prev, endDate: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle selecting a suggestion
  const handleSuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, destination: suggestion }));
    setShowSuggestions(false);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-6">Fill Your Trip Preferences</h2>

      <form onSubmit={handleSubmit}>
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
            value={formData.destination}
            onChange={handleInputChange}
            className="mt-1 block  px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
            autoComplete="off"
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg w-full mt-1">
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
        <div className="flex  items-center">
          {/* Start Date with default to today */}
          <div className="mb-4 pr-5">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              min={today} // Disable past dates
              className="mt-1 block w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          {/* End Date */}
          <div className="mb-4 p-5">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <div className="flex">
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate} // Ensure end date is not before start date
                className="mt-1 block w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
          </div>
          <span className="text-gray-500">
            {getDateDifference(formData.startDate, formData.endDate)}
          </span>
        </div>
        {/* Interests */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Interests
          </label>
          <div className="mt-1">
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                value="sightseeing"
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span className="ml-2">Sightseeing</span>
            </label>
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                value="dining"
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span className="ml-2">Dining</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                value="shopping"
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span className="ml-2">Shopping</span>
            </label>
          </div>
        </div>

        {/* Travel Pace */}
        <div className="mb-4">
          <label
            htmlFor="pace"
            className="block text-sm font-medium text-gray-700"
          >
            Travel Pace
          </label>
          <select
            name="pace"
            id="pace"
            value={formData.pace}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="leisurely">Leisurely</option>
            <option value="moderate">Moderate</option>
            <option value="packed">Packed</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Generate Itinerary
          </button>
        </div>
      </form>
    </div>
  );
}
