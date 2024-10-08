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
      // Specify the fields to extract from the Google profile
      async profile(profile) {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });
        if (existingUser) {
          return {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
            //image: profile.picture,
          };
        }
        return null;
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
          const newUser = await createUser({
            username: profile.name,
            email: profile.email,
            password: "",
            provider: "Google",
            profilePicture: profile.picture, // No password for Google OAuth users
            //to do add provider property
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
//export default NextAuth(authOptions);
