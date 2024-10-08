"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession(); // Get user session
  const router = useRouter();
  const [profile, setProfile] = useState(null); // Profile data state
  const [profilePicture, setProfilePicture] = useState(""); // Profile picture URL state
  const [contactInfo, setContactInfo] = useState(""); // Contact information state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error message state

  // Fetch profile data when component mounts
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(); // Redirect to login if user is not authenticated
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (res.ok) {
          setProfile(data);
          setProfilePicture(data.profilePicture || "");
          setContactInfo(data.contactInfo || "");
        } else {
          setError(data.error || "Error fetching profile");
        }
      } catch (err) {
        setError("Failed to load profile");
      }
      setLoading(false);
    };

    if (session) {
      fetchProfile();
    }
  }, [session, status]);

  // Handle form submission for updating profile
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profilePicture,
          contactInfo,
        }),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        router.reload(); // Reload the page to reflect updated profile
      } else {
        const data = await res.json();
        setError(data.error || "Error updating profile");
      }
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  if (loading) return <p>Loading...</p>; // Show loading message
  if (error) return <p className="text-red-500">{error}</p>; // Show error message

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        {/* Profile Picture URL Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture URL
          </label>
          <input
            type="text"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="https://example.com/profile.jpg"
          />
        </div>

        {/* Contact Information Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Contact Information
          </label>
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter your contact info"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
