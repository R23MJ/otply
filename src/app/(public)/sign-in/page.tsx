import { CredentialsSignInForm } from "@/components/credentials-sign-in-form";
import GoogleSignInButton from "@/components/google-sign-in-button";

export default function SignInPage() {
  return (
    <section className="flex flex-col justify-center items-center h-screen gap-4 w-[20vw] mx-auto">
      <h1>Sign In</h1>
      <CredentialsSignInForm />
      <GoogleSignInButton />
    </section>
  );
}
