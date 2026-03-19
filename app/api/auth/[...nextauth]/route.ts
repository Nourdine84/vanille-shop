import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ✅ TEMPORAIRE : désactive NextAuth pour passer le build
export async function GET() {
  return NextResponse.json({
    message: "Auth temporairement désactivée",
  });
}

export async function POST() {
  return NextResponse.json({
    message: "Auth temporairement désactivée",
  });
}