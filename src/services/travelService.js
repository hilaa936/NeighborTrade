// services/tripService.js
import axios from "axios";

const TRAVEL_API_URL = "/api/travel/";
const TRAVEL_TRIP_API_URL = "/api/travel/trip";

export const fetchTrips = async () => {
  try {
    const response = await axios.get(TRAVEL_TRIP_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching trip by id:", error);
    throw error;
  }
};

export const createTrip = async (tripData) => {
  try {
    const response = await axios.post(TRAVEL_TRIP_API_URL, tripData);
    return response.data;
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
};

export const getTripById = async (tripId) => {
  try {
    const response = await axios.get(TRAVEL_TRIP_API_URL + `/${tripId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
};
export const deleteTrip = async (tripId) => {
  try {
    await axios.delete(TRAVEL_TRIP_API_URL + `/${tripId}`);
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
};
