export default function MarketplaceList({ produces }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {produces.map((produce) => (
        <div
          key={produce.id}
          className="bg-white p-4 rounded-lg shadow-md relative"
        >
          {/* Trader Info (Name & Picture) */}
          <div className="flex flex-row items-center mb-4">
            <h3 className="text-lg font-bold">{produce.trader.name}</h3>
            <h2 className="text-xl font-bold">{produce.name}</h2>
          </div>

          {/* Produce Info */}

          <p className="text-gray-700">
            {produce.description || "No description available."}
          </p>
          <div className="mt-4">
            <span>Quantity: {produce.quantity}</span>
          </div>
          <p className="text-green-500 mt-2">{produce.trader.username}</p>

          {/* Trade Button */}
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
            Trade
          </button>
        </div>
      ))}
    </div>
  );
}
