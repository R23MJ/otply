"use server";

import { signIn, signOut } from "@/auth";
import { CredentialsSchema } from "./schemas/credentials";
import { Register } from "./server-functions/register";

export async function RegisterAction(prevState: unknown, formData: FormData) {
  const { data, error } = CredentialsSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (error) {
    return { errors: error.flatten().fieldErrors };
  }

  const res = await Register(data);

  if (res.ok) {
    await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: true,
      redirectTo: "/dashboard",
    });

    return;
  }

  return await res.json();
}

export async function SignInAction(prevState: unknown, formData: FormData) {
  const { data, error } = CredentialsSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (error) {
    return { errors: { credentials: ["Invalid credentials"] } };
  }

  try {
    await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });
  } catch (e: unknown) {
    console.log(e);
    return { errors: { credentials: ["Invalid credentials"] } };
  }

  return { success: true };
}

export async function GoogleSignIn() {
  await signIn("google", { redirect: true, redirectTo: "/dashboard" });
}

export async function SignOutAction() {
  await signOut();
}
