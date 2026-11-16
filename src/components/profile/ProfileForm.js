"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { MapPinIcon } from "@heroicons/react/20/solid";
import Avatar from "@/components/ui/Avatar";
import { useErrorMessage } from "@/components/ui/useErrorMessage";
import { api, uploadImage } from "@/lib/api";
import { LOCALITIES } from "@/lib/localities";
import { LIMITS } from "@/lib/options";

export default function ProfileForm({ user, next }) {
  const t = useTranslations("profile");
  const locale = useLocale();
  const router = useRouter();
  const errorMessage = useErrorMessage();
  const fileInput = useRef(null);
  const [form, setForm] = useState({
    name: user.name,
    bio: user.bio ?? "",
    image: user.image,
    localityId: user.localityId ?? "",
  });
  // Coordinates from "use my location"; null means use the locality center
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const localities = [...LOCALITIES].sort((a, b) => (a[locale] ?? a.he).localeCompare(b[locale] ?? b.he, locale));
  const set = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }));

  const locate = () => {
    if (!navigator.geolocation) return setLocating("failed");
    setLocating("busy");
    navigator.geolocation.getCurrentPosition(
      ({ coords: c }) => {
        setCoords({ lat: c.latitude, lng: c.longitude });
        setLocating("done");
      },
      () => setLocating("failed"),
      { enableHighAccuracy: false, timeout: 10_000 }
    );
  };

  const changePhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setStatus({ error: errorMessage(err) });
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      // Google pictures are kept as they are; only our uploads are sent back
      const image = form.image?.startsWith("/api/uploads/") ? form.image : null;
      await api("/api/me", {
        method: "PUT",
        body: {
          name: form.name,
          bio: form.bio,
          image: form.image === user.image && !image ? undefined : image,
          localityId: coords ? null : form.localityId || null,
          ...(coords ?? {}),
        },
      });
      setCoords(null);
      setStatus({ ok: true });
      if (next) router.push(next);
      router.refresh();
    } catch (err) {
      setStatus({ error: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-5 p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <Avatar user={{ ...user, name: form.name, image: form.image }} size="lg" />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => fileInput.current?.click()} className="btn btn-secondary btn-sm">
            {t("changePhoto")}
          </button>
          {form.image && (
            <button type="button" onClick={() => setForm((f) => ({ ...f, image: null }))} className="btn btn-ghost btn-sm">
              {t("removePhoto")}
            </button>
          )}
          <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={changePhoto} />
        </div>
      </div>

      <div>
        <label htmlFor="name" className="label">
          {t("name")}
        </label>
        <input id="name" className="input" value={form.name} onChange={set("name")} required minLength={2} maxLength={LIMITS.name} />
      </div>

      <div>
        <p className="label">{t("email")}</p>
        <p className="text-stone-600" dir="ltr">
          {user.email}
        </p>
      </div>

      <div>
        <label htmlFor="locality" className="label">
          {t("locality")}
        </label>
        <select
          id="locality"
          className="input"
          value={form.localityId}
          onChange={(event) => {
            setCoords(null);
            setLocating(null);
            set("localityId")(event);
          }}
        >
          <option value="">{t("localityPlaceholder")}</option>
          {localities.map((l) => (
            <option key={l.id} value={l.id}>
              {l[locale] ?? l.he}
            </option>
          ))}
        </select>
        <button type="button" onClick={locate} disabled={locating === "busy"} className="btn btn-ghost btn-sm mt-2 ps-1">
          <MapPinIcon className="h-4 w-4 text-earth-500" />
          {locating === "busy" ? t("locating") : t("useMyLocation")}
        </button>
        {locating === "done" && <p className="text-sm text-leaf-700">{t("locationSet")}</p>}
        {locating === "failed" && <p className="text-sm text-red-700">{t("locationFailed")}</p>}
        <p className="mt-1 text-xs text-stone-500">{t("locationPrivacy")}</p>
      </div>

      <div>
        <label htmlFor="bio" className="label">
          {t("bio")}
        </label>
        <textarea
          id="bio"
          className="input min-h-24"
          value={form.bio}
          onChange={set("bio")}
          placeholder={t("bioPlaceholder")}
          maxLength={LIMITS.bio}
        />
      </div>

      {status?.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{status.error}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn btn-primary">
          {t("save")}
        </button>
        {status?.ok && <span className="text-sm text-leaf-700">✓ {t("saved")}</span>}
        <Link href={`/users/${user.id}`} className="ms-auto text-sm text-stone-500 hover:text-stone-800">
          {t("publicLink")}
        </Link>
      </div>
    </form>
  );
}
