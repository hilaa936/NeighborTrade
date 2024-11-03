import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const CreateTrip = ({ user }) => {
  const router = useRouter();

  const [tripData, setTripData] = useState({
    name: "",
    userPreferences: {},
    tripDate: "",
    tripType: "",
    destination: "",
  });

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
      await axios.post("/api/trip", { ...tripData, userId: user.id });
      router.push("/trip"); // Redirect to trip overview page after successful creation
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create New Trip</h1>
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

        {/* Trip Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Trip Date
          </label>
          <input
            type="date"
            name="tripDate"
            value={tripData.tripDate}
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

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Destination
          </label>
          <input
            type="text"
            name="destination"
            value={tripData.destination}
            onChange={handleInputChange}
            placeholder="E.g., Greece"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
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
