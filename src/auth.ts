import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import bcrypt from "bcryptjs";

export async function getUser(username: string, password: string) {
  const res = await fetch(`${process.env.OTPLY_URL}/api/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    return null;
  }

  const user = await res.json();
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return null;
  }

  console.log("user", user);
  return user;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await getUser(
          credentials.username as string,
          credentials.password as string
        );

        if (user) {
          return {
            id: user.id.toString(),
            name: user.email,
            email: user.email,
          };
        }

        return null;
      },
    }),
    Google,
  ],
});
