import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export async function POST() {
  // Efface la session signée + l'ancien cookie non signé.
  cookies().set(ADMIN_SESSION_COOKIE, "", {
    expires: new Date(0),
    path: "/",
  });

  cookies().set("admin", "", {
    expires: new Date(0),
    path: "/",
  });

  return NextResponse.json({
    success: true,
  });
}