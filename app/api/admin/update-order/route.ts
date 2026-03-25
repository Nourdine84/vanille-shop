import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const formData = await req.formData();

  const id = formData.get("id");
  const status = formData.get("status");

  if (typeof id !== "string" || typeof status !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await prisma.order.update({
    where: { id },
    data: {
      status: status as
        | "PENDING"
        | "PAID"
        | "SHIPPED"
        | "DELIVERED"
        | "FAILED"
        | "CANCELED",
    },
  });

  return NextResponse.redirect(new URL("/admin", req.url));
}