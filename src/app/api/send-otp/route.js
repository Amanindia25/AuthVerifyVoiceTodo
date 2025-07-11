"use server";
import generateOtp from "@/utils/generateOtp";
import sendEmailOtp from "@/utils/sendEmailOtp";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const otp = generateOtp();
    if (email) {
      await sendEmailOtp(email, otp);
      return Response.json({ success: true, otp });
    } else {
      return Response.json(
        { success: false, message: "Email required" },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
