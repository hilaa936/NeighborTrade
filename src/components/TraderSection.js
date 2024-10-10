// components/TraderSection.js
import Link from "next/link";

export default function TraderSection() {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-2xl font-bold mb-4">Trader Dashboard</h2>
      <p className="text-gray-700 mb-6">
        Manage your inventory, add new produce, and view your trading history.
        Keep track of your active and inactive produce items, and ensure your
        stock is always up to date.
      </p>

      <Link
        href="/produce"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Manage Your Produce Inventory
      </Link>
    </div>
  );
}
