import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: "PAID",
      },
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

    orders.forEach((order) => {
      totalRevenue += order.totalCents;

      const items = order.items as any[];

      items.forEach((item) => {
        if (!productMap[item.name]) {
          productMap[item.name] = {
            revenue: 0,
            quantity: 0,
          };
        }

        productMap[item.name].revenue +=
          item.priceCents * item.quantity;

        productMap[item.name].quantity += item.quantity;
      });
    });

    /* 🔥 TOP PRODUITS PAR CA */
    const topRevenueProducts = Object.entries(productMap)
      .map(([name, data]) => ({
        name,
        revenue: data.revenue / 100,
        quantity: data.quantity,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    /* 🔥 TOP PRODUITS PAR VOLUME */
    const topQuantityProducts = Object.entries(productMap)
      .map(([name, data]) => ({
        name,
        revenue: data.revenue / 100,
        quantity: data.quantity,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    /* 🔥 PANIER MOYEN GLOBAL */
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