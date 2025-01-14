import { GoogleSignIn } from "@/lib/sign-in-actions";
import { Button } from "./ui/button";
import GoogleIcon from "./google-icon";

export default function GoogleSignInButton() {
  return (
    <form className="w-full" action={GoogleSignIn}>
      <Button className="w-full flex items-center google-sign-in" type="submit">
        <GoogleIcon />
        Continue with Google
      </Button>
    </form>
  );
}
