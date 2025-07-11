"use server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/lib/db";

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password, isVerified } = await req.json();
    if (!isVerified) {
      return Response.json(
        { success: false, message: "OTP not verified" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
    });
    const { password: _, ...userData } = user.toObject();
    return Response.json({ success: true, user: userData });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
