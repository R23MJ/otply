type OtpEmailTemplateProps = {
  otp: string;
};

export default function OtpEmailTemplate({ otp }: OtpEmailTemplateProps) {
  return (
    <div>
      <h1>Your OTP is: {otp}</h1>
    </div>
  );
}
