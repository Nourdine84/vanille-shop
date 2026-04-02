import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL || "undefined",
  });
}