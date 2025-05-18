import { connectDb } from "@/app/lib/mongodb";

export async function GET(request) {
  await connectDb();
  return new Response(JSON.stringify({ message: "Database connected successfully!" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}