"use client";

import { usePathname } from "next/navigation";
import { isChatScreen } from "@/components/layout/navItems";
import ConversationList from "./ConversationList";

// Two panes on desktop; on mobile either the list or a full-screen chat
export default function MessengerShell({ initialConversations, children }) {
  const pathname = usePathname();
  const inChat = isChatScreen(pathname);
  const activeId = inChat ? pathname.split("/")[2] : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 md:h-[calc(100dvh-4rem)] md:p-4">
      <div className="flex w-full overflow-hidden md:rounded-2xl md:border md:border-stone-200 md:bg-white md:shadow-sm">
        <aside
          className={`${inChat ? "hidden md:flex" : "flex"} w-full flex-col bg-white md:w-80 md:shrink-0 md:border-e md:border-stone-200`}
        >
          <ConversationList initialConversations={initialConversations} activeId={activeId} />
        </aside>
        <section
          className={`${
            inChat ? "fixed inset-0 z-40 flex md:static md:z-auto" : "hidden md:flex"
          } min-w-0 flex-1 flex-col bg-white`}
        >
          {children}
        </section>
      </div>
    </div>
  );
}
