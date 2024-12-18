"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Login from "../components/Login";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      // Redirect to home page if user is logged in
      router.push("/");
    }
  }, [session, router]);

  return <Login signIn={signIn} />;
}
