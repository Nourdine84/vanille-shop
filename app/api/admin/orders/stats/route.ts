import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const [totalOrders, totalRevenue, monthRevenue] =
      await Promise.all([
        prisma.order.count(),

        prisma.order.aggregate({
          _sum: { totalCents: true },
        }),

        prisma.order.aggregate({
          where: {
            createdAt: { gte: startOfMonth },
            status: "PAID",
          },
          _sum: { totalCents: true },
        }),
      ]);

    return NextResponse.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.totalCents || 0,
      monthRevenue: monthRevenue._sum.totalCents || 0,
    });

  } catch (error) {
    console.error("STATS ERROR:", error);

    return NextResponse.json(
      { error: "Erreur stats" },
      { status: 500 }
    );
  }
}