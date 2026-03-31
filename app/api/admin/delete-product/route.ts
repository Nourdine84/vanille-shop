import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id");

    if (typeof id !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.redirect(new URL("/admin/products", req.url), {
      status: 303,
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}