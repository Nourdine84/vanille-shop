import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Status = "NEW" | "CONTACTED" | "CLOSED";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let id: string | null = null;
    let status: string | null = null;

    // ✅ Support JSON ET FormData
    if (contentType.includes("application/json")) {
      const body = await req.json();
      id = body.id;
      status = body.status;
    } else {
      const formData = await req.formData();
      id = formData.get("id") as string;
      status = formData.get("status") as string;
    }

    const allowed: Status[] = ["NEW", "CONTACTED", "CLOSED"];

    if (!id || !status || !allowed.includes(status as Status)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await prisma.b2BRequest.update({
      where: { id },
      data: { status: status as Status },
    });

    return NextResponse.redirect(new URL("/admin/b2b", req.url), {
      status: 303,
    });

  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}