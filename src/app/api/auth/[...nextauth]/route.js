import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createUser, getUserByEmail } from "@/lib/user"; // Helper functions for user database interaction
import prisma from "@/lib/prisma";

export const authOptions = {
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
      // Profile callback is unnecessary; Google already provides needed information
    }),
  ],
  callbacks: {
    // Handle sign-in for both Credentials and Google sign-ins
    async signIn({ account, profile, user }) {
      if (account?.provider === "google") {
        let user = await getUserByEmail(profile?.email);
        if (!user) {
          // Create a new user if one doesn't exist
          user = await prisma.user.create({
            data: {
              username: profile.name, // Assuming username is the first name
              email: profile.email,
              providerId: profile.sub, // Google user ID (sub)
              provider: account?.provider,
              profile: {
                create: {
                  firstName: profile.given_name,
                  lastName: profile.family_name,
                  profilePicture: profile.picture, // Google profile picture
                },
              },
            },
          });
          console.log("New Google User Created:", user);
        }
      }
      return true; // Allow sign-in
    },
    async jwt({ token, account, user, profile }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
      }
      // Include account ID for Google users
      if (account?.provider === "google") {
        const dbUser = await getUserByEmail(token.email);

        if (dbUser) {
          token.id = dbUser.id; // Store the user ID
          token.username = dbUser.username;
          token.role = dbUser.role;
        }
      }

      return token; // Return the updated token
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
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
