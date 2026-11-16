"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import CategoryArt from "./CategoryArt";

export default function ListingPhotos({ listing }) {
  const t = useTranslations("listing");
  const [index, setIndex] = useState(0);
  const images = listing.images ?? [];

  if (images.length === 0) {
    return (
      <div className="card relative aspect-square overflow-hidden">
        <CategoryArt category={listing.category} className="text-8xl" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="card relative aspect-square overflow-hidden">
        <Image
          src={images[index]}
          alt={t("photoAlt", { title: listing.title })}
          fill
          sizes="(min-width: 768px) 450px, 100vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 ${
                i === index ? "border-leaf-500" : "border-transparent opacity-70"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
