import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";
export const revalidate = 0;

type OrderItem = {
  name: string;
  quantity: number;
  priceCents: number;
};

type PaidOrder = {
  items: unknown;
  totalCents: number;
};

export async function GET() {
  try {
    // ✅ Prisma chargé uniquement à l’exécution de la route
    const { prisma } = await import("@/lib/prisma");

    const orders = await prisma.order.findMany({
      where: { status: "PAID" },
      select: {
        items: true,
        totalCents: true,
      },
    });

    const productMap: Record<string, { revenue: number; quantity: number }> = {};
    let totalRevenue = 0;

    (orders as PaidOrder[]).forEach((order: PaidOrder) => {
      totalRevenue += order.totalCents;

      const items = Array.isArray(order.items) ? (order.items as OrderItem[]) : [];

      items.forEach((item: OrderItem) => {
        if (!productMap[item.name]) {
          productMap[item.name] = { revenue: 0, quantity: 0 };
        }

        productMap[item.name].revenue += item.priceCents * item.quantity;
        productMap[item.name].quantity += item.quantity;
      });
    });

    const topRevenueProducts = Object.entries(productMap)
      .map(([name, data]) => ({
        name,
        revenue: data.revenue / 100,
        quantity: data.quantity,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const topQuantityProducts = Object.entries(productMap)
      .map(([name, data]) => ({
        name,
        revenue: data.revenue / 100,
        quantity: data.quantity,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const averageCart =
      orders.length > 0 ? totalRevenue / orders.length / 100 : 0;

    return NextResponse.json({
      topRevenueProducts,
      topQuantityProducts,
      averageCart,
      totalRevenue: totalRevenue / 100,
    });
  } catch (error) {
    console.error("ADVANCED STATS ERROR:", error);

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