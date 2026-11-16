import Image from "next/image";
import CategoryArt from "./CategoryArt";

// First photo of a listing, or its category art
export default function ListingImage({ listing, sizes = "(min-width: 768px) 25vw, 50vw", artClassName }) {
  const src = listing.images?.[0];
  if (!src) return <CategoryArt category={listing.category} className={artClassName} />;
  return <Image src={src} alt="" fill sizes={sizes} className="object-cover" />;
}
