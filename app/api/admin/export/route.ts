import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    const rows = [
      [
        "ID",
        "Email",
        "Statut",
        "Total (€)",
        "Date",
        "Produits",
      ],
    ];

    orders.forEach((order) => {
      const items = Array.isArray(order.items)
        ? (order.items as any[])
        : [];

      const productList = items
        .map((i) => `${i.name} x${i.quantity}`)
        .join(" | ");

      rows.push([
        order.id,
        order.email || "",
        order.status,
        (order.totalCents / 100).toFixed(2),
        new Date(order.createdAt).toLocaleString(),
        productList,
      ]);
    });

    const csv = rows.map((r) => r.join(";")).join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=orders.csv",
      },
    });

  } catch (error) {
    console.error("EXPORT ERROR:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}