"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { LIMITS } from "@/lib/options";
import { useErrorMessage } from "@/components/ui/useErrorMessage";
import GoogleButton from "./GoogleButton";
import { Divider } from "./LoginForm";

export default function RegisterForm({ callbackUrl, googleEnabled }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const errorMessage = useErrorMessage();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const set = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/api/auth/register", { method: "POST", body: form });
      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (!result?.ok) throw new Error();
      // New users pick their locality first, then continue
      router.replace(`/profile?next=${encodeURIComponent(callbackUrl)}`);
      router.refresh();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="name" className="label">
            {t("name")}
          </label>
          <input id="name" autoComplete="nickname" className="input" value={form.name} onChange={set("name")} required minLength={2} maxLength={LIMITS.name} />
        </div>
        <div>
          <label htmlFor="email" className="label">
            {t("email")}
          </label>
          <input id="email" type="email" dir="ltr" autoComplete="email" className="input" value={form.email} onChange={set("email")} required />
        </div>
        <div>
          <label htmlFor="password" className="label">
            {t("password")}
          </label>
          <input
            id="password"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            className="input"
            value={form.password}
            onChange={set("password")}
            required
            minLength={LIMITS.passwordMin}
            maxLength={LIMITS.passwordMax}
          />
          <p className="mt-1 text-xs text-stone-500">{t("passwordHint")}</p>
        </div>
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary w-full py-3">
          {t("register")}
        </button>
        <p className="text-center text-xs text-stone-500">
          {t.rich("agree", {
            terms: (chunks) => <Link href="/terms" className="underline">{chunks}</Link>,
            privacy: (chunks) => <Link href="/privacy" className="underline">{chunks}</Link>,
          })}
        </p>
      </form>
      {googleEnabled && (
        <>
          <Divider label={t("or")} />
          <GoogleButton callbackUrl={callbackUrl} />
        </>
      )}
      <p className="text-center text-sm text-stone-600">
        {t("haveAccount")}{" "}
        <Link href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-leaf-700 hover:underline">
          {t("login")}
        </Link>
      </p>
    </>
  );
}
