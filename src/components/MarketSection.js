// components/MarketSection.js
import Link from "next/link";

export default function MarketSection() {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-2xl font-bold mb-4">Marketplace</h2>
      <p className="text-gray-700 mb-6">
        Browse through a wide selection of produce from home growers and
        traders. Discover available items, connect with other traders, and
        facilitate bartering or purchasing of produce.
      </p>

      <Link
        href="/marketplace"
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
      >
        Explore the Marketplace
      </Link>
    </div>
  );
}
