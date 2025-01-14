import { auth } from "@/auth";
import { Input } from "./ui/input";

export default async function ClientId() {
  const session = await auth();

  return (
    <>
      {session?.user ? (
        <Input
          className="border border-black bg-gray-600 text-white text-center"
          readOnly
          value={session?.user?.id}
        />
      ) : (
        <Input disabled value="" />
      )}
    </>
  );
}
