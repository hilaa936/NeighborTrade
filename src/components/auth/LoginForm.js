"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import GoogleButton from "./GoogleButton";

export default function LoginForm({ callbackUrl, googleEnabled }) {
  const t = useTranslations("auth");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = await signIn("credentials", { email, password, redirect: false }).catch(() => null);
    if (result?.ok) {
      router.replace(callbackUrl);
      router.refresh();
      return;
    }
    setError(result?.status === 429 ? tErrors("rate_limited") : result ? t("invalid") : tErrors("network"));
    setBusy(false);
  };

  return (
    <>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">
            {t("email")}
          </label>
          <input id="email" type="email" dir="ltr" autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password" className="label">
            {t("password")}
          </label>
          <input id="password" type="password" dir="ltr" autoComplete="current-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary w-full py-3">
          {t("login")}
        </button>
      </form>
      {googleEnabled && (
        <>
          <Divider label={t("or")} />
          <GoogleButton callbackUrl={callbackUrl} />
        </>
      )}
      <p className="text-center text-sm text-stone-600">
        {t("noAccount")}{" "}
        <Link href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-leaf-700 hover:underline">
          {t("register")}
        </Link>
      </p>
    </>
  );
}

export function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 text-xs text-stone-400">
      <span className="h-px flex-1 bg-stone-200" />
      {label}
      <span className="h-px flex-1 bg-stone-200" />
    </div>
  );
}
