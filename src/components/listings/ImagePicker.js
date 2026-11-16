"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { uploadImage } from "@/lib/api";
import { useErrorMessage } from "@/components/ui/useErrorMessage";

export default function ImagePicker({ images, onChange, max }) {
  const t = useTranslations("form");
  const errorMessage = useErrorMessage();
  const input = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const add = async (event) => {
    const files = [...event.target.files].slice(0, max - images.length);
    event.target.value = "";
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    const added = [];
    try {
      for (const file of files) added.push(await uploadImage(file));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      onChange([...images, ...added]);
      setUploading(false);
    }
  };

  return (
    <div>
      <p className="label">{t("photos", { max })}</p>
      <div className="flex flex-wrap gap-3">
        {images.map((src) => (
          <div key={src} className="relative h-24 w-24 overflow-hidden rounded-xl border border-stone-200">
            <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((s) => s !== src))}
              className="absolute end-1 top-1 rounded-full bg-black/60 p-1 text-white"
              aria-label={t("removePhoto")}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        {images.length < max && (
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={uploading}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-stone-300 text-xs text-stone-500 hover:border-leaf-400 hover:text-leaf-700"
          >
            <PhotoIcon className="h-6 w-6" />
            {uploading ? t("uploading") : t("addPhoto")}
          </button>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        multiple
        hidden
        onChange={add}
      />
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
