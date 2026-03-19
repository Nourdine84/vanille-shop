import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // 🔥 IMPORTANT
// ✅ TEMPORAIRE pour éviter crash
export async function GET() {
  return NextResponse.json({
    orders: [],
    message: "Admin orders en construction",
  });
}