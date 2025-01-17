import { SessionProvider } from "next-auth/react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <main className="flex flex-col items-center justify-center w-[60vw] h-[80vh] mx-auto">
        {children}
      </main>
    </SessionProvider>
  );
}
