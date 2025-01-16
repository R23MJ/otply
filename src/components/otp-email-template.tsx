import Link from "next/link";
import { Button } from "./ui/button";

type OtpEmailTemplateProps = {
  otp: string;
  url: string | null;
};

export default function OtpEmailTemplate({ otp, url }: OtpEmailTemplateProps) {
  return (
    <div>
      {url && (
        <Button asChild>
          <Link href={`${url}?otp=${otp}`}>Verify</Link>
        </Button>
      )}
    </div>
  );
}
