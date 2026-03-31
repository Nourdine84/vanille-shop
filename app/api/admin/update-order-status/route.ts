import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const id = formData.get("id");
    const status = formData.get("status");

    if (typeof id !== "string" || typeof status !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await prisma.order.update({
      where: { id },
      data: {
        status: status as any,
      },
    });

    return NextResponse.redirect(new URL("/admin", req.url));
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}