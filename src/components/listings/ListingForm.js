"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { CATEGORIES, DEFAULT_EXPIRY, EXPIRY_OPTIONS, LIMITS, MAX_IMAGES, UNITS } from "@/lib/options";
import { useErrorMessage } from "@/components/ui/useErrorMessage";
import ImagePicker from "./ImagePicker";

const EMPTY = {
  title: "",
  description: "",
  category: "vegetables",
  customCategory: "",
  quantity: "1",
  unit: "KG",
  isFree: true,
  isExchange: false,
  wanted: "",
  openToOffers: false,
  images: [],
  expiry: DEFAULT_EXPIRY,
};

// Create (no listing) or edit an existing listing
export default function ListingForm({ listing, hasLocation }) {
  const t = useTranslations("form");
  const tCategory = useTranslations("categories");
  const tUnit = useTranslations("units");
  const router = useRouter();
  const errorMessage = useErrorMessage();
  const [form, setForm] = useState(() =>
    listing
      ? {
          ...EMPTY,
          ...listing,
          description: listing.description ?? "",
          customCategory: listing.customCategory ?? "",
          wanted: listing.wanted ?? "",
          quantity: String(listing.quantity),
          expiry: listing.expiresAt ? DEFAULT_EXPIRY : "always",
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const noOfferType = !form.isFree && !form.isExchange && !form.openToOffers;

  const submit = async (event) => {
    event.preventDefault();
    if (noOfferType) return;
    setSaving(true);
    setError(null);
    const body = {
      title: form.title,
      description: form.description,
      category: form.category,
      customCategory: form.customCategory,
      quantity: Number(form.quantity),
      unit: form.unit,
      isFree: form.isFree,
      isExchange: form.isExchange,
      wanted: form.wanted,
      openToOffers: form.openToOffers,
      images: form.images,
      expiry: form.expiry,
    };
    try {
      if (listing) {
        await api(`/api/listings/${listing.id}`, { method: "PUT", body });
        router.push(`/listings/${listing.id}`);
      } else {
        const { listing: created } = await api("/api/listings", { method: "POST", body });
        router.push(`/listings/${created.id}`);
      }
      router.refresh();
    } catch (err) {
      setError(err);
      setSaving(false);
    }
  };

  if (!hasLocation) {
    return (
      <div className="card space-y-4 p-6 text-center">
        <p className="text-stone-700">{t("needLocation")}</p>
        <Link href="/profile?next=/listings/new" className="btn btn-primary">
          {t("goToProfile")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-5 p-5 sm:p-6">
      <div>
        <label htmlFor="title" className="label">
          {t("title")}
        </label>
        <input
          id="title"
          className="input"
          value={form.title}
          onChange={set("title")}
          placeholder={t("titlePlaceholder")}
          required
          minLength={2}
          maxLength={LIMITS.title}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="label">
            {t("category")}
          </label>
          <select id="category" className="input" value={form.category} onChange={set("category")}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {tCategory(c)}
              </option>
            ))}
          </select>
        </div>
        {form.category === "other" && (
          <div>
            <label htmlFor="customCategory" className="label">
              {t("customCategory")}
            </label>
            <input
              id="customCategory"
              className="input"
              value={form.customCategory}
              onChange={set("customCategory")}
              placeholder={t("customCategoryPlaceholder")}
              required
              maxLength={LIMITS.customCategory}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantity" className="label">
            {t("quantity")}
          </label>
          <input
            id="quantity"
            type="number"
            inputMode="decimal"
            min="0.1"
            step="any"
            className="input"
            value={form.quantity}
            onChange={set("quantity")}
            required
          />
        </div>
        <div>
          <label htmlFor="unit" className="label">
            {t("unit")}
          </label>
          <select id="unit" className="input" value={form.unit} onChange={set("unit")}>
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {tUnit(u)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className="label">{t("howToGive")}</legend>
        <div className="space-y-2">
          <Toggle checked={form.isFree} onChange={set("isFree")} label={t("free")} />
          <Toggle checked={form.isExchange} onChange={set("isExchange")} label={t("exchange")} />
          {form.isExchange && (
            <div className="ps-8">
              <label htmlFor="wanted" className="label">
                {t("wanted")}
              </label>
              <input
                id="wanted"
                className="input"
                value={form.wanted}
                onChange={set("wanted")}
                placeholder={t("wantedPlaceholder")}
                maxLength={LIMITS.wanted}
              />
            </div>
          )}
          <Toggle
            checked={form.openToOffers}
            onChange={set("openToOffers")}
            label={t("openToOffers")}
            hint={t("openToOffersHint")}
          />
        </div>
        {noOfferType && <p className="mt-2 text-sm text-red-700">{t("offerRequired")}</p>}
      </fieldset>

      <div>
        <label htmlFor="description" className="label">
          {t("description")}
        </label>
        <textarea
          id="description"
          className="input min-h-24"
          value={form.description}
          onChange={set("description")}
          placeholder={t("descriptionPlaceholder")}
          maxLength={LIMITS.description}
        />
      </div>

      <ImagePicker
        images={form.images}
        onChange={(images) => setForm((f) => ({ ...f, images }))}
        max={MAX_IMAGES}
      />

      <div>
        <label htmlFor="expiry" className="label">
          {t("expiry")}
        </label>
        <select id="expiry" className="input" value={form.expiry} onChange={set("expiry")}>
          {EXPIRY_OPTIONS.map((e) => (
            <option key={e} value={e}>
              {t(`expiryOptions.${e}`)}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-stone-500">{t("locationNote")}</p>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{errorMessage(error)}</p>}

      <div className="flex gap-3">
        <button type="submit" className="btn btn-primary flex-1 py-3 sm:flex-none" disabled={saving || noOfferType}>
          {saving ? t("saving") : listing ? t("save") : t("publish")}
        </button>
        <button type="button" onClick={() => router.back()} className="btn btn-ghost">
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}

function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-200 px-3 py-2.5 has-[:checked]:border-leaf-400 has-[:checked]:bg-leaf-50">
      <input type="checkbox" checked={checked} onChange={onChange} className="mt-1 h-4 w-4 accent-leaf-600" />
      <span>
        <span className="font-medium text-stone-800">{label}</span>
        {hint && <span className="block text-sm text-stone-500">{hint}</span>}
      </span>
    </label>
  );
}
