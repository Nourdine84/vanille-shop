import { NextResponse } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    if (!isAdminRequest(req)) {
      return unauthorizedResponse();
    }

    const { prisma } = await import("@/lib/prisma");

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalOrders, totalRevenue, monthRevenue] = await Promise.all([
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
      { totalOrders: 0, totalRevenue: 0, monthRevenue: 0 },
      { status: 500 }
    );
  }
}