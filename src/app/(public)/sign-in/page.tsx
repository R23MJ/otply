import CredentialsSignInForm from "@/components/credentials-sign-in-form";
import GoogleSignInButton from "@/components/google-sign-in-button";

export default function SignInPage() {
  return (
    <section className="flex flex-col justify-center items-center h-screen w-full p-10 md:w-[300px] md:p-0  gap-4 mx-auto">
      <h1>Sign In</h1>
      <CredentialsSignInForm />
      <GoogleSignInButton />
    </section>
  );
}
