const verifyOtp = require("../../../utils/verifyOtp");

export async function POST(req) {
  try {
    const { inputOtp, actualOtp } = await req.json();
    const isValid = verifyOtp(inputOtp, actualOtp);
    return Response.json({ success: isValid });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
