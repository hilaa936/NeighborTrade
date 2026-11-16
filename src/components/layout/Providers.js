"use client";

import { SessionProvider } from "next-auth/react";
import { UnreadProvider } from "./UnreadProvider";

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <UnreadProvider>{children}</UnreadProvider>
    </SessionProvider>
  );
}
