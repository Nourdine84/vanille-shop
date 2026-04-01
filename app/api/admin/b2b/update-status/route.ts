import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { prisma } = await import("@/lib/prisma");

    const body = await req.json();

    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await prisma.b2BRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("B2B UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}