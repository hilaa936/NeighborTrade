// lib/travel/activities.ts

import accountsClient from "../prisma/accountsClient";
import travelClient from "../prisma/travelClient";

// Create Activity
export async function createActivity(activityData) {
  const newActivity = await travelClient.activity.create({
    data: {
      ...activityData,
    },
  });

  return newActivity;
}

// Update Activity
export async function updateActivity(activityId, updatedData) {
  const activity = await travelClient.activity.findUnique({
    where: { id: activityId },
  });

  if (!activity) {
    throw new Error("Activity not found");
  }

  const updatedActivity = await travelClient.activity.update({
    where: { id: activityId },
    data: {
      ...updatedData,
    },
  });

  return updatedActivity;
}

// Delete Activity
export async function deleteActivity(activityId) {
  const activity = await travelClient.activity.findUnique({
    where: { id: activityId },
  });

  if (!activity) {
    throw new Error("Activity not found");
  }

  await travelClient.activity.delete({
    where: { id: activityId },
  });

  return { message: "Activity deleted successfully" };
}

// Get All Activities
export async function getAllActivities() {
  const activities = await travelClient.activity.findMany();
  return activities;
}

// Get Activity by ID
export async function getActivityById(activityId) {
  const activity = await travelClient.activity.findUnique({
    where: { id: activityId },
  });

  if (!activity) {
    throw new Error("Activity not found");
  }

  return activity;
}

// Get Activities by User
export async function getActivitiesByUser(userId) {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const userActivities = await travelClient.userActivity.findMany({
    where: { userId },
    include: {
      activity: true, // Include activity details
    },
  });

  return userActivities;
}
