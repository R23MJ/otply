import ClientId from "@/components/client-id";
import CreateAPIKeyButton from "@/components/create-api-key-button";
import SignOutButton from "@/components/sign-out-button";

export default async function DashboardPage() {
  return (
    <main className="flex flex-col items-center gap-4 w-[60vw] mx-auto">
      <h1 className="font-semibold text-2xl">Dashboard</h1>
      <ClientId />
      <CreateAPIKeyButton />
      <SignOutButton />
    </main>
  );
}
