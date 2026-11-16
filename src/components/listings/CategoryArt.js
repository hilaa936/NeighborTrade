// Placeholder art for listings without a photo
const ART = {
  vegetables: { emoji: "🥕", bg: "bg-orange-50" },
  fruits: { emoji: "🍋", bg: "bg-yellow-50" },
  herbs: { emoji: "🌿", bg: "bg-leaf-50" },
  plants: { emoji: "🪴", bg: "bg-emerald-50" },
  seeds: { emoji: "🌱", bg: "bg-lime-50" },
  other: { emoji: "🧺", bg: "bg-earth-50" },
};

export default function CategoryArt({ category, className = "text-5xl" }) {
  const { emoji, bg } = ART[category] ?? ART.other;
  return (
    <div className={`flex h-full w-full items-center justify-center ${bg}`}>
      <span className={className} aria-hidden>
        {emoji}
      </span>
    </div>
  );
}
