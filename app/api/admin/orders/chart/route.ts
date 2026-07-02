import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ FIX CRITIQUE
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";
export const revalidate = 0;

/* =========================
   GET CHART DATA (30 DAYS)
========================= */
export async function GET(req: Request) {
  try {
    if (!isAdminRequest(req)) {
      return unauthorizedResponse();
    }

    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - 30);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: start },
        status: "PAID",
      },
      select: {
        createdAt: true,
        totalCents: true,
      },
    });

    const map: Record<string, number> = {};

    for (const o of orders) {
      const date = new Date(o.createdAt).toISOString().slice(0, 10);

      map[date] = (map[date] || 0) + o.totalCents;
    }

    /* =========================
       SORT BY DATE (IMPORTANT)
    ========================= */
    const data = Object.entries(map)
      .map(([date, value]) => ({
        date,
        value: value / 100,
      }))
      .sort((a, b) => a.date.localeCompare(b.date)); // ✅ FIX UX

    return NextResponse.json({ data });

  } catch (error) {
    console.error("🔥 CHART ERROR:", error);

    return NextResponse.json(
      { data: [] },
      { status: 500 }
    );
  }
}