// src/services/fetchMockActivitiesAI.js

const mockActivities = {
  activities: [
    {
      image:
        "https://images.unsplash.com/photo-1591812371723-5c4d79e8a105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MHxwaG90by16dGl8MHx8fHwxNjYyMzAyMzg5&ixlib=rb-1.2.1&q=80&w=400",
      name: "Beach Volleyball at Gordon Beach",
      description:
        "Join a friendly game of beach volleyball with locals and visitors alike on the beautiful sands of Gordon Beach.",
      location: "Gordon Beach, Tel Aviv",
      category: "Sports",
      tags: ["beach", "volleyball", "sports", "outdoor"],
    },
    {
      name: "Visit to the Carmel Market",
      description:
        "Experience the vibrant atmosphere of the Carmel Market, where you can find fresh produce, local delicacies, and unique souvenirs.",
      location: "Carmel Market, Tel Aviv",
      category: "Market",
      tags: ["market", "food", "shopping", "local"],
    },
    {
      name: "Tel Aviv Museum of Art",
      description:
        "Explore a diverse collection of modern and contemporary art at one of Israel's leading art museums.",
      location: "Tel Aviv Museum of Art, Tel Aviv",
      category: "Culture",
      tags: ["art", "museum", "culture", "exhibits"],
    },
    {
      name: "Sunset at Jaffa Port",
      description:
        "Enjoy a breathtaking sunset over the Mediterranean Sea at the historic Jaffa Port, with a picturesque view and plenty of cafes to relax.",
      location: "Jaffa Port, Tel Aviv",
      category: "Sightseeing",
      tags: ["sunset", "view", "jaffa", "relax"],
    },
    {
      name: "Bike Tour Along the Tel Aviv Promenade",
      description:
        "Take a guided bike tour along the Tel Aviv promenade, enjoying the sea breeze and stunning views of the coastline.",
      location: "Tel Aviv Promenade, Tel Aviv",
      category: "Adventure",
      tags: ["bike", "tour", "coast", "outdoor"],
    },
    {
      name: "Street Art Tour in Florentin",
      description:
        "Discover the vibrant street art scene in the Florentin neighborhood, with local artists showcasing their talent on every corner.",
      location: "Florentin, Tel Aviv",
      category: "Culture",
      tags: ["street art", "culture", "florentin", "tour"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1599772141699-e4c1f8b2f8a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3MF98MHwxfGFsbHw5fHx8fHx8fHwxNjYxMjg0MzE4&ixlib=rb-1.2.1&q=80&w=400",
      name: "Visit the Yitzhak Rabin Center",
      description:
        "Learn about the life and legacy of former Prime Minister Yitzhak Rabin at this informative and engaging museum.",
      location: "Yitzhak Rabin Center, Tel Aviv",
      category: "History",
      tags: ["history", "museum", "yitzhak rabin", "education"],
    },
    {
      name: "Cooking Class: Traditional Israeli Cuisine",
      description:
        "Join a hands-on cooking class to learn how to prepare traditional Israeli dishes using fresh, local ingredients.",
      location: "Tel Aviv",
      category: "Culinary",
      tags: ["cooking", "food", "israeli", "class"],
    },
  ],
};

// Function to simulate fetching activities from an API
export const fetchMockActivitiesAI = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockActivities); // Simulate API response delay
    }, 500); // Simulate 500ms network delay
  });
};
