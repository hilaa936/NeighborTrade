// src/app/marketplace/page.js
export default function Marketplace() {
  return (
    <section className="p-8">
      <h2 className="text-3xl font-bold mb-4">Marketplace</h2>
      <p className="text-lg mb-6">
        Browse and trade homegrown produce available in your community.
      </p>
      {/* Placeholder for produce listings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border p-4 rounded shadow">
          <h3 className="text-xl font-bold">Sample Product 1</h3>
          <p>Fresh homegrown tomatoes.</p>
        </div>
        <div className="border p-4 rounded shadow">
          <h3 className="text-xl font-bold">Sample Product 2</h3>
          <p>Organic carrots from my backyard.</p>
        </div>
        <div className="border p-4 rounded shadow">
          <h3 className="text-xl font-bold">Sample Product 3</h3>
          <p>Locally grown kale leaves.</p>
        </div>
      </div>
    </section>
  );
}
