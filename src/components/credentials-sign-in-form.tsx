"use client";

import { CredentialsSignIn } from "@/lib/sign-in-actions";
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

export function CredentialsSignInForm() {
  const form = useForm<z.infer<typeof CredentialsSchema>>({
    resolver: zodResolver(CredentialsSchema),
    defaultValues: {
      Username: "",
      Password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="w-full flex flex-col justify-center gap-2"
        action={CredentialsSignIn}
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
