import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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

    /* =========================
       GROUP BY DAY
    ========================= */
    const map: Record<string, number> = {};

    orders.forEach((o) => {
      const date = new Date(o.createdAt)
        .toISOString()
        .slice(0, 10);

      map[date] = (map[date] || 0) + o.totalCents;
    });

    const data = Object.entries(map).map(([date, value]) => ({
      date,
      value: value / 100,
    }));

    return NextResponse.json({ data });

  } catch (error) {
    console.error("CHART ERROR:", error);

    return NextResponse.json(
      { data: [] },
      { status: 500 }
    );
  }
}