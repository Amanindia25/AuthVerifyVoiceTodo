const jwt = require("jsonwebtoken");
const Todo = require("../../../models/Todo");
const dbConnect = require("../../../lib/db");

function getUserIdFromAuth(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(req) {
  await dbConnect();
  const userId = getUserIdFromAuth(req);
  if (!userId)
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  const todos = await Todo.find({ userId });
  return Response.json({ success: true, todos });
}

export async function POST(req) {
  await dbConnect();
  const userId = getUserIdFromAuth(req);
  if (!userId)
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  const { title, description } = await req.json();
  const todo = await Todo.create({ title, description, userId });
  return Response.json({ success: true, todo });
}

export async function PUT(req) {
  await dbConnect();
  const userId = getUserIdFromAuth(req);
  if (!userId)
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  const { id, ...update } = await req.json();
  const todo = await Todo.findOneAndUpdate({ _id: id, userId }, update, {
    new: true,
  });
  return Response.json({ success: true, todo });
}

export async function DELETE(req) {
  await dbConnect();
  const userId = getUserIdFromAuth(req);
  if (!userId)
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  const { id } = await req.json();
  await Todo.deleteOne({ _id: id, userId });
  return Response.json({ success: true });
}
