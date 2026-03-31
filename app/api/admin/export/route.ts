import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2);
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    const header = [
      "ID",
      "Date",
      "Email",
      "Status",
      "Total (€)",
    ];

    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toISOString(),
      o.email || "",
      o.status,
      formatPrice(o.totalCents),
    ]);

    const csv = [
      header.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=orders.csv",
      },
    });

  } catch (error) {
    console.error("CSV ERROR:", error);

    return NextResponse.json(
      { error: "Erreur export CSV" },
      { status: 500 }
    );
  }
}