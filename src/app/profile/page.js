"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession(); // Get user session
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Use the profile picture from session or profile, or fallback to default image
  const profilePicture =
    profile?.profilePicture ||
    session?.user?.image ||
    "/images/default-profile.jpg"; // Use relative path for public images
  const fullName =
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
    session?.user?.name ||
    "User";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-md">
      <div className="flex flex-col items-center">
        {/* Profile Picture */}
        <div className="w-32 h-32 mb-4">
          <Image
            src={profilePicture}
            alt="Profile Picture"
            className="rounded-full object-cover w-full h-full"
            width={128}
            height={128}
          />
        </div>

        {/* Full Name */}
        <h1 className="text-2xl font-semibold">{fullName}</h1>

        {/* Bio */}
        {profile?.bio ? (
          <p className="text-gray-600 mt-2">{profile.bio}</p>
        ) : (
          <p className="text-gray-400 mt-2">No bio available</p>
        )}

        {/* Location, Website, and Other Details */}
        <div className="mt-4">
          {profile?.location && (
            <p className="text-gray-600">
              <strong>Location:</strong> {profile.location}
            </p>
          )}
          {profile?.website && (
            <p className="text-blue-500">
              <strong>Website:</strong>{" "}
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.website}
              </a>
            </p>
          )}
          {profile?.phoneNumber && (
            <p className="text-gray-600">
              <strong>Phone:</strong> {profile.phoneNumber}
            </p>
          )}
          {profile?.birthdate && (
            <p className="text-gray-600">
              <strong>Birthdate:</strong>{" "}
              {new Date(profile.birthdate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
