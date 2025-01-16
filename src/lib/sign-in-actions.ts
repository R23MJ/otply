"use server";

import { signIn, signOut } from "@/auth";
import { RegisterSchema } from "./schemas";
import { Register } from "./register";

export async function RegisterAction(prevState: unknown, formData: FormData) {
  const { data, error } = RegisterSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!data) {
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

export async function GoogleSignIn() {
  await signIn("google", { redirect: true, redirectTo: "/account" });
}

export async function SignOutAction() {
  await signOut();
}
