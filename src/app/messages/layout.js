import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/server/auth";
import { listConversations } from "@/server/chat";
import MessengerShell from "@/components/messages/MessengerShell";

export async function generateMetadata() {
  const t = await getTranslations("messages");
  return { title: t("title") };
}

export default async function MessagesLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?callbackUrl=/messages");
  const conversations = await listConversations(user);
  return <MessengerShell initialConversations={conversations}>{children}</MessengerShell>;
}
