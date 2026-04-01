import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Status = "NEW" | "CONTACTED" | "CLOSED";

const allowedStatuses: Status[] = ["NEW", "CONTACTED", "CLOSED"];

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let id: string | null = null;
    let status: string | null = null;

    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => null);
      id = body?.id ?? null;
      status = body?.status ?? null;
    } else {
      const formData = await req.formData();
      id = (formData.get("id") as string) || null;
      status = (formData.get("status") as string) || null;
    }

    if (!id || !status || !allowedStatuses.includes(status as Status)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const existing = await prisma.b2BRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    await prisma.b2BRequest.update({
      where: { id },
      data: { status: status as Status },
    });

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