// src/lib/travel/userActivity.js

import travelClient from "../prisma/travelClient";
import { getUserById } from "@/lib/user";

// Add UserActivity
export async function addUserActivity(userId, activityData) {
  // Step 1: Check if the user exists
  // const user = await accountsClient.user.findUnique({
  //   where: { id: userId },
  // });

  // if (!user) {
  //   throw new Error("User not found");
  // }

  // Step 2: Check if the activity exists; if not, create it
  let activity = await travelClient.activity.findUnique({
    where: { id: activityData.activityId }, // Assuming activityData includes an id
  });
  if (!activity) {
    throw new Error("Activity not found");
  }
  // Step 3: Check if the user activity exists
  let userActivityExist = await travelClient.userActivity.findFirst({
    where: { userId: userId, activityId: activityData.activityId }, // Assuming activityData includes an id
  });
  if (userActivityExist) {
    throw new Error("User Activity already exist");
  }
  // Step 3: Create UserActivity entry
  const userActivity = await travelClient.userActivity.create({
    data: {
      userId: userId,
      ...activityData,
    },
  });

  return userActivity;
}

// Edit UserActivity
export async function editUserActivity(userActivityId, updatedData) {
  const userActivity = await travelClient.userActivity.findUnique({
    where: { id: userActivityId },
  });

  if (!userActivity) {
    throw new Error("UserActivity not found");
  }

  const updatedUserActivity = await travelClient.userActivity.update({
    where: { id: userActivityId },
    data: {
      status: updatedData.status,
      notes: updatedData.notes,
    },
  });

  return updatedUserActivity;
}

// Delete UserActivity
export async function deleteUserActivity(userActivityId) {
  const userActivity = await travelClient.userActivity.findUnique({
    where: { id: userActivityId },
  });

  if (!userActivity) {
    throw new Error("UserActivity not found");
  }

  await travelClient.userActivity.delete({
    where: { id: userActivityId },
  });

  return { message: "UserActivity deleted successfully" };
}

// Get UserActivities
export async function getUserActivities(userId) {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const userActivities = await travelClient.userActivity.findMany({
    where: { userId },
    include: {
      activity: true, // Include related activity details
    },
  });

  return userActivities;
}

// Get UserActivity
export async function getUserActivity(userActivityId) {
  const userActivity = await travelClient.userActivity.findUnique({
    where: { id: userActivityId },
    include: {
      activity: true, // Include related activity details
    },
  });

  if (!userActivity) {
    throw new Error("UserActivity not found");
  }

  return userActivity;
}
