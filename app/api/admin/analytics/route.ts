import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* =========================
   GET ANALYTICS
========================= */

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: { status: "PAID" },
      orderBy: { createdAt: "asc" },
    });

    /* ================= KPI ================= */

    const totalRevenue = orders.reduce((acc, o) => acc + o.totalCents, 0);
    const totalOrders = orders.length;
    const avgBasket =
      totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    /* ================= GRAPH ================= */

    const map = new Map<string, { revenue: number; orders: number }>();

    orders.forEach((o) => {
      const key = new Date(o.createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      });

      if (!map.has(key)) {
        map.set(key, { revenue: 0, orders: 0 });
      }

      map.get(key)!.revenue += o.totalCents / 100;
      map.get(key)!.orders += 1;
    });

    const labels = Array.from(map.keys());
    const revenue = labels.map((k) => map.get(k)!.revenue);
    const ordersCount = labels.map((k) => map.get(k)!.orders);

    /* ================= TOP PRODUITS ================= */

    const productMap = new Map<
      string,
      { name: string; qty: number; revenue: number }
    >();

    orders.forEach((order) => {
      const items = Array.isArray(order.items) ? order.items : [];

      items.forEach((item: any) => {
        if (!productMap.has(item.id)) {
          productMap.set(item.id, {
            name: item.name,
            qty: 0,
            revenue: 0,
          });
        }

        const p = productMap.get(item.id)!;
        p.qty += item.quantity;
        p.revenue += item.priceCents * item.quantity;
      });
    });

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    /* ================= CATEGORY ================= */

    const categoryMap = new Map<string, number>();

    orders.forEach((order) => {
      const items = Array.isArray(order.items) ? order.items : [];

      items.forEach((item: any) => {
        const cat = item.category || "Autre";
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + item.quantity);
      });
    });

    const categories = Array.from(categoryMap.entries()).map(
      ([name, value]) => ({ name, value })
    );

    return NextResponse.json({
      kpis: {
        totalRevenue,
        totalOrders,
        avgBasket,
      },
      chart: {
        labels,
        revenue,
        orders: ordersCount,
      },
      topProducts,
      categories,
    });
  } catch (error) {
    console.error("🔥 ANALYTICS ERROR:", error);

    return NextResponse.json(
      {
        kpis: {},
        chart: { labels: [], revenue: [], orders: [] },
        topProducts: [],
        categories: [],
      },
      { status: 500 }
    );
  }
}