"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useActionState, useEffect } from "react";
import { RegisterAction } from "@/lib/sign-in-actions";
import { Label } from "./ui/label";
import { toast } from "sonner";

export function RegistrationForm() {
  const [data, action, isPending] = useActionState(RegisterAction, null);

  useEffect(() => {
    Object.keys(data.errors).forEach((key) => {
      Object.values(data.errors[key]).forEach((error) => {
        toast.error(`${key}: ${error}`);
      });
    });
  }, [data.errors]);

  return (
    <form className="w-full flex flex-col justify-center gap-2" action={action}>
      <Label className="">Username</Label>
      <Input id="username" name="username" type="email" required />
      <Label>Password</Label>
      <Input id="password" name="password" type="password" required />
      <Button disabled={isPending} className="w-full" type="submit">
        Register
      </Button>
    </form>
  );
}
