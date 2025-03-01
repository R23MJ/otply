import { GoogleSignIn } from "@/lib/sign-in-actions";
import { Button } from "./ui/button";
import GoogleIcon from "./google-icon";

export default function GoogleSignInButton() {
  return (
    <form className="w-full" action={GoogleSignIn}>
      <Button className="w-full flex justify-start" type="submit">
        <GoogleIcon />
        <p className="flex-1">Continue with Google</p>
      </Button>
    </form>
  );
}
