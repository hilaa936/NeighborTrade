import MarketSection from "@/app/tradingMarket/components/MarketSection";
import TraderSection from "@/app/tradingMarket/components/TraderSection";
import Link from "next/link";

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
      <div className="w-64 m-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <Link href={"/travel/trip"}>Planning Trip</Link>
      </div>
      <MarketSection />
      <TraderSection />
    </section>
  );
}
