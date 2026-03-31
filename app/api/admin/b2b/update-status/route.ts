import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Status = "NEW" | "CONTACTED" | "CLOSED";

const allowedStatuses: Status[] = ["NEW", "CONTACTED", "CLOSED"];

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let id: string | null = null;
    let status: string | null = null;

    // ✅ Support JSON + FormData
    if (contentType.includes("application/json")) {
      const body = await req.json();
      id = body.id;
      status = body.status;
    } else {
      const formData = await req.formData();
      id = formData.get("id") as string;
      status = formData.get("status") as string;
    }

    // 🔒 VALIDATION
    if (!id || !status || !allowedStatuses.includes(status as Status)) {
      console.error("❌ INVALID B2B UPDATE:", { id, status });

      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    // 🔍 CHECK EXIST
    const existing = await prisma.b2BRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      console.error("❌ B2B NOT FOUND:", id);

      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // 🔄 UPDATE
    await prisma.b2BRequest.update({
      where: { id },
      data: {
        status: status as Status,
      },
    });

    console.log("✅ B2B UPDATED:", id, status);

    // 🔁 REDIRECT SAFE
    return NextResponse.redirect(
      new URL("/admin/b2b", req.url),
      { status: 303 }
    );

  } catch (error) {
    console.error("🔥 B2B UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}