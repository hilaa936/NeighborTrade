"use client";

import React, { useState } from "react";
import { apiTravelService } from "@/services/travel/activitiesService";

const ActivityForm = ({ onCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const activityData = {
      name,
      description,
      location,
      category,
      tags: tags.split(",").map((tag) => tag.trim()),
    };

    try {
      const newActivity = await apiTravelService.createActivity(activityData);
      onCreated();
      // Reset form fields
      setName("");
      setDescription("");
      setLocation("");
      setCategory("");
      setTags("");
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 border rounded-lg shadow-lg bg-white"
    >
      <h2 className="text-xl font-semibold mb-4">Create Activity</h2>
      <div className="mb-4">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="name"
        >
          Activity Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Hiking in the Mountains"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="name"
        >
          Activity Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter activity name"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter activity description"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="location"
        >
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter activity location"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="category"
        >
          Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter activity category"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="tags"
        >
          Tags (comma separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter tags"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
      >
        Create Activity
      </button>
    </form>
  );
};

export default ActivityForm;
