import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Status = "NEW" | "CONTACTED" | "CLOSED";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const id = formData.get("id") as string;
    const status = formData.get("status") as string;

    const allowed: Status[] = ["NEW", "CONTACTED", "CLOSED"];

    if (!id || !status || !allowed.includes(status as Status)) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    await prisma.b2BRequest.update({
      where: { id },
      data: { status: status as Status },
    });

    return NextResponse.redirect(new URL("/admin/b2b", req.url), {
      status: 303,
    });

  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}