import { NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface User {
    twoFactorEnabled?: boolean;
  }

  interface Session {
    twoFactorAuthed?: boolean;
  }
}

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.twoFactorAuthed = !user.twoFactorEnabled;
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      session.twoFactorAuthed = token.twoFactorAuthed as boolean;
      session.user = { ...session.user, id: token.id as string };

      return session;
    },
  },
  providers: [],
} as NextAuthConfig;
