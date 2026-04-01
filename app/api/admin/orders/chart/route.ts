import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");

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

    orders.forEach((o: { createdAt: Date; totalCents: number }) => {
      const date = new Date(o.createdAt).toISOString().slice(0, 10);
      map[date] = (map[date] || 0) + o.totalCents;
    });

    const data = Object.entries(map).map(([date, value]) => ({
      date,
      value: value / 100,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("CHART ERROR:", error);

    return NextResponse.json({ data: [] }, { status: 500 });
  }
}