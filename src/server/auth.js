import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { unauthorized } from "./errors";
import { getUserById, upsertOAuthUser, verifyCredentials } from "./users";

const providers = [
  CredentialsProvider({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      const user = await verifyCredentials(credentials?.email, credentials?.password);
      return user ? { id: user.id, name: user.name, email: user.email } : null;
    },
  }),
];

// Google sign-in is offered only when it is configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions = {
  providers,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        if (!profile?.email || profile.email_verified === false) return false;
        await upsertOAuthUser({
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          provider: "google",
        });
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // On first sign-in, store our own user id (not the provider's) in the token
      if (user && account?.provider === "credentials") token.uid = user.id;
      if (account?.provider === "google") {
        const dbUser = await upsertOAuthUser({ email: token.email, provider: "google" });
        token.uid = dbUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.uid;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
};

// The signed-in user loaded from the database, or null
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  return id ? getUserById(id) : null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw unauthorized();
  return user;
}
