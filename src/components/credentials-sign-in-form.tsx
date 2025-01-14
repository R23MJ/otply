"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { CredentialsSchema } from "@/lib/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

export function CredentialsSignInForm() {
  const form = useForm<z.infer<typeof CredentialsSchema>>({
    resolver: zodResolver(CredentialsSchema),
    defaultValues: {
      Username: "",
      Password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (formData) => {
    const response = await signIn("credentials", {
      username: formData.Username as string,
      password: formData.Password as string,
      redirect: true,
      redirectTo: "/sign-in",
    });

    if (response?.error) {
      form.setError("Username", {
        type: "manual",
        message: "Invalid credentials",
      });
      form.setError("Password", {
        type: "manual",
        message: "Invalid credentials",
      });
    }
  });

  return (
    <Form {...form}>
      <form
        className="w-full flex flex-col justify-center gap-2"
        onSubmit={handleSubmit}
      >
        {Object.keys(CredentialsSchema.shape).map((key) => (
          <FormField
            control={form.control}
            name={key as "Username" | "Password"}
            key={key}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{key}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={key}
                    type={key === "Password" ? "password" : "text"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button className="w-full" type="submit">
          Sign In
        </Button>
      </form>
    </Form>
  );
}
