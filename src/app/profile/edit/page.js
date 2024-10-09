"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditProfilePage() {
  const { data: session, status } = useSession(); // Get the user session
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    website: "",
    phoneNumber: "",
    birthdate: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(); // Redirect to login if not authenticated
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (res.ok) {
          setProfile(data);
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            bio: data.bio || "",
            location: data.location || "",
            website: data.website || "",
            phoneNumber: data.phoneNumber || "",
            birthdate: data.birthdate
              ? new Date(data.birthdate).toISOString().substring(0, 10)
              : "",
          });
        } else {
          setError(data.error || "Failed to load profile.");
        }
      } catch (err) {
        setError("Failed to load profile.");
      }
      setLoading(false);
    };

    if (session) {
      fetchProfile();
    }
  }, [session, status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/profile", {
        method: "POST", // Use POST for updating profile
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Redirect or notify the user that the profile has been updated
        router.push("/profile");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update profile.");
      }
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-md">
      <div className="mt-6 mb-6">
        <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>
        {/* Go Back to Profile Button */}
        <Link
          href="/profile"
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Go Back to Profile
        </Link>
      </div>
      <form onSubmit={handleFormSubmit}>
        {/* First Name */}
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Bio
          </label>
          <textarea
            name="bio"
            id="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            rows={4}
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Website */}
        <div className="mb-4">
          <label
            htmlFor="website"
            className="block text-sm font-medium text-gray-700"
          >
            Website
          </label>
          <input
            type="text"
            name="website"
            id="website"
            value={formData.website}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Birthdate */}
        <div className="mb-4">
          <label
            htmlFor="birthdate"
            className="block text-sm font-medium text-gray-700"
          >
            Birthdate
          </label>
          <input
            type="date"
            name="birthdate"
            id="birthdate"
            value={formData.birthdate}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
