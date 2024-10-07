// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import prisma from "../../../../lib/prisma";

const handler = NextAuth({
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Email/Password Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // Return user object if authentication is successful
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],

  callbacks: {
    async session({ session, token, user }) {
      // Attach the user's ID to the session
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // Custom login page route
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
