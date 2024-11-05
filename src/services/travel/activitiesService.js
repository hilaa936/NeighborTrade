// src/services/ActivitiesService.js

import axios from "axios";

const API_URL = "http://localhost:3000/api/travel"; // Adjust this based on your API URL

// Get all activities
export async function getAllActivities() {
  const response = await axios.get(`${API_URL}/activities`, {
    withCredentials: true, // Ensures that the session cookies are sent with the request
  });
  return response.data;
}

// Get a specific activity by ID
export async function getActivityById(id) {
  const response = await axios.get(`${API_URL}/activities/${id}`, {
    withCredentials: true,
  });
  return response.data;
}

// Create a new activity
export async function createActivity(activityData) {
  const response = await axios.post(`${API_URL}/activities`, { activityData });
  return response.data;
}

// Get all user activities
export async function getUserActivities() {
  const response = await axios.get(`${API_URL}/userActivities`, {
    withCredentials: true,
  });
  return response.data;
}

// Create a new user activity
export async function createUserActivity(userActivityData) {
  const response = await axios.post(`${API_URL}/userActivities`, {
    ...userActivityData,
  });
  return response.data;
}

// Get a specific user activity by ID
export async function getUserActivityById(id) {
  const response = await axios.get(`${API_URL}/userActivities/${id}`, {
    withCredentials: true,
  });
  return response.data;
}

export const apiTravelService = {
  getAllActivities,
  getActivityById,
  createActivity,
  getUserActivities,
  createUserActivity,
  getUserActivityById,
};
