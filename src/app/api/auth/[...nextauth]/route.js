import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createUser, getUserByEmail } from "@/lib/user"; // Helper functions for user database interaction
import prisma from "@/lib/prisma";

const authOptions = {
  providers: [
    // Credentials Provider (email/password)
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = await getUserByEmail(credentials.email);
        if (!user) throw new Error("Invalid email or password.");
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),

    // Google OAuth Provider (Gmail registration)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Specify the fields to extract from the Google profile
      profile(profile) {
        return {
          id: profile.sub,
          username: profile.name,
          email: profile.email,
          //image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const user = await getUserByEmail(profile.email);
        if (!user) {
          // // Redirect to error page if user is not registered
          // return "/auth/error?error=google_account_not_registered";
          const newUser = await prisma.user.create({
            data: {
              username: profile.name,
              email: profile.email,
              password: null, // No password for Google OAuth users
              role: "user", // Default role for new users
            },
          });

          console.log(newUser);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error", // Redirect to the error page in case of authentication failure
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
