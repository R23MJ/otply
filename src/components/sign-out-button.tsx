import { SignOutAction } from "@/lib/sign-in-actions";
import { Button } from "./ui/button";

export default function SignOutButton() {
  return (
    <form action={SignOutAction}>
      <Button type="submit">Sign Out</Button>
    </form>
  );
}
