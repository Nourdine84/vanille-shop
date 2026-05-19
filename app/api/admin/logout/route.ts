import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  cookies().set("admin", "", {
    expires: new Date(0),
    path: "/",
  });

  return NextResponse.json({
    success: true,
  });
}