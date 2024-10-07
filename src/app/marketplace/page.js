// src/app/marketplace/page.js
import { formatDate } from "../../utils/formatDate";

export default function Marketplace() {
  const sampleProduce = [
    {
      id: 1,
      name: "Tomatoes",
      description: "Fresh tomatoes",
      createdAt: "2024-10-07",
    },
    {
      id: 2,
      name: "Carrots",
      description: "Organic carrots",
      createdAt: "2024-10-05",
    },
    {
      id: 3,
      name: "Kale",
      description: "Locally grown kale",
      createdAt: "2024-10-03",
    },
  ];

  return (
    <section className="p-8">
      <h2 className="text-3xl font-bold mb-4">Marketplace</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleProduce.map((produce) => (
          <div key={produce.id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-bold">{produce.name}</h3>
            <p>{produce.description}</p>
            <p className="text-sm text-gray-500">
              Listed on: {formatDate(produce.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
