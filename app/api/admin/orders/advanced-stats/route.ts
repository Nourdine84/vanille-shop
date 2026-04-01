import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ FIX CRITIQUE

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";
export const revalidate = 0;

/* =========================
   TYPES
========================= */
type OrderItem = {
  name: string;
  quantity: number;
  priceCents: number;
};

/* =========================
   GET ADVANCED STATS
========================= */
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: { status: "PAID" },
      select: {
        items: true,
        totalCents: true,
      },
    });

    const productMap: Record<
      string,
      { revenue: number; quantity: number }
    > = {};

    let totalRevenue = 0;

    for (const order of orders) {
      totalRevenue += order.totalCents;

      /* =========================
         SAFE ITEMS PARSE
      ========================= */
      const items: OrderItem[] = Array.isArray(order.items)
        ? (order.items as OrderItem[])
        : [];

      for (const item of items) {
        if (!productMap[item.name]) {
          productMap[item.name] = {
            revenue: 0,
            quantity: 0,
          };
        }

        productMap[item.name].revenue +=
          item.priceCents * item.quantity;

        productMap[item.name].quantity += item.quantity;
      }
    }

    /* =========================
       TOP PRODUCTS
    ========================= */
    const entries = Object.entries(productMap);

    const topRevenueProducts = entries
      .map(([name, data]) => ({
        name,
        revenue: data.revenue / 100,
        quantity: data.quantity,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const topQuantityProducts = entries
      .map(([name, data]) => ({
        name,
        revenue: data.revenue / 100,
        quantity: data.quantity,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    /* =========================
       KPIs
    ========================= */
    const averageCart =
      orders.length > 0
        ? totalRevenue / orders.length / 100
        : 0;

    return NextResponse.json({
      topRevenueProducts,
      topQuantityProducts,
      averageCart,
      totalRevenue: totalRevenue / 100,
    });

  } catch (error) {
    console.error("🔥 ADVANCED STATS ERROR:", error);

    return NextResponse.json(
      {
        topRevenueProducts: [],
        topQuantityProducts: [],
        averageCart: 0,
        totalRevenue: 0,
      },
      { status: 500 }
    );
  }
}