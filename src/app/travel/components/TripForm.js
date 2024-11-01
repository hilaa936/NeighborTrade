import { useState, useEffect } from "react";
import { getDateDifference } from "@/utils/formatDate";
import TripTypeDropdown from "./TripTypeDropdown";

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
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    destination: DESTINATIONS[0],
    startDate: today,
    endDate: today,
    interests: [],
    pace: "moderate",
    budget: "mid-range",
    style: "cultural",
    season: "spring",
    days: 1, // calculated from start and end dates
    tripType: "",
    customTripType: "",
  });
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const daysDifference = getDateDifference(
      formData.startDate,
      formData.endDate
    );
    setFormData((prev) => ({ ...prev, days: daysDifference }));
  }, [formData.startDate, formData.endDate]);

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
        endDate: value > prev.endDate ? value : prev.endDate,
      }));
    } else if (name === "endDate") {
      setFormData((prev) => ({ ...prev, endDate: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, destination: suggestion }));
    setShowSuggestions(false);
  };

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

        <TripTypeDropdown
          tripType={formData.tripType}
          onFieldChange={handleFieldChange}
        />

        {/* Dates and Days */}
        <div className="flex items-center mb-4">
          <div className="pr-5">
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
              min={today}
              className="mt-1 block w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="pl-5">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              min={formData.startDate}
              className="mt-1 block w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="pl-5">
            <label className="block text-sm font-medium text-gray-700">
              Days
            </label>
            <span className="text-gray-500">{formData.days} days</span>
          </div>
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
            className="mt-1 block  px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="leisurely">Leisurely</option>
            <option value="moderate">Moderate</option>
            <option value="packed">Packed</option>
          </select>
        </div>

        {/* Additional fields: Budget, Style, Season */}
        <div className="mb-4">
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-gray-700"
          >
            Budget Level
          </label>
          <select
            name="budget"
            id="budget"
            value={formData.budget}
            onChange={handleInputChange}
            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="budget">Budget</option>
            <option value="mid-range">Mid-Range</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="style"
            className="block text-sm font-medium text-gray-700"
          >
            Travel Style
          </label>
          <select
            name="style"
            id="style"
            value={formData.style}
            onChange={handleInputChange}
            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="relaxing">Relaxing</option>
            <option value="adventurous">Adventurous</option>
            <option value="cultural">Cultural</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="season"
            className="block text-sm font-medium text-gray-700"
          >
            Season/Weather
          </label>
          <select
            name="season"
            id="season"
            value={formData.season}
            onChange={handleInputChange}
            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="autumn">Autumn</option>
            <option value="winter">Winter</option>
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
