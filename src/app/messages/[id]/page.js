import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth";
import { ApiError } from "@/server/errors";
import { getConversationDetails, getMessages } from "@/server/chat";
import ChatView from "@/components/messages/ChatView";

export default async function ConversationPage({ params }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/auth/login?callbackUrl=/messages/${id}`);
  let details, messages;
  try {
    [details, messages] = await Promise.all([getConversationDetails(user, id), getMessages(user, id)]);
  } catch (error) {
    // Someone else's chat looks the same as a missing one
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) notFound();
    throw error;
  }
  return (
    <ChatView
      key={id}
      me={{ id: user.id, name: user.name, image: user.image }}
      initialDetails={details}
      initialMessages={messages}
    />
  );
}
