import nodemailer from "nodemailer";

export default async function sendEmailOtp(to, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
    html: `<b>Your OTP code is: ${otp}</b>`,
  });

  return info;
}
