import { EmailTemplateProps } from "@/lib/types/email-template-props";
import { Button } from "../ui/button";
import Link from "next/link";

export default function VerifyEmailTemplate({
  otp,
  email,
  url,
}: EmailTemplateProps) {
  return (
    <div className="flex flex-col gap-4">
      <p>
        Click the following button to verify your email:{" "}
        <Button asChild>
          <Link href={`${url}?otp=${otp}&email=${email}`}>Verify Email</Link>
        </Button>
      </p>
    </div>
  );
}
