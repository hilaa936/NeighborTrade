export default function Home() {
  return (
    <section className="p-8">
      <h2 className="text-3xl font-bold mb-4">
        Welcome to the Produce Exchange Platform
      </h2>
      <p className="text-lg mb-6">
        A community-driven platform for trading homegrown fruits, vegetables,
        and plants.
      </p>
      <a
        href="/marketplace"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Visit the Marketplace
      </a>
    </section>
  );
}
