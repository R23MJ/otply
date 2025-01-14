import { RegistrationForm } from "@/components/registration-form";

export default function RegisterPage() {
  return (
    <section className="flex flex-col justify-center items-center h-screen gap-4 w-[20vw] mx-auto">
      <h1>Register</h1>
      <RegistrationForm />
    </section>
  );
}
