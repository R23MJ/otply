import RegistrationForm from "@/components/registration-form";

export default function RegisterPage() {
  return (
    <section className="flex flex-col justify-center items-center h-screen gap-4 w-full p-10 md:w-[300px] md:p-0 mx-auto">
      <h1>Register</h1>
      <RegistrationForm />
    </section>
  );
}
