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
import { CredentialsSchema } from "@/lib/schemas/credentials";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export function CredentialsSignInForm() {
  const form = useForm<z.infer<typeof CredentialsSchema>>({
    resolver: zodResolver(CredentialsSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (formData) => {
    const response = await signIn("credentials", {
      username: formData.username as string,
      password: formData.password as string,
      redirect: false,
    });

    if (response?.ok) {
      redirect("/dashboard");
    }

    if (response?.error) {
      form.setError("username", {
        type: "manual",
        message: "Invalid credentials",
      });
      form.setError("password", {
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
            name={key as "username" | "password"}
            key={key}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{key}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={key}
                    type={key === "password" ? "password" : "text"}
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
