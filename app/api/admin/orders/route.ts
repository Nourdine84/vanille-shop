import { NextResponse } from "next/server";

// ✅ TEMPORAIRE pour éviter crash
export async function GET() {
  return NextResponse.json({
    orders: [],
    message: "Admin orders en construction",
  });
}