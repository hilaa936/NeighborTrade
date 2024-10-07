// src/app/profile/page.js
export default function Profile() {
  return (
    <section className="p-8">
      <h2 className="text-3xl font-bold mb-4">Your Profile</h2>
      <p className="text-lg mb-6">
        Manage your profile information and produce listings here.
      </p>
      {/* Placeholder for profile information */}
      <div className="border p-4 rounded shadow mb-4">
        <h3 className="text-xl font-bold">Profile Information</h3>
        <p>Name: John Doe</p>
        <p>Email: john@example.com</p>
        <p>Grower Status: Yes</p>
      </div>
      {/* Placeholder for actions */}
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        Edit Profile
      </button>
    </section>
  );
}
