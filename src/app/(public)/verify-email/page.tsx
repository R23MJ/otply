import { prisma } from "@/lib/prisma-client-inst";
import { EmailSchema } from "@/lib/schemas/email";
import { OtpSchema } from "@/lib/schemas/otp";
import { verifyOTP } from "@/lib/server-functions/verify-otp";
import { z } from "zod";

const VerifyEmailQuerySchema = z.object({
  email: EmailSchema,
  otp: OtpSchema,
});

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { email, otp } = await searchParams;
  const { data, error } = VerifyEmailQuerySchema.safeParse({ email, otp });

  if (data) {
    const response = await verifyOTP(data.otp, data.email);

    if (response.ok) {
      await prisma.user.update({
        where: { email: data.email },
        data: {
          emailVerified: true,
        },
      });
    }
  }

  return (
    <div>
      <h1>Verify Email</h1>
      <p>
        {!error ? "Your email has been verified." : "Failed to verify email."}
      </p>
    </div>
  );
}
