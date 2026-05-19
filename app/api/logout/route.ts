import { NextResponse } from "next/server";
import { clearUserSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    clearUserSession();

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return NextResponse.json(
      {
        error: "Erreur logout",
      },
      {
        status: 500,
      }
    );
  }
}