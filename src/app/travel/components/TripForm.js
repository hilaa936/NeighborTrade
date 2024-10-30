// src/components/TripForm.js

import { useState } from "react";

export default function TripForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    interests: [],
    pace: "moderate",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        interests: checked
          ? [...prev.interests, value]
          : prev.interests.filter((i) => i !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-md">
      <div className="mt-6 mb-6">
        <h1 className="text-2xl font-semibold mb-6">
          Select Your Trip Preferences
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Destination */}
        <div className="mb-4">
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
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Start Date */}
        <div className="mb-4">
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
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* End Date */}
        <div className="mb-4">
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
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
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
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="ml-2">Sightseeing</span>
            </label>
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                value="dining"
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="ml-2">Dining</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                value="shopping"
                onChange={handleChange}
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
            onChange={handleChange}
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
