"use server";

import { signIn, signOut } from "@/auth";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma-client-inst";

export async function CredentialsSignIn(formData: FormData) {
  const email = await formData.get("Username");
  const password = await formData.get("Password");

  if (!email || !password) {
    return;
  }

  await signIn("credentials", {
    username: email as string,
    password: password as string,
    redirect: true,
    redirectTo: "/dashboard",
  });
}

export async function RegisterAction(formData: FormData) {
  const email = await formData.get("Username");
  const password = await formData.get("Password");

  if (!email || !password) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);

  await prisma.user.create({
    data: {
      email: email as string,
      password: hashedPassword,
    },
  });

  await signIn("credentials", {
    username: email as string,
    password: password as string,
    redirect: true,
    redirectTo: "/dashboard",
  });
}

export async function GoogleSignIn() {
  await signIn("google", { redirect: true, redirectTo: "/account" });
}

export async function SignOutAction() {
  await signOut();
}
