import ClientId from "@/components/client-id";
import CreateAPIKeyButton from "@/components/create-api-key-button";
import SignOutButton from "@/components/sign-out-button";

export default async function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h1 className="font-semibold text-2xl">Dashboard</h1>
      <ClientId />
      <CreateAPIKeyButton />
      <SignOutButton />
    </div>
  );
}
