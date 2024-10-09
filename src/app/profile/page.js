"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

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
    "/images/default-profile.png";
  const fullName =
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
    session?.user?.name ||
    "User";

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      {/* Profile Picture Section */}
      <div className="flex justify-center mb-8">
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
          <Image
            src={profilePicture}
            alt="Profile Picture"
            className="object-cover w-full h-full"
            width={128}
            height={128}
          />
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="text-center">
        {/* Full Name */}
        <h1 className="text-3xl font-bold text-gray-800">{fullName}</h1>

        {/* Bio */}
        {profile?.bio ? (
          <p className="text-lg text-gray-600 mt-4">{profile.bio}</p>
        ) : (
          <p className="text-lg text-gray-400 mt-4">No bio available</p>
        )}

        {/* Profile Details Section */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            {profile?.location && (
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-gray-500">
                  Location
                </span>
                <span className="text-lg text-gray-700">
                  {profile.location}
                </span>
              </div>
            )}

            {/* Website */}
            {profile?.website && (
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-gray-500">
                  Website
                </span>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-blue-600 hover:text-blue-800"
                >
                  {profile.website}
                </a>
              </div>
            )}

            {/* Phone Number */}
            {profile?.phoneNumber && (
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-gray-500">
                  Phone
                </span>
                <span className="text-lg text-gray-700">
                  {profile.phoneNumber}
                </span>
              </div>
            )}

            {/* Birthdate */}
            {profile?.birthdate && (
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-gray-500">
                  Birthdate
                </span>
                <span className="text-lg text-gray-700">
                  {new Date(profile.birthdate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-10">
          <Link
            href="/profile/edit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
