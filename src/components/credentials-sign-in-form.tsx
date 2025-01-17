"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useActionState, useEffect, useState } from "react";
import { SignInAction } from "@/lib/sign-in-actions";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CredentialsSignInForm() {
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [data, action, isPending] = useActionState(SignInAction, null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (data?.success) {
      router.push("/dashboard");
    }

    if (!data?.errors) return;

    Object.values(data.errors).forEach((error) => {
      toast.error(`${error}`);
    });
  }, [data, router]);

  return (
    <form className="w-full flex flex-col justify-center gap-2" action={action}>
      <Label className="">Username</Label>
      <Input
        value={formState.username}
        onChange={handleChange}
        id="username"
        name="username"
        type="email"
        required
      />
      <Label>Password</Label>
      <Input
        value={formState.password}
        onChange={handleChange}
        id="password"
        name="password"
        type="password"
        required
      />
      <Button disabled={isPending} className="w-full" type="submit">
        Sign In
      </Button>
    </form>
  );
}
